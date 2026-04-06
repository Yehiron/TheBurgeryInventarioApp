import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Plus, Edit2, Trash2, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [ingredientsStore, setIngredientsStore] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', ingredients: [] });
  const [currentId, setCurrentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    api.get('/ingredients').then(setIngredientsStore);
  }, []);

  const loadData = async () => {
    setRecipes(await api.get('/recipes'));
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredient: '', cantidadRequerida: '' }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngs = [...formData.ingredients];
    newIngs[index][field] = value;
    setFormData({ ...formData, ingredients: newIngs });
  };

  const removeIngredient = (index) => {
    const newIngs = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ingredients: formData.ingredients.map(i => ({
          ingredient: { id: parseInt(i.ingredient) },
          cantidadRequerida: parseFloat(i.cantidadRequerida)
        }))
      };

      if (currentId) {
        await api.put(`/recipes/${currentId}`, payload);
      } else {
        await api.post('/recipes', payload);
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      alert('Error');
    }
  };

  const openForm = (recipe = null) => {
    if(recipe){
        setCurrentId(recipe.id);
        setFormData({
            nombre: recipe.nombre,
            descripcion: recipe.descripcion,
            ingredients: recipe.ingredients.map(i => ({
                ingredient: i.ingredient.id,
                cantidadRequerida: i.cantidadRequerida
            }))
        });
    } else {
        setCurrentId(null);
        setFormData({ nombre: '', descripcion: '', ingredients: [] });
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
      if(confirm("¿Seguro que deseas eliminar?")) {
          await api.delete("/recipes/" + id);
          loadData();
      }
  };

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">Recetas</h1>
        <button onClick={() => openForm()}><Plus size={20}/> Nueva Receta</button>
      </div>

      <div className="grid-3">
        {recipes.map(recipe => (
          <div key={recipe.id} className="card">
            <h2 style={{marginBottom: '8px'}}>{recipe.nombre}</h2>
            <p style={{color: '#666', marginBottom: '16px'}}>{recipe.descripcion}</p>
            <p><strong>{recipe.ingredients.length}</strong> ingredientes</p>
            
            <div className="actions" style={{marginTop: '24px'}}>
              <button className="outline" onClick={() => openForm(recipe)}><Edit2 size={16}/></button>
              <button className="danger outline" onClick={() => handleDelete(recipe.id)}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{currentId ? 'Editar' : 'Nueva'} Receta</div>
              <button className="close-btn" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
              
              <label>Descripción</label>
              <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
              
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'16px', marginBottom:'16px'}}>
                <h3 style={{fontWeight:'bold', fontSize:'18px'}}>Ingredientes</h3>
                <button type="button" className="outline" onClick={handleAddIngredient} style={{padding:'8px', fontSize:'14px'}}>+ Agregar</button>
              </div>

              {formData.ingredients.map((ing, i) => (
                <div key={i} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                  <select required value={ing.ingredient} onChange={e => updateIngredient(i, 'ingredient', e.target.value)} style={{flex: 2}}>
                    <option value="">Seleccione ingrediente...</option>
                    {ingredientsStore.map(storeIng => (
                        <option key={storeIng.id} value={storeIng.id}>{storeIng.nombre} ({storeIng.unidadMedida})</option>
                    ))}
                  </select>
                  <input required type="number" step="0.01" placeholder="Cantidad" value={ing.cantidadRequerida} onChange={e => updateIngredient(i, 'cantidadRequerida', e.target.value)} style={{flex: 1}}/>
                  <button type="button" className="danger outline" onClick={() => removeIngredient(i)}><Trash2 size={16}/></button>
                </div>
              ))}

              <div style={{display: 'flex', gap: '16px', marginTop: '24px'}}>
                <button type="submit" style={{flex: 1}}>Guardar</button>
                <button type="button" className="outline" style={{flex: 1}} onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
