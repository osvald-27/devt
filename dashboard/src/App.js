import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";


function App() {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return (
    <Router>
      <Routes>
        <Route path="/dashboard"/>
             </Routes>
    </Router >
  );
}

export default App;
