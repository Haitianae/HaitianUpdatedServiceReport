//Firebase code
// import React from "react";
// import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./Pages/Login";
// import ServiceForm from "./Pages/ServiceForm";

// import {
//   AuthProvider,
//   useAuth,
// } from "./Firebase/AuthContext";


// // ============================================================
// // MAIN APPLICATION CONTENT
// // ============================================================

// function AppContent() {
//   const {
//     user,
//     loading,
//     logout,
//   } = useAuth();


//   // ============================================================
//   // WAIT FOR FIREBASE AUTH STATE
//   // ============================================================

//   if (loading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{
//           minHeight: "100vh",
//         }}
//       >
//         Loading...
//       </div>
//     );
//   }


//   // ============================================================
//   // APPLICATION ROUTES
//   // ============================================================

//   return (
//     <HashRouter>
//       <Routes>

//         {/* ======================================================
//             LOGIN
//         ====================================================== */}

//         <Route
//           path="/login"
//           element={
//             user ? (
//               <Navigate to="/" replace />
//             ) : (
//               <Login
//                 onLoginSuccess={() => {
//                   // Firebase AuthContext automatically detects
//                   // the successful login through onAuthStateChanged.
//                 }}
//               />
//             )
//           }
//         />


//         {/* ======================================================
//             SERVICE REPORT APPLICATION
//         ====================================================== */}

//         <Route
//           path="/"
//           element={
//             user ? (
//               <ServiceForm
//                 user={user}
//                 onLogout={logout}
//               />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />


//         {/* ======================================================
//             UNKNOWN URL
//             REDIRECT TO APPROPRIATE PAGE
//         ====================================================== */}

//         <Route
//           path="*"
//           element={
//             <Navigate
//               to={user ? "/" : "/login"}
//               replace
//             />
//           }
//         />

//       </Routes>
//     </HashRouter>
//   );
// }


// // ============================================================
// // APP
// // ============================================================

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }



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
