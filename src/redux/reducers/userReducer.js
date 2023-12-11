import {USER, LOGOUT} from '../constants';

const initialState = {
  user: null,
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
        user: null,
      };
    default:
      return state;
  }
};
export default userReducer;
