import { useStore } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { HomeScreen, LoginScreen } from '../views/index';

const MainRoutes: React.FC = () => {
    const store = useStore();
    console.log(store.getState());
    return <Routes>
        <Route path="/" element={store.getState()?.login?.loginStatus ? <HomeScreen /> : <LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
    </Routes>;
};

export default MainRoutes;