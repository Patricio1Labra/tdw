import { useEffect, useState } from "react";
import "./Pagina.module.css";
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
import Tooltip from '@mui/material/Tooltip';
import { useParams } from 'react-router-dom';

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

function Pagina() {
  const { id } = useParams();
  const [imagen, setImagen] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("Hola soy una descripcion");
  const [rechazados, setRechazados] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [id1, setId1] = useState(0);
  const [open, setOpen] = useState(true);
  const [expanded1, setExpanded1] = useState(false);

  const handleExpandClick1 = (perro) => {
    if(perro.lista==='aceptar'){
      let update = favoritos.map(item => {
        if(item == perro){
          return {...item, expandir: !item.expandir}
        }else{
          return item
        }
      })
      setFavoritos(update);
    }
    if(perro.lista==='rechazar'){
      let update = rechazados.map(item => {
        if(item == perro){
          return {...item, expandir: !item.expandir}
        }else{
          return item
        }
      })
      setRechazados(update);
    }
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
  
  const ObtenerDogNames = () => {
    setNombre(dogNames.allRandom());
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

  const obtenerPerro = () => {
    axios.get(`localhost:8000/api/oi/perros/${id}`)
    .then(response => {
        console.log('Datos del perro:', response.data);
    })
    .catch(error => {
        console.error('Error al obtener el perro:', error.data);
    });
  };

  const update = () => {
    handleOpen();
    ObtenerImagen();
    ObtenerDogNames();
    setId1(id1+1);
  };

  useEffect(() => {
    console.log(id);
    obtenerPerro();
    update();
  }, []);

  return (
    <Box className="boxroot">
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <Card sx={{maxHeight:'95vh'}}>
            <CardMedia
              component="img"
              className="imagen1"
              image={imagen}
            />
            <CardContent sx={{height:'5vh'}}>
              <Typography gutterBottom variant="h5" component="div">
                {nombre}
              </Typography>
              <Typography variant="body2">
                {descripcion}
              </Typography>
            </CardContent>
            <Box sx={{ display:'flex',justifyContent:'space-evenly',height:'5vh'}}>
              <Tooltip title="No me interesa" followCursor>
                <IconButton aria-label="" disabled={open} onClick={() => {agregar({imagen,nombre,id1,lista:'rechazar',descripcion,expandir:expanded1}),update()}}>
                  <ThumbDownIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Me interesa" followCursor>
                <IconButton aria-label="" disabled={open} onClick={() => {agregar({imagen,nombre,id1,lista:'aceptar',descripcion,expandir:expanded1}),update()}}>
                  <FavoriteIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        </Grid>
        
        <Grid xs={6} sm={3} sx={{paddingTop:"0"}}>
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
                    <Tooltip title="Borrar" followCursor>
                      <IconButton aria-label="" disabled={open} onClick={() => borrar(item)}>
                        <DeleteIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="No me interesa" followCursor>
                      <IconButton aria-label="" disabled={open} onClick={() => cambiar(item)}>
                        <ThumbDownIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver más" followCursor>
                      <ExpandMore
                        expand={item.expandir}
                        onClick={() => handleExpandClick1(item)}
                        aria-expanded={item.expandir}
                        aria-label="mostrar descripcion"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </Tooltip>
                  </Box>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid xs={6} sm={3} sx={{paddingTop:"0"}}>
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
                    <Tooltip title="Borrar" followCursor>
                      <IconButton aria-label="" disabled={open} onClick={() => borrar(item)}>
                        <DeleteIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Me interesa" followCursor>
                      <IconButton aria-label="" disabled={open} onClick={() => cambiar(item)}>
                        <FavoriteIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver más" followCursor>
                      <ExpandMore
                        expand={item.expandir}
                        onClick={() => handleExpandClick1(item)}
                        aria-expanded={item.expandir}
                        aria-label="mostrar descripcion"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </Tooltip>
                  </Box>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      </Box>
  );
}

export default Pagina;