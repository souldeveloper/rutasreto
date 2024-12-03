import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const ManageSealPoints = () => {
  const [sealPoint, setSealPoint] = useState({
    title: "",
    description: "",
    openingHour: "",
    closingHour: "",
    mapLink: "",
    code: "",
    townId: "",
  });

  const [towns, setTowns] = useState([]);

  // Leer pueblos desde Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "towns"), (snapshot) => {
      setTowns(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setSealPoint({ ...sealPoint, [e.target.name]: e.target.value });
  };

  const handleAddSealPoint = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "sealPoints"), sealPoint);
      setSealPoint({
        title: "",
        description: "",
        openingHour: "",
        closingHour: "",
        mapLink: "",
        code: "",
        townId: "",
      });
    } catch (err) {
      console.error("Error al guardar el punto de sellado:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestionar Puntos de Sellado</h2>
      <form onSubmit={handleAddSealPoint} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Pueblo</label>
          <select
            name="townId"
            className="form-select"
            value={sealPoint.townId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un pueblo</option>
            {towns.map((town) => (
              <option key={town.id} value={town.id}>
                {town.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Título del Punto</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Ej: Bar El Refugio"
            value={sealPoint.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            placeholder="Ej: Bar acogedor en el centro"
            value={sealPoint.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Hora de Apertura</label>
          <input
            type="time"
            name="openingHour"
            className="form-control"
            value={sealPoint.openingHour}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Hora de Cierre</label>
          <input
            type="time"
            name="closingHour"
            className="form-control"
            value={sealPoint.closingHour}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Link a Google Maps</label>
          <input
            type="url"
            name="mapLink"
            className="form-control"
            placeholder="https://maps.google.com/..."
            value={sealPoint.mapLink}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Código de 6 Dígitos</label>
          <input
            type="text"
            name="code"
            className="form-control"
            placeholder="Ej: 123456"
            value={sealPoint.code}
            onChange={handleChange}
            maxLength="6"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Agregar Punto de Sellado
        </button>
      </form>
    </div>
  );
};

export default ManageSealPoints;
