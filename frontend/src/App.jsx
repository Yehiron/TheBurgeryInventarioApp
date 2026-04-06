import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, List, Tag, Users, BookOpen, ClipboardCheck } from 'lucide-react';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import CrudPage from './pages/CrudPage';
import RecipesPage from './pages/RecipesPage';
import ChecklistPage from './pages/ChecklistPage';
import OrdersPage from './pages/OrdersPage';

function Sidebar() {
  const location = useLocation();
  const navs = [
    { path: '/', label: 'Inicio', icon: <LayoutDashboard size={20}/> },
    { path: '/produccion', label: 'Producción', icon: <ClipboardCheck size={20}/> },
    { path: '/pedidos', label: 'Pedidos', icon: <ShoppingCart size={20}/> },
    { path: '/ingredientes', label: 'Ingredientes', icon: <List size={20}/> },
    { path: '/productos', label: 'Productos', icon: <Tag size={20}/> },
    { path: '/categorias', label: 'Categorías', icon: <Tag size={20}/> },
    { path: '/proveedores', label: 'Proveedores', icon: <Users size={20}/> },
    { path: '/recetas', label: 'Recetas', icon: <BookOpen size={20}/> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        The Burgery
      </div>
      <div className="nav-links">
        {navs.map(nav => (
          <Link key={nav.path} to={nav.path} className={`nav-item ${location.pathname === nav.path ? 'active' : ''}`}>
            {nav.icon}
            {nav.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produccion" element={<ChecklistPage />} />
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/ingredientes" element={<CrudPage entity="ingredients" title="Ingredientes" />} />
            <Route path="/productos" element={<CrudPage entity="products" title="Productos" />} />
            <Route path="/categorias" element={<CrudPage entity="categories" title="Categorías" />} />
            <Route path="/proveedores" element={<CrudPage entity="suppliers" title="Proveedores" />} />
            <Route path="/recetas" element={<RecipesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
