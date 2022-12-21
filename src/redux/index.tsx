import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import ReduxInitialStoreState from "./baseStore";
import usersReducer from "./reducer/user";
import appReducer from "./reducer/app";
import ApplicationConfiguration from "config";

export const initialState: ReduxInitialStoreState = {
  user: {
    loginStatus: localStorage.getItem("loginStatus") === "true",
    accessToken: localStorage.getItem("accessToken") ?? null,
  },
  appConfig: {
    darkMode: false,
    bypassLogin: ApplicationConfiguration.bypassAuth ?? false,
  },
};

const store = configureStore({
  reducer: {
    users: usersReducer,
    appConfig: appReducer,
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
