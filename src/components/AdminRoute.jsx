import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";  // Asegúrate de importar Firebase

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // Estado para esperar la carga de la autenticación
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAdmin(user.email === "souldeveloper@gmail.com");
      }
      setLoading(false); // Ya terminamos la verificación
    });

    return () => unsubscribe(); // Limpiar el listener cuando el componente se desmonte
  }, []);

  // Si estamos verificando si el usuario está logueado
  if (loading) {
    return <div>Loading...</div>; // O algún spinner de carga si prefieres
  }

  // Si el usuario no está logueado o no es el admin
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  // Si es el admin, mostramos el contenido protegido
  return children;
};

export default AdminRoute;
