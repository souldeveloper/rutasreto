import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const SealPointList = () => {
  const [sealPoints, setSealPoints] = useState([]);

  useEffect(() => {
    // Obtener todos los puntos de sellado
    const fetchSealPoints = async () => {
      const sealPointsCollection = collection(db, "sealPoints");
      const sealPointsSnapshot = await getDocs(sealPointsCollection);
      const sealPointsList = sealPointsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setSealPoints(sealPointsList);
    };

    fetchSealPoints();
  }, []);

  // Función para eliminar un punto de sellado
  const handleDeleteSealPoint = async (sealPointId) => {
    await deleteDoc(doc(db, "sealPoints", sealPointId));

    // Actualizar la lista de puntos de sellado
    setSealPoints(sealPoints.filter((point) => point.id !== sealPointId));
  };

  return (
    <div className="container mt-5">
      <h2>Lista de Puntos de Sellado</h2>
      <ul className="list-group">
        {sealPoints.map((point) => (
          <li key={point.id} className="list-group-item d-flex justify-content-between align-items-center">
            {point.title}
            <button onClick={() => handleDeleteSealPoint(point.id)} className="btn btn-danger">
              <span className="fw-bold">X</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SealPointList;
