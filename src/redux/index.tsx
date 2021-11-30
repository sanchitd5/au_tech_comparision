import { configureStore } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ApiProviderWrapper } from './actions';
import ReduxInitialStoreState from './baseStore';
import { loginReducer } from './reducer/login';

const initialState: ReduxInitialStoreState = {
    login: {
        loginStatus: localStorage.getItem('loginStatus') === 'true',
        accessToken: localStorage.getItem('accessToken') ?? null,
    }
};

const store = configureStore({
    reducer: {
        login: loginReducer
    },
    devTools: true,
    preloadedState: initialState
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

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

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {
    ApiProviderWrapper
};
