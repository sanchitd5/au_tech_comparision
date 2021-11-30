import { ApiProvider, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import PropTypes from 'prop-types';
import { ReactReduxContext } from 'react-redux';

interface LoginUserDetails {
    email: string;
    password: string;
    "deviceData": {
        "deviceType": "ANDROID",
        "deviceName": "string",
        "deviceUUID": "string"
    }
}

const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/',
        prepareHeaders: (headers, { getState }) => {
            const storeState: any = getState();
            const token = storeState?.login?.accessToken;
            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        loginUser: build.mutation<LoginUserDetails, any>({
            query: (data: LoginUserDetails) => ({
                url: 'admin/login',
                method: 'POST',
                body: data
            }),
        }),
    })
});

interface ApiProviderProps {
    children: React.ReactNode;
};

export const ApiProviderWrapper: any = ({ children }: ApiProviderProps) => {
    return <ApiProvider context={ReactReduxContext} api={api}>
        {children}
    </ApiProvider>;
}

ApiProviderWrapper.propTypes = {
    children: PropTypes.node.isRequired
}