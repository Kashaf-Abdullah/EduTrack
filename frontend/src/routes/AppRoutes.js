


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
    {/* Single dashboard route - all sub-routes iske andar handle honge */}
    <Route path="/dashboard/*" element={<Dashboard />} />
    
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;