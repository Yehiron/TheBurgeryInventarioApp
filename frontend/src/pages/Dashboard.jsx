import React, { useEffect, useState } from 'react';
import { api } from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    ingredients: 0,
    products: 0,
    categories: 0,
    suppliers: 0
  });
  
  const [recentIngredients, setRecentIngredients] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ing, prod, cat, sup] = await Promise.all([
        api.get('/ingredients'),
        api.get('/products'),
        api.get('/categories'),
        api.get('/suppliers')
      ]);
      
      setStats({
        ingredients: ing.length,
        products: prod.length,
        categories: cat.length,
        suppliers: sup.length
      });
      setRecentIngredients(ing.slice(-5).reverse());
      
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid-3">
        <div className="card stat-card">
          <div className="stat-number">{stats.ingredients}</div>
          <div className="stat-label">Ingredientes</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.products}</div>
          <div className="stat-label">Productos</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.categories}</div>
          <div className="stat-label">Categorías</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.suppliers}</div>
          <div className="stat-label">Proveedores</div>
        </div>
      </div>
      
      <div className="card">
        <h2>Últimos Ingredientes Registrados</h2>
        <br/>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Categoría</th>
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {recentIngredients.map(item => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.unidadMedida}</td>
                <td>{item.category?.nombre}</td>
                <td>{item.supplier?.nombre}</td>
              </tr>
            ))}
            {recentIngredients.length === 0 && (
              <tr>
                <td colSpan="4" style={{textAlign: 'center'}}>No hay registros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
