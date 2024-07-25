import React from "react";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const isUserExist = JSON.parse(localStorage.getItem("auth-user")) || null;
  if (!isUserExist) {
    return <Navigate to="/drone-survey" replace />;
  }
  return <div>{children}</div>;
}

export default ProtectedRoute;
