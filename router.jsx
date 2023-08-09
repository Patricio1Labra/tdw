import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useUsuario } from "./src/context/usuarioContext";
import SignIn from "./src/components/SignIn"
import SignUp from "./src/components/SignUp"
import Pagina from "./src/components/Pagina"

const RouterApp = () => {
  const { usuario } = useUsuario();
  const [authenticated, setAuthenticated] = useState(false);

  return !usuario ? (
    <NotLogedRoutes setAuthenticated={setAuthenticated} />
  ) : (
    <LogedInRoutes authenticated={authenticated} />
  );
};

const NotLogedRoutes = ({ setAuthenticated }) => {
  return (
    <Routes>
      <Route
        exact
        path="/login"
        element={<SignIn setAuthenticated={setAuthenticated} />}
      />
      <Route
        exact
        path="/singup"
        element={<SignUp setAuthenticated={setAuthenticated} />}
        />
    </Routes>
  );
};

const LogedInRoutes = ({ authenticated }) => {
  return (
      <Routes>
        <Route
          exact
          path="/"
          element={<Pagina setAuthenticated={setAuthenticated} />}
      />
      </Routes>
  );
};

export default RouterApp;
