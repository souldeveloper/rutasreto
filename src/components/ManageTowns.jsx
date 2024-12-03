import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const ManageTowns = () => {
  const [towns, setTowns] = useState([]);
  const [townName, setTownName] = useState("");
  const [visitLink, setVisitLink] = useState("");
  const [description, setDescription] = useState("");

  // Cargar lista de pueblos
  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const snapshot = await getDocs(collection(db, "towns"));
        const townsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTowns(townsData);
      } catch (error) {
        console.error("Error al cargar los pueblos:", error);
        toast.error("No se pudieron cargar los pueblos.");
      }
    };

    fetchTowns();
  }, []);

  // Agregar nuevo pueblo
  const handleAddTown = async (e) => {
    e.preventDefault();
    if (!townName || !visitLink || !description) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "towns"), {
        name: townName,
        visitLink,
        description,
      });
      setTowns([...towns, { id: docRef.id, name: townName, visitLink, description }]);
      toast.success("Pueblo agregado con éxito.");
      setTownName("");
      setVisitLink("");
      setDescription("");
    } catch (error) {
      console.error("Error al agregar el pueblo:", error);
      toast.error("No se pudo agregar el pueblo.");
    }
  };

  // Eliminar pueblo
  const handleDeleteTown = async (id) => {
    try {
      await deleteDoc(doc(db, "towns", id));
      setTowns(towns.filter((town) => town.id !== id));
      toast.success("Pueblo eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el pueblo:", error);
      toast.error("No se pudo eliminar el pueblo.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Gestionar Pueblos</h1>
      <form onSubmit={handleAddTown}>
        <div className="mb-3">
          <label htmlFor="townName" className="form-label">
            Nombre del Pueblo
          </label>
          <input
            type="text"
            className="form-control"
            id="townName"
            value={townName}
            onChange={(e) => setTownName(e.target.value)}
            placeholder="Introduce el nombre del pueblo"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="visitLink" className="form-label">
            Link a sitios para visitar
          </label>
          <input
            type="url"
            className="form-control"
            id="visitLink"
            value={visitLink}
            onChange={(e) => setVisitLink(e.target.value)}
            placeholder="Introduce un enlace (https://...)"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Escribe una breve descripción del pueblo"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Agregar Pueblo
        </button>
      </form>

      
    </div>
  );
};

export default ManageTowns;
