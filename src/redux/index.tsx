import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import ReduxInitialStoreState, { INITIAL_CART_STATE } from "./baseStore";
import usersReducer from "./reducer/user";
import appReducer from "./reducer/app";
import cartReducer from "./reducer/cart";
import ApplicationConfiguration from "config";

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

const store = configureStore({
  reducer: {
    user: usersReducer,
    appConfig: appReducer,
    cart: cartReducer
  },
  devTools: true,
  preloadedState: initialState,
});

interface ReduxWrapperProps {
  children: React.ReactNode;
}

export const ReduxWrapper = ({ children }: ReduxWrapperProps) => {
  return <Provider store={store}>{children}</Provider>;
};
