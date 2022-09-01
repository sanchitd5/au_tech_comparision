import { LoginAPIBody } from "./apiInterfaces";
import axiosClient from "./axiosClient";

class APIDefinations {
    login(loginDetails: LoginAPIBody) {
        return axiosClient.instance.post('admin/login', {
            ...loginDetails,
            "deviceData": {
                "deviceType": "ANDROID",
                "deviceName": "string",
                "deviceUUID": "123e4567-e89b-12d3-a456-426614174000"
            }
        }).then(response => {
            return axiosClient.generateSuccess(response.data.data.accessToken);
        }).catch(error => axiosClient.errorHelper(error));
    }
}

const API = new APIDefinations();
export default API;