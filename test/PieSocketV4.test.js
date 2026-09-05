import '@babel/polyfill';
import PieSocket from '../src/PieSocket';

const mockSockets = [];
const mockSend = jest.fn();

jest.mock('../src/misc/WebSocket.js', () => {
  return jest.fn().mockImplementation(function(endpoint) {
    this.endpoint = endpoint;
    this.send = mockSend;
    this.close = jest.fn();
    mockSockets.push(this);
  });
});

const lastSocket = () => mockSockets[mockSockets.length - 1];
const flush = () => new Promise((r) => setTimeout(r, 0));
const frames = () => mockSend.mock.calls.map((c) => JSON.parse(c[0]));

// The multiplexed path is browser-only; give it a WebSocket global so it runs
// the real flow instead of the SSR shortcut (the socket itself is mocked).
beforeAll(() => {
  global.WebSocket = function() {};
});
afterAll(() => {
  delete global.WebSocket;
});

beforeEach(() => {
  mockSockets.length = 0;
  mockSend.mockClear();
});

describe('PieSocket v4 — shared connection', () => {
  const newClient = () => new PieSocket({
    version: 4, clusterId: 'nyc1', apiKey: 'xxx', notifySelf: 0,
  });

  it('opens one /v4/ socket for the first subscribe', async () => {
    const piesocket = newClient();
    const pending = piesocket.subscribe('room-1');
    await flush();

    expect(mockSockets.length).toBe(1);
    expect(lastSocket().endpoint).toContain('/v4/room-1?');

    lastSocket().onopen({});
    const channel = await pending;
    expect(channel.channelId).toBe('room-1');
    expect(piesocket.getConnections()['room-1']).toBe(channel);
  });

  it('two concurrent first subscribes share one socket instead of orphaning one', async () => {
    const piesocket = newClient();

    // Neither call is awaited before the other starts — both see `_multiplex`
    // unset while the first is still awaiting getEndpoint().
    const p1 = piesocket.subscribe('room-1');
    const p2 = piesocket.subscribe('room-2');
    await flush();

    expect(mockSockets.length).toBe(1);
    lastSocket().onopen({});

    const room1 = await p1;
    lastSocket().onmessage({
      data: JSON.stringify({event: 'system::subscribe_success', data: {channel: 'room-2'}}),
    });
    const room2 = await p2;

    expect(room1.channelId).toBe('room-1');
    expect(room2.channelId).toBe('room-2');
    expect(piesocket._multiplex.channels['room-1']).toBe(room1);
    expect(piesocket._multiplex.channels['room-2']).toBe(room2);
  });

  it('reuses the socket and sends system::subscribe for a second channel', async () => {
    const piesocket = newClient();
    const p1 = piesocket.subscribe('room-1');
    await flush();
    lastSocket().onopen({});
    await p1;

    mockSend.mockClear();
    const p2 = piesocket.subscribe('room-2');
    await flush();

    expect(mockSockets.length).toBe(1);
    expect(frames()).toContainEqual(
        expect.objectContaining({
          event: 'system::subscribe',
          data: expect.objectContaining({channel: 'room-2'}),
        }),
    );

    lastSocket().onmessage({
      data: JSON.stringify({event: 'system::subscribe_success', data: {channel: 'room-2'}}),
    });
    const channel = await p2;
    expect(channel.channelId).toBe('room-2');
  });

  it('routes published messages back to the right channel handle', async () => {
    const piesocket = newClient();
    const p1 = piesocket.subscribe('room-1');
    await flush();
    lastSocket().onopen({});
    await p1;

    const p2 = piesocket.subscribe('room-2');
    await flush();
    lastSocket().onmessage({
      data: JSON.stringify({event: 'system::subscribe_success', data: {channel: 'room-2'}}),
    });
    const room2 = await p2;

    let got;
    room2.listen('chat', (data) => {
      got = data;
    });

    lastSocket().onmessage({
      data: JSON.stringify({event: 'chat', data: 'hello', 'system::channel': 'room-2'}),
    });
    expect(got).toBe('hello');
  });

  it('unsubscribing a secondary channel sends system::unsubscribe', async () => {
    const piesocket = newClient();
    const p1 = piesocket.subscribe('room-1');
    await flush();
    lastSocket().onopen({});
    await p1;

    const p2 = piesocket.subscribe('room-2');
    await flush();
    lastSocket().onmessage({
      data: JSON.stringify({event: 'system::subscribe_success', data: {channel: 'room-2'}}),
    });
    await p2;

    mockSend.mockClear();
    expect(piesocket.unsubscribe('room-2')).toBe(true);
    expect(frames()).toContainEqual({event: 'system::unsubscribe', data: {channel: 'room-2'}});
    expect(piesocket.getConnections()['room-2']).toBeUndefined();
  });

  it('unsubscribing the primary promotes another channel', async () => {
    const piesocket = newClient();
    const p1 = piesocket.subscribe('room-1');
    await flush();
    lastSocket().onopen({});
    await p1;

    const p2 = piesocket.subscribe('room-2');
    await flush();
    lastSocket().onmessage({
      data: JSON.stringify({event: 'system::subscribe_success', data: {channel: 'room-2'}}),
    });
    await p2;

    piesocket.unsubscribe('room-1');
    await flush();

    expect(piesocket._multiplex.primaryChannelId).toBe('room-2');
    expect(lastSocket().endpoint).toContain('/v4/room-2?');
    expect(piesocket.getConnections()['room-1']).toBeUndefined();
  });

  it('portal rooms ride the shared v4 socket and get a PieRTC attached', async () => {
    const piesocket = newClient();
    const pending = piesocket.subscribe('video-room', {audio: true});
    await flush();

    expect(mockSockets.length).toBe(1);
    expect(lastSocket().endpoint).toContain('/v4/video-room?');

    lastSocket().onopen({});
    const channel = await pending;
    expect(channel.channelId).toBe('video-room');
    expect(channel.pieRTC).toBeTruthy();
    // Mirrors v3 Portal's forced notifySelf so peers' own signalling can echo back.
    expect(piesocket.options.notifySelf).toBe(true);
  });

  it('a second portal room subscribed onto an already-open socket also gets PieRTC', async () => {
    const piesocket = newClient();
    const p1 = piesocket.subscribe('room-1');
    await flush();
    lastSocket().onopen({});
    await p1;

    const p2 = piesocket.subscribe('video-room-2', {video: true});
    await flush();
    lastSocket().onmessage({
      data: JSON.stringify({event: 'system::subscribe_success', data: {channel: 'video-room-2'}}),
    });
    const channel = await p2;

    expect(channel.channelId).toBe('video-room-2');
    expect(channel.pieRTC).toBeTruthy();
  });

  it('pieRTC: true (no video/audio) attaches PieRTC — v4\'s own flag, not v3\'s portal', async () => {
    const piesocket = newClient();
    const pending = piesocket.subscribe('watch-only-room', {pieRTC: true});
    await flush();
    lastSocket().onopen({});

    const channel = await pending;
    expect(channel.pieRTC).toBeTruthy();
  });

  it('portal: true alone does NOT attach PieRTC under v4 (v3-only flag)', async () => {
    const piesocket = newClient();
    const pending = piesocket.subscribe('not-a-room', {portal: true});
    await flush();
    lastSocket().onopen({});

    const channel = await pending;
    expect(channel.pieRTC).toBeFalsy();
  });

  it('re-subscribing an already-open channel with {video: true} does not retroactively attach PieRTC', async () => {
    const piesocket = newClient();
    const p1 = piesocket.subscribe('room-1');
    await flush();
    lastSocket().onopen({});
    const first = await p1;
    expect(first.pieRTC).toBeFalsy();

    const second = await piesocket.subscribe('room-1', {video: true});
    expect(second).toBe(first);
    expect(second.pieRTC).toBeFalsy();
  });
});

describe('PieSocket v4 — SSR / no WebSocket global', () => {
  // The file-level beforeAll above sets a global.WebSocket for every test in
  // this file; undo it here to mirror a real SSR/Node environment, where
  // PieRTC must not be constructed since its constructor calls getUserMedia().
  beforeAll(() => {
    delete global.WebSocket;
  });
  afterAll(() => {
    global.WebSocket = function() {};
  });

  const newClient = () => new PieSocket({
    version: 4, clusterId: 'nyc1', apiKey: 'xxx', notifySelf: 0,
  });

  it('does not construct PieRTC for a portal room when there is no WebSocket global', async () => {
    const piesocket = newClient();
    const channel = await piesocket.subscribe('video-room', {video: true});

    expect(channel.channelId).toBe('video-room');
    expect(channel.pieRTC).toBeFalsy();
  });

  it('does not construct PieRTC for a second portal room joining an existing SSR connection', async () => {
    const piesocket = newClient();
    await piesocket.subscribe('room-1');

    const channel = await piesocket.subscribe('video-room-2', {audio: true});

    expect(channel.channelId).toBe('video-room-2');
    expect(channel.pieRTC).toBeFalsy();
  });
});
