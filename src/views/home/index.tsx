import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useCallback, useState } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReduxInitialStoreState from 'redux/baseStore';
import { API_ACTIONS } from 'redux/enums/login';


const HomeScreen: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const useAuth = useSelector((state: ReduxInitialStoreState) => state.appConfig.useAuth)
    const dispatch = useDispatch();
    const increment = useCallback(() => {
        setCount(prev => prev + 1);
    }, []); 

    return (
        <Container maxWidth="xs">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h1>Home</h1>
                </Grid>
                <Grid item xs={12}>
                    Count {count}
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={increment} variant="contained" color="primary">
                        Add
                    </Button>
                </Grid>
                {useAuth && <Grid item xs={12}>
                    <Button onClick={() => dispatch({ type: API_ACTIONS.LOGOUT_REQUEST })} variant="contained" color="primary">
                        Logout
                    </Button>
                </Grid>}
            </Grid>
        </Container>
    );
}

export default HomeScreen;