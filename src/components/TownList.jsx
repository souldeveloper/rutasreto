import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

const TownList = () => {
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    // Obtener todos los pueblos de la base de datos
    const fetchTowns = async () => {
      const townsCollection = collection(db, "towns");
      const townsSnapshot = await getDocs(townsCollection);
      const townsList = townsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTowns(townsList);
    };

    fetchTowns();
  }, []);

  // Función para eliminar un pueblo
  const handleDeleteTown = async (townId) => {
    // 1. Eliminar los puntos de sellado asociados a este pueblo
    const pointsQuery = query(collection(db, "sealPoints"), where("townId", "==", townId));
    const pointsSnapshot = await getDocs(pointsQuery);
    pointsSnapshot.forEach(async (pointDoc) => {
      await deleteDoc(doc(db, "sealPoints", pointDoc.id)); // Eliminar cada punto de sellado
    });

    // 2. Eliminar el pueblo
    await deleteDoc(doc(db, "towns", townId));

    // Actualizar la lista de pueblos
    setTowns(towns.filter((town) => town.id !== townId));
  };

  return (
    <div className="container mt-5">
      <h2>Lista de Pueblos</h2>
      <ul className="list-group">
        {towns.map((town) => (
          <li key={town.id} className="list-group-item d-flex justify-content-between align-items-center">
            {town.name}
            <button onClick={() => handleDeleteTown(town.id)} className="btn btn-danger">
              <span className="fw-bold">X</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TownList;
