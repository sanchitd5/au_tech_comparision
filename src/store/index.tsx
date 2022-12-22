import { configureStore } from "@reduxjs/toolkit";
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { combineReducers } from 'redux';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage' // defaults to localStorage for web 
import { Provider } from "react-redux";
import ReduxInitialStoreState, { INITIAL_CART_STATE } from "./baseStore";
import usersReducer from "./reducer/user";
import appReducer from "./reducer/app";
import cartReducer from "./reducer/cart";
import ApplicationConfiguration from "config";
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel1,
};

export const initialState: ReduxInitialStoreState = {
  user: {
    loginStatus: localStorage.getItem("loginStatus") === "true",
    accessToken: localStorage.getItem("accessToken") ?? null,
  },
  appConfig: {
    darkMode: false,
    bypassLogin: ApplicationConfiguration.bypassAuth ?? false,
    useAuth: ApplicationConfiguration.useAuth ?? true,
  },
  cart: INITIAL_CART_STATE
};

const baseReducers = combineReducers({
  user: usersReducer,
  appConfig: appReducer,
  cart: cartReducer
});

const _persistedReducer = persistReducer(persistConfig, baseReducers as any);


const store = configureStore({
  reducer: _persistedReducer,
  devTools: true,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        /* ignore persistance actions */
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      }
    });
  }
});

const persistor = persistStore(store)


interface ReduxWrapperProps {
  children: React.ReactNode;
}

export const ReduxWrapper = ({ children }: ReduxWrapperProps) => {
  return (<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>);
};
