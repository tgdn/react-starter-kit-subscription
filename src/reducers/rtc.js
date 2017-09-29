import {
  RTC_SET_SOCKET,
  RTC_CONNECTED,
  RTC_CONNECTING,
  RTC_DISCONNECTED,
  RTC_SOCKET_UNAVAILABLE,
  RTC_SOCKET_AVAILABLE,
} from '../constants/index';

const initialState = {
  socket: null,
  connected: false,
  connecting: true,
  socketAvailable: true,
};

export default function rtc(state = initialState, action) {
  switch (action.type) {
    case RTC_SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    case RTC_CONNECTED:
      return {
        ...state,
        socket: action.payload,
        connecting: false,
        connected: true,
      };
    case RTC_DISCONNECTED:
      return {
        ...state,
        connected: false,
        connecting: false,
      };
    case RTC_CONNECTING:
      return {
        ...state,
        connected: false,
        connecting: true,
      };
    case RTC_SOCKET_UNAVAILABLE:
      return {
        ...state,
        socketAvailable: false,
      };
    case RTC_SOCKET_AVAILABLE:
      return {
        ...state,
        socketAvailable: true,
      };
    default:
      return state;
  }
}
