import {configureStore} from '@reduxjs/toolkit';
// import appSlice from "./app/appSlice";
// import productSlide from "./products/productSlide";

// import {persistReducer, persistStore} from 'redux-persist'
import userSlide from './users/userSlide';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const commonConfig = {
  key: 'booking/user',
  storage: AsyncStorage,
};

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current'],
};

export const store = configureStore({
  reducer: {
    // app: appSlice,
    // products: productSlide,
    user: persistReducer(userConfig, userSlide),
    // user: userSlide,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Tạo kiểu RootState từ store
export type RootState = ReturnType<typeof store.getState>;

// Tạo kiểu AppDispatch từ store
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
