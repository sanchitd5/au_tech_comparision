import axios, { AxiosInstance } from 'axios';
import { notify } from 'components/Notification';

class AxiosClient {
    baseURL: string;
    instance: AxiosInstance;
    constructor() {
        this.baseURL = process.env?.REACT_APP_BASE_URL ?? 'http://localhost:8000/' ;
        this.instance = axios.create({
            baseURL: this.baseURL, 
        });
    }

    /**
     * 
     * @param data 
     * @returns {Object} responseObject
     */
    generateSuccess(data: any) {
        return {
            success: true,
            data
        }
    }

    generateError(error: any) {
        notify(error, 'inapp')
        return {
            success: false,
            error
        }
    }

    errorHelper(error: any) {
        if (error.response === undefined) return this.generateError('Network Error');
        if (error.response.status === 401) return this.generateError('Unauthorized');
        if (error.response.status === 404) return this.generateError('Not Found');
        if (error.response.status === 500) return this.generateError('Internal Server Error');
        return this.generateError(error.response.data.message);
    }

}

const axiosClient: AxiosClient = new AxiosClient();

export default axiosClient;
