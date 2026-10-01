import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Login";
import ServiceForm from "./Pages/ServiceForm";

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <HashRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* SERVICE FORM */}
        <Route
          path="/"
          element={
            user ? (
              <ServiceForm
                onLogout={handleLogout}
                user={user}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      </Routes>
    </HashRouter>
  );
}

export default App;