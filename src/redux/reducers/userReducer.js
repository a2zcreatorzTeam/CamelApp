import {USER, LOGOUT} from '../constants';

const initialState = {
  user: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return {
        user: {},
      };
    default:
      return state;
  }
};
export default userReducer;
