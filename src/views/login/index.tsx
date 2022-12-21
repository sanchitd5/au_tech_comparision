import { Button, Card, Container, Grid, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { API } from '../../helpers';
import { API_ACTIONS } from '../../redux/enums/login';

const LoginScreen: React.FC = () => {
    const store = useStore();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useDispatch();
    const performLogin = useCallback(async () => {
        const state = store.getState();
        if (state.appConfig.bypassLogin) {
            dispatch({ type: API_ACTIONS.LOGIN_REQUEST, payload: { success: true, data: 'bypassed' } });
            return;
        }
        const response = await API.login({
            emailId: email,
            password
        });
        dispatch({ type: API_ACTIONS.LOGIN_REQUEST, payload: response })
    }, [email, password, dispatch,store]);
    return (
        <Container maxWidth="xs" sx={{ marginTop: 10, }}>
            <Card sx={{ padding: 3 }}>
                <Grid container component='form' spacing={2} justifyItems='center'>
                    <Grid item xs={12}>
                        <h1>Login</h1>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={performLogin} fullWidth color="primary">
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}

export default LoginScreen;