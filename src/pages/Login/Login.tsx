import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { Snackbar } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/apiUrls';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        CaioGeraldo
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
    const [alert, setAlert] = useState<string | null>()
  
    const handleAlert = (error: string) => {
      setAlert(error);
          setTimeout(() => {
              setAlert(null);
          }, 3000);
    }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
        handleAlert('All fields are required');
        return;
    }

    const userObject = {
        username: username,
        password: password
    }

    axios.post(API_ENDPOINTS.LOGIN, userObject)
        .then((res) => {
          localStorage.setItem('Bearer', res.data.token)
          localStorage.setItem('User', JSON.stringify(
            {username: res.data.userName, id: res.data.id}
          ))
          window.location.href = '/'
        })
        .catch((e) => handleAlert(e.response.data))
  };

  // const handleLogout = () => {
  //   axios.post(API_ENDPOINTS.LOGOUT)
  //      .then(() => window.location.href = '/login')
  //      .catch((e) => handleAlert(e.response.data))
  // }

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography color={"white"} component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <Snackbar
            color='black'
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={!!alert}
            autoHideDuration={100}
            message={alert}
        />
      </Container>
  );
}