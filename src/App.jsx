import { useEffect, useState } from "react";
import "./App.module.css";
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

function App() {
  const [imagen, setImagen] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("Hola soy una descripcion");
  const [rechazados, setRechazados] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [id1, setId1] = useState(0);
  const [open, setOpen] = useState(true);
  const [expanded1, setExpanded1] = useState(false);
  const { id } = useParams();
  const [perro, setPerro] = useState("");
  const [perros, setPerros] = useState([]);
  const [perroAleatorio, setPerroAleatorio] = useState("");


  const ObtenerPerro = (id) => {
    try {
      axios.get(`http://localhost:8000/api/perros/${id}`)
      .then((response) => {
        setPerro(response.data);
      })
    } catch (error) {
      console.log(data)
      console.log("no funciona")
    }
  };
  const ObtenerPerros = (id) => {
    try {
      axios.get(`http://localhost:8000/api/indexperros/${id}`)
      .then((response) => {
        setPerros(response.data);
      })
    } catch (error) {
      console.log(data)
      console.log("no funciona")
    }
  };

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

  const agregar = (preferencia, perroCandidatoId) => {
    axios.post(`http://localhost:8000/api/perros/agregarpreferencia/${id}`, {
      perro_candidato_id: perroCandidatoId,
      preferencia: preferencia,
    })
    .then((response) => {
      console.log("Preferencia guardada correctamente");
    })
    .catch((error) => {
      console.error("Error al guardar preferencia:", error);
    });
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

  const seleccionarPerroAleatorio = () => {
    if (perros.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * perros.length);
      const perroSeleccionado = perros[indiceAleatorio];
      
      // Crear una nueva lista de perros excluyendo el perro seleccionado
      const nuevosPerros = perros.filter(perro => perro.id !== perroSeleccionado.id);
      console.log(perroSeleccionado);
      setPerroAleatorio(perroSeleccionado);
      setPerros(nuevosPerros);
    }
  };

  useEffect(() => {
    ObtenerPerro(id);
    ObtenerPerros(id);
    seleccionarPerroAleatorio();
  }, []);

  return (
    <Box className="boxroot">
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <Card sx={{maxHeight:'95vh'}}>
            <CardMedia
              component="img"
              className="imagen1"
              image={perroAleatorio.url_foto}
            />
            <CardContent sx={{height:'5vh'}}>
              <Typography gutterBottom variant="h5" component="div"> 
                {perroAleatorio.nombre}
              </Typography>
              <Typography variant="body2">
                {perroAleatorio.descripcion}
              </Typography>
            </CardContent>
            <Box sx={{ display:'flex',justifyContent:'space-evenly',height:'5vh'}}>
              <Tooltip title="No me interesa" followCursor>
                <IconButton aria-label=""  onClick={() => agregar("aceptado",perroAleatorio.id)}>
                  <ThumbDownIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Me interesa" followCursor>
                <IconButton aria-label=""  onClick={() => agregar("rechazado",perroAleatorio.id)}>
                  <FavoriteIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        </Grid>
        
        <Grid xs={6} sm={3} sx={{paddingTop:"0"}}>
        <List sx={{overflow:'auto',maxHeight:'95vh',paddingTop:'0'}}>
          <ListSubheader>
            Aceptados de {perro.nombre}
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
              Rechazados de {perro.nombre}
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

export default App;