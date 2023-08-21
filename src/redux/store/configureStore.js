
import { createStore } from 'redux'
import { combineReducers } from 'redux'
// {-------Reducers-------}
import userReducer from '../reducers/userReducer';


const rootReducer = combineReducers(
    {
        user: userReducer,
    }
);

const configureStore = () => {
    return createStore(rootReducer);
}
export default configureStore;