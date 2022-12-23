import ApplicationConfiguration from "config";
import { CartProduct } from "types";
import { THEMES } from "./enums/app";

export interface UserState {
  accessToken: string | null | undefined;
  loginStatus: boolean | null;
}

export const INITIAL_USER_STATE: UserState = {
  accessToken: null,
  loginStatus: false,
};

export interface ThemeConfig {
  theme: THEMES;
  compact: boolean;
  direction: 'ltr' | 'rtl';
  responsiveFontSizes: boolean;
  roundedCorners: boolean;
}

export interface AppState {
  readonly darkMode: boolean;
  readonly bypassLogin: boolean;
  readonly useAuth: boolean;
  readonly theme: ThemeConfig;
}

export interface Cart {
  products: CartProduct[],
  total: number,
  totalItems: number
}

export interface CartState {
  readonly cart: Cart;
  readonly prevCartSnapshots: Cart[];
}

export const INITIAL_CART_STATE: CartState = {
  cart: {
    products: [],
    total: 0,
    totalItems: 0
  },
  prevCartSnapshots: []
};

export const INITIAL_APP_STATE: AppState = {
  darkMode: false,
  bypassLogin: ApplicationConfiguration.bypassAuth ?? false,
  useAuth: ApplicationConfiguration.useAuth ?? true,
  theme: {
    compact: false,
    direction: 'ltr',
    responsiveFontSizes: true,
    roundedCorners: true,
    theme: THEMES.LIGHT
  }
};

export default interface ReduxInitialStoreState {
  user: UserState;
  appConfig: AppState;
  cart: CartState;
}
