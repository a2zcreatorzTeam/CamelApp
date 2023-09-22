import {USER, LOGOUT} from '../constants';

export function userData(user) {
  return {
    type: USER,
    payload: user,
  };
}

export function userLogout() {
  return {
    type: LOGOUT,
  };
}
