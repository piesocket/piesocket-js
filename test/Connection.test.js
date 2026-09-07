import '@babel/polyfill';
import Connection from '../src/Connection';
import Channel from '../src/Channel';

// jest 27's node test environment doesn't curate the global Blob that Node
// itself has had since v18 — pull it in explicitly so the Blob-send test
// exercises the real class instead of skipping.
if (typeof Blob === 'undefined') {
  global.Blob = require('buffer').Blob;
}

// Controllable WebSocket mock — captures every instance so tests can drive its
// lifecycle handlers by hand. `mock`-prefixed names are the only out-of-scope
// refs jest.mock() allows.
const mockSockets = [];
const mockSend = jest.fn();
const mockClose = jest.fn();

jest.mock('../src/misc/WebSocket.js', () => {
  return jest.fn().mockImplementation(function(endpoint) {
    this.endpoint = endpoint;
    this.send = mockSend;
    this.close = mockClose;
    this.binaryType = '';
    mockSockets.push(this);
  });
});

const lastSocket = () => mockSockets[mockSockets.length - 1];

const attach = (conn, channelId, {primary = false} = {}) => {
  const channel = new Channel(null, null, false);
  channel.attachToConnection(conn, channelId, {version: 4});
  channel.uuid = channelId + '-uuid';
  if (!primary) {
    channel.subscribeParams = {channel: channelId, presence: false, uuid: channel.uuid};
  }
  conn.attachChannel(channelId, channel);
  return channel;
};

const lastFrame = () => JSON.parse(mockSend.mock.calls[mockSend.mock.calls.length - 1][0]);

beforeEach(() => {
  mockSockets.length = 0;
  mockSend.mockClear();
  mockClose.mockClear();
});

