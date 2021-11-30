import { AnyAction } from "redux";
import { LOGIN_USER_ACTION_TYPES } from '../../enums/login';

export interface LoginUserState {
    accessToken: string | null | undefined;
    loginStatus: boolean;
}



export const loginReducer = (state: LoginUserState = { accessToken: null, loginStatus: false }, action: AnyAction) => {
    switch (action.type) {
        case LOGIN_USER_ACTION_TYPES.LOGIN_USER_SUCCESS:
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('loginStatus', 'true');
            return {
                ...state,
                accessToken: action.payload.accessToken,
                loginStatus: true,
                user: action.payload
            };
        case LOGIN_USER_ACTION_TYPES.LOGIN_USER_ERROR:
            localStorage.removeItem('accessToken');
            localStorage.removeItem('loginStatus');
            return {
                ...state,
                accessToken: null,
                loginStatus: false,
                error: action.payload
            }
        default:
            return state;
    }
}