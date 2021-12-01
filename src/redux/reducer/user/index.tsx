
import { UserState } from "../../baseStore";
import { API_ACTIONS } from '../../enums/login';


const userReducer = (state: UserState = { accessToken: null, loginStatus: false }, action: any) => {
    console.log(state, action);
    switch (action.type) {
        case API_ACTIONS.LOGIN_REQUEST:
            if (action.payload.success) {
                localStorage.setItem('accessToken', action.payload.data);
                localStorage.setItem('loginStatus', 'true');
                return {
                    ...state,
                    accessToken: action.payload.data,
                    loginStatus: true
                };
            } else {
                localStorage.setItem('loginStatus', 'false');
                return {
                    ...state,
                    accessToken: null,
                    loginStatus: false
                };
            }
        case API_ACTIONS.LOGOUT_REQUEST:
            localStorage.removeItem('accessToken');
            localStorage.removeItem('loginStatus');
            return {
                ...state,
                accessToken: null,
                loginStatus: false
            };
        default:
            return state;
    }
}

export default userReducer;