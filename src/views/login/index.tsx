import { Button, Card, Container, Grid, TextField } from '@mui/material';
import { useState } from 'react';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
     
 
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
                        <Button variant="contained" fullWidth color="primary">
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}

export default LoginScreen;