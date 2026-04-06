import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ChecklistPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipes, setExpandedRecipes] = useState(new Set());
  
  // status[recipeId_ingredientId] = 'HAY', 'NOHAY', 'FALTA'
  const [status, setStatus] = useState({}); 
  // faltantes[recipeId_ingredientId] = amount
  const [faltantes, setFaltantes] = useState({}); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.get('/recipes');
      setRecipes(data);
    } catch (e) {
      console.error(e);
      alert("Error cargando recetas");
    }
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedRecipes);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRecipes(newSet);
  };

  const handleGenerateOrders = async () => {
    // 1. Traverse all recipe items and accumulate totals
    const missingIngredients = {}; // ingredientId => { ingredient, cantidad }

    for (const recipe of recipes) {
      for (const ing of recipe.ingredients) {
        const idKey = `${recipe.id}_${ing.ingredient.id}`;
        const pStatus = status[idKey];
        
        let qtyToAdd = 0;
        if (pStatus === 'NOHAY') {
          qtyToAdd = ing.cantidadRequerida;
        } else if (pStatus === 'FALTA') {
          qtyToAdd = parseFloat(faltantes[idKey]);
        }

        if (qtyToAdd > 0) {
          if (!missingIngredients[ing.ingredient.id]) {
            missingIngredients[ing.ingredient.id] = {
               ingredient: ing.ingredient,
               cantidad: 0
            };
          }
          missingIngredients[ing.ingredient.id].cantidad += qtyToAdd;
        }
      }
    }

    const items = Object.values(missingIngredients).map(item => ({
      ingredient: { id: item.ingredient.id },
      cantidad: item.cantidad
    }));

    if (items.length === 0) {
      alert("No hay ingredientes marcados como faltantes o vacíos. No se requiere pedido.");
      return;
    }

    try {
      const payload = {
        fecha: new Date().toISOString(),
        items: items
      };
      await api.post('/purchase_orders', payload);
      alert("¡Orden de compra generada correctamente!");
      navigate("/pedidos");
    } catch (e) {
      console.error(e);
      alert("Error al generar la orden");
    }
  };

  return (
    <div style={{maxWidth: '900px', margin: '0 auto'}}>
      <div className="top-bar">
        <h1 className="page-title">Producción (Checklist)</h1>
      </div>

      <div style={{marginBottom: '32px'}}>
        <p style={{fontSize: '18px', color: '#666', marginBottom: '24px'}}>
          Expande cada receta para verificar sus ingredientes. Al finalizar, haz clic en "Generar orden de compra" abajo.
        </p>

        {recipes.map(recipe => {
          const isExpanded = expandedRecipes.has(recipe.id);
          
          return (
            <div key={recipe.id} className="accordion">
              <div className="accordion-header" onClick={() => toggleExpand(recipe.id)}>
                <span>{recipe.nombre} <span style={{fontSize: '16px', color: '#666', fontWeight: 'normal', marginLeft: '8px'}}>({recipe.ingredients.length} ingredientes)</span></span>
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {isExpanded && (
                <div className="accordion-body">
                  {recipe.ingredients.length === 0 && <p style={{color: '#666'}}>No hay ingredientes asignados a esta receta.</p>}
                  
                  {recipe.ingredients.map(ing => {
                    const ingId = ing.ingredient.id;
                    const idKey = `${recipe.id}_${ingId}`;
                    const s = status[idKey];

                    return (
                      <div key={ingId} className="checklist-item">
                        <div className="checklist-header">
                            {ing.ingredient.nombre} <span style={{color: '#666', fontSize:'16px'}}> (Requerido: {ing.cantidadRequerida} {ing.ingredient.unidadMedida})</span>
                        </div>
                        
                        <div className="checklist-options">
                          <button 
                            className={`btn-hay ${s === 'HAY' ? 'selected' : ''}`}
                            onClick={() => setStatus({...status, [idKey]: 'HAY'})}>
                            Hay suficiente
                          </button>
                          <button 
                            className={`btn-nohay ${s === 'NOHAY' ? 'selected' : ''}`}
                            onClick={() => setStatus({...status, [idKey]: 'NOHAY'})}>
                            No hay
                          </button>
                          <button 
                            className={`btn-falta ${s === 'FALTA' ? 'selected' : ''}`}
                            onClick={() => setStatus({...status, [idKey]: 'FALTA'})}>
                            Falta cantidad
                          </button>
                        </div>

                        {s === 'FALTA' && (
                          <div className="missing-amount">
                            <label style={{marginBottom: 0}}>Cantidad faltante ({ing.ingredient.unidadMedida}):</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              style={{width: '200px', marginBottom: 0}}
                              value={faltantes[idKey] || ''}
                              onChange={(e) => setFaltantes({...faltantes, [idKey]: e.target.value})}
                              placeholder="Ej: 2.5"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{marginTop: '48px', marginBottom: '64px'}}>
        <button onClick={handleGenerateOrders} style={{width: '100%', fontSize: '24px', padding: '24px'}}>
          Generar orden de compra
        </button>
      </div>
    </div>
  );
}
