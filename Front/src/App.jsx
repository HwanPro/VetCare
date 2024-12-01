import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import V_Client from './Views/V_Client'
import V_Employee from './Views/V_Employee'
import V_Login from './Views/V_Login/V_Login'
import { initMercadoPago } from '@mercadopago/sdk-react'
;
// Inicializa MercadoPago con tu clave pública
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY); 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/empleado/*" element={<V_Employee />} />
        <Route path="/cliente/*" element={<V_Client />} />
        <Route path="/login" element={<V_Login />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