describe('Connection', () => {
  it('opens a socket to the given endpoint', () => {
    new Connection('wss://x/v4/room-1', {}, 'room-1');
    expect(lastSocket().endpoint).toBe('wss://x/v4/room-1');
  });

  it('fires onPrimaryConnected when the socket opens', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    const onConnected = jest.fn();
    conn.onPrimaryConnected = onConnected;

    lastSocket().onopen({});

    expect(onConnected).toHaveBeenCalled();
    expect(conn.connected).toBe(true);
  });

  it('sends a system::subscribe frame and resolves on subscribe_success', async () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});

    const params = {channel: 'room-2', presence: true, uuid: 'u2'};
    const pending = conn.subscribeChannel('room-2', params);

    expect(lastFrame()).toEqual({event: 'system::subscribe', data: params});

    lastSocket().onmessage({
      data: JSON.stringify({event: 'system::subscribe_success', data: {channel: 'room-2'}}),
    });

    await expect(pending).resolves.toEqual({channel: 'room-2'});
  });

  it('rejects the subscribe promise on subscribe_error', async () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});

    const pending = conn.subscribeChannel('room-2', {channel: 'room-2'});
    lastSocket().onmessage({
      data: JSON.stringify({
        event: 'system::subscribe_error',
        data: {channel: 'room-2', error: 'nope'},
      }),
    });

    await expect(pending).rejects.toThrow('nope');
  });

  it('tags secondary sends with system::channel but not the primary', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});

    conn.send('room-1', {event: 'chat', data: 'hi'});
    expect(lastFrame()).toEqual({event: 'chat', data: 'hi'});

    conn.send('room-2', {event: 'chat', data: 'yo'});
    expect(lastFrame()).toEqual({event: 'chat', data: 'yo', 'system::channel': 'room-2'});
  });

  it('sends an ArrayBuffer raw instead of JSON.stringify-ing it (regression)', () => {
    // typeof arrayBuffer === 'object' is true — send() must check for a
    // binary payload before falling into the generic object/JSON branch, or
    // this silently sends "{}" instead of the actual bytes.
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});
    mockSend.mockClear();

    const buffer = new Uint8Array([1, 2, 3]).buffer;
    conn.send('room-1', buffer);

    expect(mockSend).toHaveBeenCalledWith(buffer);
  });

  it('sends a Uint8Array (TypedArray view) raw too, on the primary channel', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});
    mockSend.mockClear();

    const bytes = new Uint8Array([1, 2, 3]);
    conn.send('room-1', bytes);

    expect(mockSend).toHaveBeenCalledWith(bytes);
  });

  it('JSON-smuggles binary sent on a secondary channel instead of sending it raw', () => {
    // Raw bytes carry no room for a channel tag, and the server always
    // attributes a raw binary frame to the primary channel — so a secondary
    // channel's binary send has to go as a JSON text frame instead, tagged
    // with system::channel like any other secondary-channel message.
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});
    mockSend.mockClear();

    const buffer = new Uint8Array([1, 2, 3]).buffer;
    conn.send('room-2', buffer);

    expect(lastFrame()).toEqual({
      event: 'pie::binary',
      'system::channel': 'room-2',
      data: Buffer.from([1, 2, 3]).toString('base64'),
    });
  });

  it('JSON-smuggles a Blob sent on a secondary channel (async)', async () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});
    mockSend.mockClear();

    const blob = new Blob([new Uint8Array([1, 2, 3])]);
    await conn.send('room-2', blob);

    expect(lastFrame()).toEqual({
      event: 'pie::binary',
      'system::channel': 'room-2',
      data: Buffer.from([1, 2, 3]).toString('base64'),
    });
  });

  it('routes an inbound frame to the channel named by system::channel', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    const primary = attach(conn, 'room-1', {primary: true});
    const secondary = attach(conn, 'room-2');
    lastSocket().onopen({});

    const primarySpy = jest.spyOn(primary, 'dispatch');
    const secondarySpy = jest.spyOn(secondary, 'dispatch');

    conn.onMessage({
      data: JSON.stringify({event: 'chat', data: 'x', 'system::channel': 'room-2'}),
    });

    expect(secondarySpy).toHaveBeenCalled();
    expect(primarySpy).not.toHaveBeenCalled();
  });

  it('routes an inbound frame with no channel to the primary', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    const primary = attach(conn, 'room-1', {primary: true});
    lastSocket().onopen({});

    const primarySpy = jest.spyOn(primary, 'dispatch');
    conn.onMessage({data: JSON.stringify({event: 'chat', data: 'x'})});

    expect(primarySpy).toHaveBeenCalled();
  });

  it('decodes a system::binary frame and routes it', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    const primary = attach(conn, 'room-1', {primary: true});
    lastSocket().onopen({});

    let received;
    primary.listen('system::binary', (data) => {
      received = data;
    });

    const b64 = Buffer.from('hello').toString('base64');
    conn.onMessage({data: JSON.stringify({event: 'system::binary', data: b64})});

    expect(Buffer.from(received).toString()).toBe('hello');
  });

  it('decodes a JSON-smuggled secondary-channel binary frame and routes it, as system::binary', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    const primary = attach(conn, 'room-1', {primary: true});
    const secondary = attach(conn, 'room-2');
    lastSocket().onopen({});

    let received;
    secondary.listen('system::binary', (data) => {
      received = data;
    });
    const primarySpy = jest.spyOn(primary, 'dispatch');

    const b64 = Buffer.from('hello').toString('base64');
    conn.onMessage({
      data: JSON.stringify({event: 'pie::binary', 'system::channel': 'room-2', data: b64}),
    });

    expect(Buffer.from(received).toString()).toBe('hello');
    expect(primarySpy).not.toHaveBeenCalled();
  });

  it('requests members and resolves with the refreshed roster', async () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    const primary = attach(conn, 'room-1', {primary: true});
    lastSocket().onopen({});

    const pending = conn.requestMembers('room-1');
    expect(lastFrame()).toEqual({event: 'system::get_members', data: {channel: 'room-1'}});

    conn.onMessage({
      data: JSON.stringify({
        event: 'system::member_list',
        data: {channel: 'room-1', members: [{uuid: 'a'}, {uuid: 'b'}], count: 2},
      }),
    });

    await expect(pending).resolves.toEqual([{uuid: 'a'}, {uuid: 'b'}]);
  });

  it('replays secondary subscriptions after a reconnect', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    attach(conn, 'room-1', {primary: true});
    attach(conn, 'room-2');
    lastSocket().onopen({});
    mockSend.mockClear();

    // Socket drops and reconnects.
    lastSocket().onclose({});
    lastSocket().onopen({});

    const frames = mockSend.mock.calls.map((c) => JSON.parse(c[0]));
    expect(frames).toContainEqual({
      event: 'system::subscribe',
      data: {channel: 'room-2', presence: false, uuid: 'room-2-uuid'},
    });
  });

  it('does not reconnect after close()', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    lastSocket().onopen({});
    const socketCount = mockSockets.length;

    conn.close();
    lastSocket().onclose({});

    expect(mockSockets.length).toBe(socketCount);
  });

  it('migrates the primary onto a new socket, keeping other channels', () => {
    const conn = new Connection('wss://x/v4/room-1', {}, 'room-1');
    attach(conn, 'room-1', {primary: true});
    attach(conn, 'room-2');
    attach(conn, 'room-3');
    lastSocket().onopen({});

    conn.migratePrimary('room-2', 'wss://x/v4/room-2');
    expect(lastSocket().endpoint).toBe('wss://x/v4/room-2');
    expect(conn.primaryChannelId).toBe('room-2');

    mockSend.mockClear();
    lastSocket().onopen({});

    const frames = mockSend.mock.calls.map((c) => JSON.parse(c[0]));
    // room-3 is re-subscribed; room-2 is now the URL primary, not a control frame.
    expect(frames).toContainEqual({
      event: 'system::subscribe',
      data: {channel: 'room-3', presence: false, uuid: 'room-3-uuid'},
    });
    expect(frames).not.toContainEqual(
        expect.objectContaining({data: expect.objectContaining({channel: 'room-2'})}),
    );
  });
});
