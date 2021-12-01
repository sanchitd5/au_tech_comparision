import { configureStore } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import ReduxInitialStoreState from './baseStore';
import usersReducer from './reducer/user';

export const initialState: ReduxInitialStoreState = {
    users: {
        loginStatus: localStorage.getItem('loginStatus') === 'true',
        accessToken: localStorage.getItem('accessToken') ?? null,
    }, 
};

const store = configureStore({
    reducer: {
        users: usersReducer,
    },
    devTools: true,
    preloadedState: initialState,
});


interface ReduxWrapperProps {
    children: React.ReactNode;
}

export const ReduxWrapper = ({ children }: ReduxWrapperProps) => {
    return (
        <Provider store={store} >
            {children}
        </Provider>
    );
};

ReduxWrapper.propTypes = {
    children: PropTypes.node.isRequired
};


