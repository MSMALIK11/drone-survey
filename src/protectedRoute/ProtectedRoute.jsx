
import React from 'react';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
function ProtectedRoute({children}) {
  const isUserExist=JSON.parse(localStorage.getItem('auth-user')) || null
    if(!isUserExist){
        return <Navigate to='/dron-survey' replace />
    }
  return (
    <div>{children}</div>
  )
}

export default ProtectedRoute