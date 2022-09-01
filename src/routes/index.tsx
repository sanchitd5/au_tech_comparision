import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import ReduxInitialStoreState from 'redux/baseStore';
import { HomeScreen, LoginScreen } from 'views';

const MainRoutes: React.FC = () => {
    const user = useSelector((state: ReduxInitialStoreState) => state.user)
    return <Routes>
        <Route path="/" element={user?.loginStatus ? <HomeScreen /> : <LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
    </Routes>;
};

export default MainRoutes;