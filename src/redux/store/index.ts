import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import adminSlice from "../slices/admin-slice";
import acessTokenSlice from "../slices/acessTokenSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: "root",
  storage: storage,
}

const rootReducer = combineReducers({
  authSlice,
  adminSlice,
  acessTokenSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});


export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
