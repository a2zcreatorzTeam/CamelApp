// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {applyMiddleware, createStore} from 'redux';
// import {combineReducers} from 'redux';
// import {persistStore, persistReducer} from 'redux-persist';
// // {-------Reducers-------}
// import userReducer from '../reducers/userReducer';
// import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
// import thunk from 'redux-thunk';

// const rootReducer = combineReducers({
//   user: userReducer,
// });

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   stateReconciler: autoMergeLevel2,
//   timeout: null,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const Store = createStore(persistedReducer, {}, applyMiddleware(thunk));

// export default configureStore = persistStore(Store);

// const configureStore = () => {
//   return createStore(rootReducer);
// };
// export default configureStore;

// import userReducer from '../reducers/userReducer';

// import {createStore} from 'redux';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
// };

// const persistedReducer = persistReducer(persistConfig, userReducer);

// export const store = createStore(persistedReducer);
// export const persistor = persistStore(store);

// import reducer from './reducer';
// import {persistStore, persistReducer} from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
// import thunk from 'redux-thunk';

// import {applyMiddleware, createStore} from 'redux';
// import thunk from 'redux-thunk';

// const Store = createStore(reducer, applyMiddleware(thunk));
// export default Store;

// import {createStore, combineReducers, applyMiddleware} from 'redux';
// import authReducer from './reducer/auth';
// import patientReducer from './reducer/patient';
// import practitionerReducer from './reducer/practitioner';
// import shareReducer from './reducer/share';
// import diagnosticReducer from './reducer/diagnostic';
// import fileReducer from './reducer/file';

// // const rootReducer = combineReducers({ reducer });
// const rootReducer = combineReducers({
//   reducer,
//   authReducer,
//   patientReducer,
//   practitionerReducer,
//   shareReducer,
//   diagnosticReducer,
//   fileReducer,
// });

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   stateReconciler: autoMergeLevel2,
//   timeout: null,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const Store = createStore(persistedReducer, {}, applyMiddleware(thunk));

// export const persistor = persistStore(Store);

import AsyncStorage from '@react-native-async-storage/async-storage';
import {applyMiddleware, createStore} from 'redux';
import {combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'; // modified import
import thunk from 'redux-thunk';
import userReducer from '../reducers/userReducer';

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  timeout: null,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(thunk)); // removed object argument from createStore

export const persistor = persistStore(store); // renamed Store to store and changed export name

export default store;
