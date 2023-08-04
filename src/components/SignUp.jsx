import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Card,CardMedia,IconButton} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import RefreshIcon from '@mui/icons-material/Refresh';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const defaultTheme = createTheme();

export default function SignUp() {
  const [imagen, setImagen] = useState("");
  const [age, setAge] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const ObtenerImagen = () => {
    axios
      .get("https://dog.ceo/api/breeds/image/random")
      .then((response) => {
        setImagen(response.data.message);
        handleClose();
      });
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    ObtenerImagen();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
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
            Registro
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    sx={{ height: 200, width: 100, flexGrow: 1 }} // Utiliza flexGrow para que la imagen ocupe todo el espacio disponible
                    component="img"
                    className="imagen1"
                    image={imagen}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <IconButton aria-label="" onClick={ObtenerImagen}>
                      <RefreshIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Sexo *</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Sexo *"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value={10}>Macho</MenuItem>
                    <MenuItem value={20}>Hembra</MenuItem>
                    <MenuItem value={30}>Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electronico"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
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
                  ¿Ya tienes una cuenta? Inicia sesion
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
