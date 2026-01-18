
// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";

function App() {
  const isLoggedIn = !!localStorage.getItem("token"); // adjust for auth

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;