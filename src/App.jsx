import { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  TextField,
  IconButton
} from "@mui/material";
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

  const ObtenerImagen = () => {
    axios
      .get("https://dog.ceo/api/breeds/image/random")
      .then((response) => {
        setImagen(response.data.message);
      });
  };

  const ObtenerNombre = () => {
    axios
      .get("https://api.generadordni.es/v2/profiles/person?results=1&gender=male&include_fields=name")
      .then((response) => {
        setNombre(response.data[0].name);
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
  setFavoritos([...favoritos, perro]);
  console.log(id);
  update();
};

const rechazar = (perro) => {
  setRechazados([...rechazados, perro]);
  console.log(id);
  update();
};

const borrarfavorito = (perro) => {
  setFavoritos((favoritos) => favoritos.filter((item)=> item.id !== perro.id));
};

const rechazarfavorito = (perro) => {
  setRechazados([...rechazados, perro]);
  borrarfavorito(perro);
};

const borrarrechazado = (perro) => {
  setRechazados((rechazados) => rechazados.filter((item)=> item.id !== perro.id));
};

const agregarrechazado = (perro) => {
  setFavoritos([...favoritos, perro]);
  borrarrechazado(perro);
};

const update = () => {
  ObtenerImagen();
  //ObtenerNombre();
  //cadenaAleatoria();
  ObtenerDogNames();
  setId(id+1);
};

  useEffect(() => {
    update();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={3} sx={{ background: "red" }}>
          <List>
            {rechazados.map((item, index) => (
              <ListItem key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    object-fit= "contain"
                    image={item.imagen}
                  />
                  <CardContent>
                    {item.nombre}
                  </CardContent>
                  <Box sx={{  alignItems: 'center' }}>
                    <IconButton aria-label="" onClick={() => borrarrechazado(item)}>
                      <DeleteIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton aria-label="" onClick={() => agregarrechazado(item)}>
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
              object-fit= "contain"
              image={imagen}
            />
            <CardContent>
              {nombre}
            </CardContent>
            <Box sx={{  alignItems: 'center' }}>
              <IconButton aria-label="" onClick={() => rechazar({imagen,nombre,id})}>
                <ThumbDownIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="" onClick={() => agregar({imagen,nombre,id})}>
                <FavoriteIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            </Box>
          </Card>
        </Grid>

        <Grid xs={3} sx={{ background: "green" }}>
         <List>
            {favoritos.map((item, index) => (
              <ListItem key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    object-fit= "contain"
                    image={item.imagen}
                  />
                  <CardContent>
                    {item.nombre}
                  </CardContent>
                  <Box sx={{  alignItems: 'center' }}>
                    <IconButton aria-label="" onClick={() => borrarfavorito(item)}>
                      <DeleteIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton aria-label="" onClick={() => rechazarfavorito(item)}>
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
