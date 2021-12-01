import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import ReduxInitialStoreState from 'redux/baseStore';
import { HomeScreen, LoginScreen } from 'views';

const MainRoutes: React.FC = () => {
    const users = useSelector((state: ReduxInitialStoreState) => state.users)
    return <Routes>
        <Route path="/" element={users?.loginStatus ? <HomeScreen /> : <LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
    </Routes>;
};

export default MainRoutes;