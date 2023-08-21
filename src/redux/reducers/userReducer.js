import { USER } from '../constants';

const initialState = {
    user: {}
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
}
export default userReducer;