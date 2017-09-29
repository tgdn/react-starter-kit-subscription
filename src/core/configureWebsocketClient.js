import { rtcConnected, rtcConnecting, rtcDisconnected } from 'actions/rtc';

export default (store, client) => {
  const connected = () => store.dispatch(rtcConnected());
  const connecting = () => store.dispatch(rtcConnecting());

  client.on('connected', connected);
  client.on('reconnected', connected);

  client.on('connecting', connecting);
  client.on('reconnecting', connecting);

  client.on('disconnected', () => store.dispatch(rtcDisconnected()));
};
