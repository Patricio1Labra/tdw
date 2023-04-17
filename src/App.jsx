import { useEffect, useState } from "react";
import "./App.css";
import {Box,Card,CardContent,CardMedia,List,ListItem,TextField,IconButton,Backdrop,CircularProgress, ListSubheader} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; 
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import dogNames from "dog-names";

function App() {
  const [imagen, setImagen] = useState("");
  const [nombre, setNombre] = useState("");
  const [rechazados, setRechazados] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [id, setId] = useState(0);
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      setNombre(dogNames.maleRandom());
  };

  const agregar = (perro) => {
    if(perro.lista==='aceptar'){
      setFavoritos([...favoritos, perro]);
    }
    if(perro.lista==='rechazar'){
      setRechazados([...rechazados, perro]);
    }
    update();
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

  const withLoading = async (fn) => {
    try {
      setIsLoading(true);
      const result = await fn();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const handleClick = async () => {
    const data = await withLoading(ObtenerImagen);
    return data;
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 ,height:'100vh'}}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        <Grid xs={3} sx={{ background: "red" ,paddingTop:"0"}}>
          <List sx={{overflow:'auto',maxHeight:'95vh',paddingTop:'0'}}>
            <ListSubheader>
              Rechazados
            </ListSubheader>
            {rechazados.map((item, index) => (
              <ListItem sx={{display:"block", paddingLeft:"0",paddingRight:"0",paddingTop:"0"}} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    image={item.imagen}
                  />
                  <CardContent sx={{display:'flex',justifyContent: 'center' }}>
                    {item.nombre}
                  </CardContent>
                  <Box sx={{ display: 'flex',justifyContent: 'space-evenly' }}>
                    <IconButton aria-label="" disabled={open} onClick={() => borrar(item)}>
                      <DeleteIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton aria-label="" disabled={open} onClick={() => cambiar(item)}>
                      <FavoriteIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                  </Box>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid xs={6} sx={{ background: "grey" }}>
          <Card>
            <CardMedia
              component="img"
              image={imagen}
            />
            <CardContent sx={{display:'flex',justifyContent: 'center',height:'1vh'}}>
              {nombre}
            </CardContent>
            <Box sx={{ display:'flex',justifyContent:'space-evenly',height:'10vh'}}>
              <IconButton aria-label="" disabled={open} onClick={() => agregar({imagen,nombre,id,lista:'rechazar'})}>
                <ThumbDownIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="" disabled={open} onClick={() => agregar({imagen,nombre,id,lista:'aceptar'})}>
                <FavoriteIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            </Box>
          </Card>
        </Grid>

        <Grid xs={3} sx={{ background: "green" ,paddingTop:"0"}}>
        <List sx={{overflow:'auto',maxHeight:'95vh',paddingTop:'0'}}>
          <ListSubheader>
            Aceptados
          </ListSubheader>
            {favoritos.map((item, index) => (
              <ListItem sx={{display:"block", paddingLeft:"0",paddingRight:"0",paddingTop:"0"}} key={index}>
                <Card>
                  <CardMedia
                    component="img"     
                    image={item.imagen}
                  />
                  <CardContent sx={{display:'flex',justifyContent: 'center' }}>
                    {item.nombre}
                  </CardContent>
                  <Box sx={{ display: 'flex',justifyContent: 'space-evenly' }}>
                    <IconButton aria-label="" disabled={open} onClick={() => borrar(item)}>
                      <DeleteIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton aria-label="" disabled={open} onClick={() => cambiar(item)}>
                      <ThumbDownIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
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
