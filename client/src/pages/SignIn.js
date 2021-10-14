import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { red } from '@mui/material/colors';
import { authToTrue, setAccessToken, setName, setId } from '../redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";

const colorRed = red[500];

let Error = {
  msg: "",
}


const theme = createTheme();

export default function SignIn() {
  const accessToken = useSelector((state) => state.User.accessToken);

  const history = useHistory();
	// const isAuthState = useSelector((state) => state.User.isAuth);

	// if(isAuthState) {
	// 	history.push('/');
	// }

  //hooks
  const [errOccured, setErr] = useState(false);
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userInfo = {
      email:data.get('email'),
      password:data.get('password')
    }

    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      credentials: 'include',
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(userInfo)
    })
    .then(res => {
      res.json().then((data) => {

        if(res.status > 399){

          if(data.err) Error.msg = data.err;

          else{
            Error.msg = data.passwordincorrect;
          }

          setErr(true);
        } else {
          console.log('the data is ', data);
          //registration succeeded

          console.log('data.token ', data.token);
          dispatch(setAccessToken(data.token));
          console.log('access token state ', {accessToken});

          localStorage.setItem("SESSION_COOKIE", data.session);

          const token = data.token.split(' ')[1];
          const decoded = jwt_decode(token);
          dispatch(setName(decoded.name));
          dispatch(setId(decoded.id));

          dispatch(authToTrue());
          history.push('/home');
        }
      
      });
    })
  };

  return (
    <ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
            { errOccured ? <Typography align="center" sx={{color: colorRed }}>{Error.msg}</Typography> : ""}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
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
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}