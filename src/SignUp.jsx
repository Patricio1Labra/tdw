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
import { useState, useEffect} from "react";
import InputLabel from '@mui/material/InputLabel';
import RefreshIcon from '@mui/icons-material/Refresh';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignUp() {
  const [imagen, setImagen] = useState("");
  const [sexo, setSexo] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    sexo: '',
    url_foto: '',
    descripcion: '',
  });

  const ObtenerImagen = () => {
    axios
      .get("https://dog.ceo/api/breeds/image/random")
      .then((response) => {
        setImagen(response.data.message);
        setFormData({...formData,url_foto: response.data.message,});
      });
  };

  const handleChangeSelect = (event) => {
    setSexo(event.target.value);
    setFormData({...formData,sexo: event.target.value,});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeDescripcion = (event) => {
    setFormData({...formData,descripcion: event.target.value,});
  };

  useEffect(() => {
    ObtenerImagen();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/perros/agregar/', formData);
      navigate('/'); 
      setFormData({
        nombre: '',
        sexo: '',
        url_foto: '',
        descripcion: '',
      });
    } catch (error) {
      console.log(formData)
      console.log("no funciona")
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                  name="nombre"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Sexo *</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="sexo"
                    value={sexo}
                    label="Sexo *"
                    onChange={handleChangeSelect}
                    required
                  >
                    <MenuItem value={'Macho'}>Macho</MenuItem>
                    <MenuItem value={'Hembra'}>Hembra</MenuItem>
                    <MenuItem value={'Otro'}>Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="descripcion"
                  label="Descripcion"
                  multiline
                  required
                  fullWidth
                  rows={4}
                  onChange={handleChangeDescripcion}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
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