import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Registrar un punto de sellado para el usuario actual
export const registerSealPoint = async (pointId) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("El usuario no está autenticado.");
    return;
  }

  const userRef = doc(db, "users", user.uid);

  try {
    // Actualizar el nodo del usuario con el punto de sellado
    await updateDoc(userRef, {
      [`sealedPoints.${pointId}`]: true,
    });
    console.log("Punto de sellado registrado correctamente.");
  } catch (error) {
    if (error.code === "not-found") {
      // Si no existe el usuario, lo inicializamos
      await setDoc(userRef, {
        sealedPoints: { [pointId]: true },
      });
      console.log("Usuario inicializado y punto de sellado registrado.");
    } else {
      console.error("Error al registrar el punto de sellado:", error);
    }
  }
};

// Obtener puntos de sellado del usuario actual
export const getUserSealedPoints = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("El usuario no está autenticado.");
    return {};
  }

  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().sealedPoints || {};
    }
    return {};
  } catch (error) {
    console.error("Error al obtener los puntos de sellado:", error);
    return {};
  }
};
