import React from "react";
import ManageTowns from "./ManageTowns";
import ManageSealPoints from "./ManageSealPoints";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h1>Panel de Administración</h1>
      <ManageTowns />
      <ManageSealPoints />
      <div className="mt-4">
        <Link to="/admin/townsList">
          <button className="btn btn-primary btn-lg w-100 mb-3">
            Gestionar Pueblos
          </button>
        </Link>
        <Link to="/admin/sealPoints">
          <button className="btn btn-success btn-lg w-100">
            Gestionar Puntos de Sellado
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
