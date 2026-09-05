import '@babel/polyfill';
import Channel from '../src/Channel';

jest.mock('../src/misc/WebSocket.js', () => {
  return jest.fn().mockImplementation(() => ({send: jest.fn(), close: jest.fn()}));
});

const makeV4Channel = (hub) => {
  const channel = new Channel(null, null, false);
  channel.attachToConnection(hub || null, 'room-1', {version: 4});
  channel.uuid = 'me';
  return channel;
};

const frame = (event, data) => ({event, data});

describe('Channel — v4 delta presence', () => {
  it('seeds the roster from system::member_list', () => {
    const channel = makeV4Channel();
    channel.handleFrame(frame('system::member_list', {
      channel: 'room-1', members: [{uuid: 'a'}, {uuid: 'b'}], count: 2,
    }));
    expect(channel.members).toEqual([{uuid: 'a'}, {uuid: 'b'}]);
  });

  it('appends a single member on system::member_joined', () => {
    const channel = makeV4Channel();
    channel.members = [{uuid: 'a'}];
    channel.handleFrame(frame('system::member_joined', {
      channel: 'room-1', member: {uuid: 'b'}, count: 2,
    }));
    expect(channel.members).toEqual([{uuid: 'a'}, {uuid: 'b'}]);
  });

  it('does not duplicate a member that is already on the roster', () => {
    const channel = makeV4Channel();
    channel.members = [{uuid: 'a'}];
    channel.handleFrame(frame('system::member_joined', {member: {uuid: 'a'}, count: 1}));
    expect(channel.members).toEqual([{uuid: 'a'}]);
  });

  it('removes the member on system::member_left', () => {
    const channel = makeV4Channel();
    channel.members = [{uuid: 'a'}, {uuid: 'b'}];
    channel.handleFrame(frame('system::member_left', {member: {uuid: 'a'}, count: 1}));
    expect(channel.members).toEqual([{uuid: 'b'}]);
  });

  it('handles string members (anonymous identities)', () => {
    const channel = makeV4Channel();
    channel.handleFrame(frame('system::member_joined', {member: 'anon:1'}));
    channel.handleFrame(frame('system::member_joined', {member: 'anon:2'}));
    channel.handleFrame(frame('system::member_left', {member: 'anon:1'}));
    expect(channel.members).toEqual(['anon:2']);
  });

  it('keeps the v3 whole-roster behaviour when version is not 4', () => {
    const channel = new Channel(null, null, false);
    channel.attachToConnection(null, 'room-1', {version: 3});
    channel.handleFrame(frame('system:member_joined', {members: [{uuid: 'a'}, {uuid: 'b'}]}));
    expect(channel.members).toEqual([{uuid: 'a'}, {uuid: 'b'}]);
  });
});

describe('Channel — v4 send path', () => {
  it('publish() delegates to the hub for its channel', async () => {
    const hub = {send: jest.fn()};
    const channel = makeV4Channel(hub);

    await channel.publish('chat', {text: 'hi'}, {x: 1});

    expect(hub.send).toHaveBeenCalledWith('room-1', {
      event: 'chat', data: {text: 'hi'}, meta: {x: 1},
    });
  });

  it('refreshMembers() asks the hub to re-sync', () => {
    const hub = {requestMembers: jest.fn().mockResolvedValue([{uuid: 'a'}])};
    const channel = makeV4Channel(hub);

    channel.refreshMembers();
    expect(hub.requestMembers).toHaveBeenCalledWith('room-1');
  });

  it('refreshMembers() resolves with the current roster without a hub', async () => {
    const channel = makeV4Channel();
    channel.members = [{uuid: 'z'}];
    await expect(channel.refreshMembers()).resolves.toEqual([{uuid: 'z'}]);
  });
});

describe('Channel — v4 PieRTC dispatch', () => {
  const makePieRTCChannel = () => {
    const channel = makeV4Channel();
    channel.pieRTC = {
      requestOfferFromPeer: jest.fn(),
      onRemoteScreenStopped: jest.fn(),
      shareVideo: jest.fn(),
      addIceCandidate: jest.fn(),
      createAnswer: jest.fn(),
      handleAnswer: jest.fn(),
      removeParticipant: jest.fn(),
    };
    return channel;
  };

  it('routes rtc::broadcaster from a peer to requestOfferFromPeer', () => {
    const channel = makePieRTCChannel();
    channel.handleFrame(frame('rtc::broadcaster', {from: 'peer-1'}));
    expect(channel.pieRTC.requestOfferFromPeer).toHaveBeenCalledWith({from: 'peer-1'});
  });

  it('ignores rtc::broadcaster echoed back from itself', () => {
    const channel = makePieRTCChannel();
    channel.handleFrame(frame('rtc::broadcaster', {from: 'me'}));
    expect(channel.pieRTC.requestOfferFromPeer).not.toHaveBeenCalled();
  });

  it('routes rtc::offer addressed to this uuid to createAnswer', () => {
    const channel = makePieRTCChannel();
    channel.handleFrame(frame('rtc::offer', {from: 'peer-1', to: 'me', sdp: {}}));
    expect(channel.pieRTC.createAnswer).toHaveBeenCalledWith({from: 'peer-1', to: 'me', sdp: {}});
  });

  it('routes rtc::candidate addressed to this uuid to addIceCandidate', () => {
    const channel = makePieRTCChannel();
    channel.handleFrame(frame('rtc::candidate', {from: 'peer-1', to: 'me', ice: {}}));
    expect(channel.pieRTC.addIceCandidate).toHaveBeenCalled();
  });

  it('removes the PieRTC participant on system::member_left', () => {
    const channel = makePieRTCChannel();
    channel.handleFrame(frame('system::member_left', {member: {uuid: 'peer-1'}, count: 0}));
    expect(channel.pieRTC.removeParticipant).toHaveBeenCalledWith('peer-1');
  });

  it('does not throw on an rtc:: event for a channel with no PieRTC attached', () => {
    // A plain (non-PieRTC) subscriber sharing a channel name with a PieRTC
    // room still receives its rtc:: broadcasts — must not crash on dispatch.
    const channel = makeV4Channel();
    expect(channel.pieRTC).toBeFalsy();
    expect(() => {
      channel.handleFrame(frame('rtc::broadcaster', {from: 'peer-1'}));
      channel.handleFrame(frame('rtc::offer', {from: 'peer-1', to: 'me', sdp: {}}));
      channel.handleFrame(frame('rtc::candidate', {from: 'peer-1', to: 'me', ice: {}}));
      channel.handleFrame(frame('rtc::answer', {from: 'peer-1', to: 'me', sdp: {}}));
    }).not.toThrow();
  });
});
