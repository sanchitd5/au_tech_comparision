import ApplicationConfiguration from "config";

export interface UserState {
  accessToken: string | null | undefined;
  loginStatus: boolean | null;
}

export const INTIAL_USER_STATE: UserState = {
  accessToken: null,
  loginStatus: false,
};

export interface AppState {
  readonly darkMode: boolean;
  readonly bypassLogin: boolean;
}

export const INTIAL_APP_STATE: AppState = {
  darkMode: false,
  bypassLogin: ApplicationConfiguration.bypassAuth ?? false,
};

export default interface ReduxInitialStoreState {
  user: UserState;
  appConfig: AppState;
}
