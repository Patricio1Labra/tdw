import { useEffect, useState } from "react";
import "./App.css";
import {Box,Card,CardContent,CardMedia,List,ListItem,IconButton,Backdrop,CircularProgress, ListSubheader} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; 
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import dogNames from "dog-names";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Collapse from '@mui/material/Collapse';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function App() {
  const [imagen, setImagen] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("Hola soy una descripcion");
  const [rechazados, setRechazados] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [id, setId] = useState(0);
  const [open, setOpen] = useState(true);
  const [vista, setVista] = useState(0);
  const [tipo, setTipo] = useState("");
  const [expanded1, setExpanded1] = useState(false);


  const handleExpandClick = (perro) => {
    perro.expandir = !perro.expandir;
  }

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const ObtenerImagen = () => {
    axios
      .get("https://dog.ceo/api/breeds/image/random")
      .then((response) => {
        setImagen(response.data.message);
        handleClose();
      });
  };

  const cadenaAleatoria = () => {
    const banco = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let aleatoria = "";
    for (let i = 0; i < 6; i++) {
        aleatoria += banco.charAt(Math.floor(Math.random() * banco.length));
    }
    setNombre(aleatoria);
  };
  
  const ObtenerDogNames = () => {
      if(tipo==='Macho'){
        setNombre(dogNames.maleRandom());
      }
      if(tipo==='Hembra'){
        setNombre(dogNames.femaleRandom());
      }
      if(tipo==='Perrx'){
        setNombre(dogNames.allRandom());
      }
      
  };

  const agregar = (perro) => {
    if(perro.lista==='aceptar'){
      setFavoritos([...favoritos, perro]);
    }
    if(perro.lista==='rechazar'){
      setRechazados([...rechazados, perro]);
    }
  };

  const borrar = (perro) => {
    if(perro.lista==='aceptar'){
      setFavoritos((favoritos) => favoritos.filter((item)=> item.id !== perro.id));
    }
    if(perro.lista==='rechazar'){
      setRechazados((rechazados) => rechazados.filter((item)=> item.id !== perro.id));
    }
  };

  const cambiar = (perro) =>{
    if(perro.lista==='aceptar'){
      borrar(perro);
      perro.lista='rechazar';
      agregar(perro)
    }else{
      borrar(perro);
      perro.lista='aceptar';
      agregar(perro)
    }
  };

  const update = () => {
    handleOpen();
    ObtenerImagen();
    //cadenaAleatoria();
    ObtenerDogNames();
    setId(id+1);
  };

  const cambiarvista = (opcion) => {
    setVista(1);
    if(opcion==='macho'){
      setTipo("Macho");
      setNombre(dogNames.maleRandom());
    }
    if(opcion==='hembra'){
      setTipo("Hembra");
      setNombre(dogNames.femaleRandom());
    }
    if(opcion==='perrx'){
      setTipo("Perrx");
      setNombre(dogNames.allRandom());
    }
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 ,height:'100vh'}}>
      {vista === 0 ? 
      <Grid container>
        <Grid xs={4} sx={{paddingTop:"0",paddingBottom:"0"}}>
          <div className="container">
            <img className="imagen" src="https://i.pinimg.com/originals/64/1d/81/641d81ad95804da675730a202fd341d1.jpg" onClick={() => cambiarvista("macho")}></img>
            <div className="overlay" onClick={() => cambiarvista("macho")}>
              <div className="text">Machos</div>
            </div>
          </div>
        </Grid>
        <Grid xs={4}>
            <div className="container">
              <img className="imagen" src="https://i.pinimg.com/originals/02/80/15/02801578c3ed1d48be5d0cdc0bc4895a.jpg" onClick={() => cambiarvista("hembra")}></img>
              <div className="overlay" onClick={() => cambiarvista("hembra")}>
                <div className="text">Hembras</div>
              </div>
            </div>
        </Grid>
        <Grid xs={4} sx={{paddingTop:"0"}}>
            <div className="container">
              <img className="imagen" src="https://images.hola.com/imagenes/mascotas/20190215137141/razas-perro-pequenos-gt/0-645-998/perros-miniatura-m.jpg?tx=w_680" onClick={() => cambiarvista("perrx")}></img>
              <div className="overlay" onClick={() => cambiarvista("perrx")}>
                <div className="text">Perrxs</div>
              </div>
            </div>
        </Grid>
      </Grid>
      : ''}
      {vista === 1 ?
      <Box className="boxroot">
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        
        <Grid container spacing={2}>

          <Grid xs={6}>
            <Card>
              <CardMedia
                component="img"
                image={imagen}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {nombre}
                </Typography>
                <Typography variant="body2">
                  {descripcion}
                </Typography>
              </CardContent>
              <Box sx={{ display:'flex',justifyContent:'space-evenly',height:'10vh'}}>
                <IconButton aria-label="" disabled={open} onClick={() => {agregar({imagen,nombre,id,lista:'rechazar',descripcion,expandir:expanded1}),update()}}>
                  <ThumbDownIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
                <IconButton aria-label="" disabled={open} onClick={() => {agregar({imagen,nombre,id,lista:'aceptar',descripcion,expandir:expanded1}),update()}}>
                  <FavoriteIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
              </Box>
            </Card>
          </Grid>
          

          <Grid xs={3} sx={{paddingTop:"0"}}>
          <List sx={{overflow:'auto',maxHeight:'95vh',paddingTop:'0'}}>
            <ListSubheader>
              Aceptados
            </ListSubheader>
              {favoritos.slice(0).reverse().map((item, index) => (
                <ListItem sx={{display:"block", paddingLeft:"0",paddingRight:"0",paddingTop:"0"}} key={index}>
                  <Card>
                    <CardMedia
                      component="img"     
                      image={item.imagen}
                    />
                    <CardContent sx={{display:'flex',justifyContent: 'center' }}>
                      {item.nombre}
                    </CardContent>
                    <Collapse in={item.expandir} timeout="auto" unmountOnExit>
                      <CardContent>
                      <Typography variant="body2">
                        {item.descripcion}
                      </Typography>
                      </CardContent>
                    </Collapse>
                    <Box sx={{ display: 'flex',justifyContent: 'space-evenly' }}>
                      <IconButton aria-label="" disabled={open} onClick={() => borrar(item)}>
                        <DeleteIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                      <IconButton aria-label="" disabled={open} onClick={() => cambiar(item)}>
                        <ThumbDownIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                      <ExpandMore
                        expand={item.expandir}
                        onClick={() => handleExpandClick(item)}
                        aria-expanded={item.expandir}
                        aria-label="mostrar descripcion"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </Box>
                  </Card>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid xs={3} sx={{paddingTop:"0"}}>
            <List sx={{overflow:'auto',maxHeight:'95vh',paddingTop:'0'}}>
              <ListSubheader>
                Rechazados
              </ListSubheader>
              {rechazados.slice(0).reverse().map((item, index) => (
                <ListItem sx={{display:"block", paddingLeft:"0",paddingRight:"0",paddingTop:"0"}} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={item.imagen}
                    />
                    <CardContent sx={{display:'flex',justifyContent: 'center' }}>
                      {item.nombre}
                    </CardContent>
                    <Collapse in={item.expandir} timeout="auto" unmountOnExit>
                      <CardContent>
                      <Typography variant="body2">
                        {item.descripcion}
                      </Typography>
                      </CardContent>
                    </Collapse>
                    <Box sx={{ display: 'flex',justifyContent: 'space-evenly' }}>
                      <IconButton aria-label="" disabled={open} onClick={() => borrar(item)}>
                        <DeleteIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                      <IconButton aria-label="" disabled={open} onClick={() => cambiar(item)}>
                        <FavoriteIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                      <ExpandMore
                        expand={item.expandir}
                        onClick={() => handleExpandClick(item)}
                        aria-expanded={item.expandir}
                        aria-label="mostrar descripcion"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </Box>
                  </Card>
                </ListItem>
              ))}
            </List>
          </Grid>
          
        </Grid>
        </Box>
        : ''}
    </Box>
    
  );
}

export default App;
