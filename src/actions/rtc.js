/* eslint-disable no-use-before-define */

import {
  RTC_CONNECTED,
  RTC_CONNECTING,
  RTC_DISCONNECTED,
  RTC_SOCKET_UNAVAILABLE,
  RTC_SOCKET_AVAILABLE,
} from '../constants/index';

export const rtcConnecting = () => dispatch => {
  dispatch({ type: RTC_CONNECTING });
};

export const rtcConnected = socket => dispatch => {
  dispatch({ type: RTC_CONNECTED, payload: socket });
};

export const rtcDisconnected = () => dispatch => {
  dispatch({ type: RTC_DISCONNECTED });
};

export const rtcSocketUnavailable = () => dispatch => {
  dispatch({ type: RTC_SOCKET_UNAVAILABLE });
};

export const rtcSocketAvailable = () => dispatch => {
  dispatch({ type: RTC_SOCKET_AVAILABLE });
};
