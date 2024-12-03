import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/AdminRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./components/AdminDashboard";
import TownList from "./components/TownList";
import SealPointList from "./components/SealPointList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
           element={
            <AdminRoute>
              <AdminDashboard />   
            </AdminRoute>
          }
        />
        <Route path="/admin/townsList" element={<TownList />} />
        <Route path="/admin/sealPoints" element={<SealPointList />} />
      </Routes>
    </Router>
  );
};

export default App;
