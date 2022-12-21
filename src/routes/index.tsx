import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import ReduxInitialStoreState from 'redux/baseStore';
import { HomeScreen, LoginScreen } from 'views';

interface AuthManagerProps {
    children?: JSX.Element;
}

const AuthManager = (props: AuthManagerProps) => {
    const useAuth = useSelector((state: ReduxInitialStoreState) => state.appConfig.useAuth);
    const user = useSelector((state: ReduxInitialStoreState) => state.user);
    if (!(useAuth) || user.loginStatus) {
        if (props.children) {
            return props.children;
        }           
        window.history.replaceState(null, "Home", '/home'); 
        return <HomeScreen />
    }
    else {
        if (!window.location.href.includes('login')) {
            window.history.replaceState(null, "Login", '/login');
        }
        return <LoginScreen />
    }
}

const MainRoutes: React.FC = () => {
    return <Routes>
        <Route path="/" element={<AuthManager />} />
        <Route path="/login" element={<AuthManager />} />
        <Route path="/home" element={<AuthManager><HomeScreen /></AuthManager>} />
    </Routes>;
};

export default MainRoutes;