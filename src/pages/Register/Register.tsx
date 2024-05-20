import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/apiUrls';
import { Snackbar } from '@mui/material';
import { useState } from 'react';

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

export default function SignUp() {
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

    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const username = data.get('username');

    if (!username || !password || !confirmPassword) {
        handleAlert('All fields are required');
        return;
    }

    if (password !== confirmPassword) {
        handleAlert('Passwords do not match');
        return;
    }

    const userObject = {
        username: username,
        password: password
    }

    axios.post(API_ENDPOINTS.REGISTER, userObject)
        .then(() => {
          window.location.href = '/login'
          handleAlert('Registration Success')
        })
        .catch((e) => handleAlert(e.response.data))
  };

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
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-start">
              <Grid item>
                <Link href="login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
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