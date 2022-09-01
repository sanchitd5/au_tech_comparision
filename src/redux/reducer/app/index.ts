import { APP_ACTIONS } from "redux/enums/app";
import { INTIAL_APP_STATE, AppState } from "../../baseStore";

const appReducer = (state: AppState = INTIAL_APP_STATE, action: any) => { 
  switch (action.type) {
    case APP_ACTIONS.BYPASS_LOGIN_BECAUSE_IN_DEV_MODE:
      break;
    default:
      return state;
  }
};

export default appReducer;
