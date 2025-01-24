import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [towns, setTowns] = useState([]);
  const [sealPoints, setSealPoints] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null); // Estado para el acordeón activo
  const [codeInput, setCodeInput] = useState("");

  // Cargar lista de pueblos y puntos de sellado
  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const townSnapshot = await getDocs(collection(db, "towns"));
        const townsData = townSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTowns(townsData);

        const sealPointsData = {};
        for (const town of townsData) {
          const pointsQuery = query(
            collection(db, "sealPoints"),
            where("townId", "==", town.id)
          );
          const pointsSnapshot = await getDocs(pointsQuery);
          sealPointsData[town.id] = pointsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        setSealPoints(sealPointsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTowns();
  }, []);

  // Manejar el registro del punto de sellado
  const handleSealPointRegistration = async (sealPoint, townId) => {
    if (codeInput === sealPoint.code) {
      try {
        // Actualizar el punto de sellado en Firestore
        await updateDoc(doc(db, "sealPoints", sealPoint.id), {
          completed: true,
        });

        // Actualizar el estado local
        setSealPoints((prevSealPoints) => ({
          ...prevSealPoints,
          [townId]: prevSealPoints[townId].map((point) =>
            point.id === sealPoint.id ? { ...point, completed: true } : point
          ),
        }));

        toast.success(`Punto de sellado registrado: ${sealPoint.title}`);
      } catch (error) {
        console.error("Error al registrar el punto de sellado:", error);
        toast.error("No se pudo registrar el punto de sellado.");
      }
    } else {
      toast.error("Código incorrecto. Inténtalo nuevamente.");
    }
    setCodeInput(""); // Limpia el campo después del intento
  };

  // Verificar si un pueblo está completado
  const isTownCompleted = (townId) => {
    return (
      sealPoints[townId]?.length > 0 &&
      sealPoints[townId].every((point) => point.completed)
    );
  };

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">PUNTOS DE SELLADO</h1>
      <div className="accordion">
        {towns.map((town, index) => (
          <div
            className={`accordion-item ${
              isTownCompleted(town.id) ? "border-success" : ""
            }`}
            key={town.id}
          >
            <h2 className="accordion-header">
              <div className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <h3>{town.name}</h3>
                  <h6>{town.description}</h6>
                </div>
                {town.visitLink && (
                  <a
                    href={town.visitLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-info btn-sm"
                  >
                    Lugares para visitar
                  </a>
                )}
              </div>
              <button
                className={`accordion-button ${
                  activeAccordion === index ? "" : "collapsed"
                } ${
                  isTownCompleted(town.id) ? "bg-success text-white" : ""
                }`}
                type="button"
                onClick={() =>
                  setActiveAccordion(activeAccordion === index ? null : index)
                }
              >
                {town.name} - {isTownCompleted(town.id) ? "Completado" : "Pendiente"}
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                activeAccordion === index ? "show" : ""
              }`}
            >
              <div className="accordion-body">
                <h5>Puntos de Sellado</h5>
                {sealPoints[town.id]?.length > 0 ? (
                  <ul className="list-group">
                    {sealPoints[town.id].map((sealPoint) => (
                      <li
                        className={`list-group-item d-flex justify-content-between align-items-start mt-5 ${
                          sealPoint.completed ? "bg-light text-success" : ""
                        }`}
                        key={sealPoint.id}
                      >
                        <div className="ms-2 me-auto ">
                          <div className="fw-bold">
                            {sealPoint.title}{" "}
                            {sealPoint.completed && (
                              <span className="badge bg-success ms-2">
                                Completado
                              </span>
                            )}
                          </div>
                          <p>{sealPoint.description}</p>
                          <small>
                            Horario: {sealPoint.openingHour} -{" "}
                            {sealPoint.closingHour}
                          </small>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <a
                            href={sealPoint.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm mb-2"
                          >
                            Cómo llegar
                          </a>
                          {!sealPoint.completed && (
                            <div className="d-flex">
                              <input
                                type="text"
                                className="form-control form-control-sm me-2"
                                placeholder="Código de 6 dígitos"
                                maxLength={6}
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value)}
                              />
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleSealPointRegistration(
                                    sealPoint,
                                    town.id
                                  )
                                }
                              >
                                Registrar
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay puntos de sellado disponibles.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
