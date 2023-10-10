import {createStore} from 'redux';
import {combineReducers} from 'redux';
// {-------Reducers-------}
import userReducer from '../reducers/userReducer';

const rootReducer = combineReducers({
  user: userReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {persistStore, persistReducer} from 'redux-persist';
// import userReducer from '../reducers/userReducer';

// import {createStore} from 'redux';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
// };

// const persistedReducer = persistReducer(persistConfig, userReducer);

// export const store = createStore(persistedReducer);
// export const persistor = persistStore(store);
