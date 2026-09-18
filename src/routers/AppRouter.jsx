import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ListaAprendices from '../views/PrincipalView'; 

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que carga tu vista de aprendices */}
        <Route path="/aprendices" element={<ListaAprendices />} />
        
        {/* Redirección por defecto: si alguien entra a "/", lo manda automáticamente a "/aprendices" */}
        <Route path="/" element={<Navigate to="/aprendices" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;