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
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import { red } from '@mui/material/colors';
import { useState } from 'react';

const colorRed = red[500];

let Error = {
  msg: "",
  email: "",
  password: "",
  name: ""
}
const theme = createTheme();

export default function SignUp() {

  const history = useHistory();
  // const isAuthState = useSelector((state) => state.User.isAuth);

  // if(isAuthState) {
  //   history.push('/');
  // }

  const [errOccured, setErr] = useState(false);


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userInfo = {
      firstName:data.get('firstName'),
      lastName:data.get('lastName'),
      email:data.get('email'),
      password:data.get('password'),
      password2:data.get('password2')
    }

    fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(userInfo)
    }).then(res => {
      res.json().then((data) => {

        if(res.status === 400){

          Error.name = data.name;
          Error.email = data.email;
          Error.password = data.password;
          setErr(true);
        } else {
          //registration succeeded
          history.push('/');
        }
      
      });
    })
    .catch((err) => {
      setErr(true);
      Error.msg = "An error occured check log for more details";
      console.log(err);
    });

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
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <VpnKeyOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                { errOccured ? <Typography align="center" sx={{color: colorRed }}>{Error.msg}</Typography> : "" }
              </Grid>
              <Grid item xs={12}>
                { errOccured ? <Typography align="center" sx={{color: colorRed }}>{Error.email}</Typography> : "" }
              </Grid>
              <Grid item xs={12}>
                { errOccured ? <Typography align="center" sx={{color: colorRed }}>{Error.password}</Typography> : "" }
              </Grid>
              <Grid item xs={12}>
                { errOccured ? <Typography align="center" sx={{color: colorRed }}>{Error.name}</Typography> : "" }
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive updates via email."
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}