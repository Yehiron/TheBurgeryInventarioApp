import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

function formConfigByEntity(entity) {
  switch (entity) {
    case 'categories': return [{ name: 'nombre', label: 'Nombre' }, { name: 'descripcion', label: 'Descripción', type: 'textarea' }];
    case 'suppliers': return [{ name: 'nombre', label: 'Nombre' }, { name: 'telefono', label: 'Teléfono' }, { name: 'direccion', label: 'Dirección' }, { name: 'contacto', label: 'Contacto' }];
    case 'ingredients': return [
      { name: 'nombre', label: 'Nombre' }, 
      { name: 'unidadMedida', label: 'Unidad de Medida', type: 'select_static', options: ['g', 'kg', 'ml', 'lt', 'und', 'caja'] },
      { name: 'category', label: 'Categoría', type: 'select', endpoint: '/categories' },
      { name: 'supplier', label: 'Proveedor', type: 'select', endpoint: '/suppliers' }
    ];
    case 'products': return [
      { name: 'nombre', label: 'Nombre' },
      { name: 'unidadCompra', label: 'Unidad de Compra', type: 'select_static', options: ['g', 'kg', 'ml', 'lt', 'und', 'caja'] },
      { name: 'precioEstimado', label: 'Precio Estimado', type: 'number' },
      { name: 'category', label: 'Categoría', type: 'select', endpoint: '/categories' },
      { name: 'supplier', label: 'Proveedor', type: 'select', endpoint: '/suppliers' }
    ];
    default: return [];
  }
}

export default function CrudPage({ entity, title }) {
  const [items, setItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const [options, setOptions] = useState({});
  const [search, setSearch] = useState('');

  const config = formConfigByEntity(entity);

  useEffect(() => {
    loadData();
    loadOptions();
  }, [entity]);

  const loadData = async () => {
    try {
      const data = await api.get(`/${entity}`);
      setItems(data);
    } catch (e) {
      console.error(e);
      alert('Error cargando datos');
    }
  };

  const loadOptions = async () => {
    let newOptions = {};
    for (let field of config) {
      if (field.type === 'select') {
        const data = await api.get(field.endpoint);
        newOptions[field.name] = data;
      }
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...formData };
      for (let field of config) {
        if (field.type === 'select') {
          payload[field.name] = { id: parseInt(payload[field.name]) };
        }
      }

      if (currentId) {
        await api.put(`/${entity}/${currentId}`, payload);
      } else {
        await api.post(`/${entity}`, payload);
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        await api.delete(`/${entity}/${id}`);
        loadData();
      } catch (e) {
        alert('Error al eliminar');
      }
    }
  };

  const openForm = (item = null) => {
    if (item) {
      setCurrentId(item.id);
      let data = { ...item };
      for (let field of config) {
        if (field.type === 'select' && data[field.name]) {
          data[field.name] = data[field.name].id;
        }
      }
      setFormData(data);
    } else {
      setCurrentId(null);
      setFormData({});
    }
    setModalOpen(true);
  };

  const filteredItems = items.filter(item => item.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="top-bar">
        <h1 className="page-title">{title}</h1>
        <button onClick={() => openForm()}><Plus size={20}/> Nuevo {title}</button>
      </div>

      <div className="card">
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{marginBottom: '24px'}}
        />

        <table>
          <thead>
            <tr>
              {config.map(f => <th key={f.name}>{f.label}</th>)}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                {config.map(f => (
                  <td key={f.name}>
                     {f.type === 'select' ? item[f.name]?.nombre : item[f.name]}
                  </td>
                ))}
                <td>
                  <div className="actions">
                    <button className="outline" onClick={() => openForm(item)}><Edit2 size={16}/></button>
                    <button className="danger outline" onClick={() => handleDelete(item.id)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{currentId ? 'Editar' : 'Nuevo'} {title}</div>
              <button className="close-btn" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {config.map(field => (
                <div key={field.name} style={{marginBottom: '16px'}}>
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required 
                      value={formData[field.name] || ''} 
                      onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                    />
                  ) : field.type === 'select_static' ? (
                    <select 
                      required 
                      value={formData[field.name] || ''} 
                      onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                    >
                      <option value="">Seleccione...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'select' ? (
                    <select 
                      required 
                      value={formData[field.name] || ''} 
                      onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                    >
                      <option value="">Seleccione...</option>
                      {options[field.name]?.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type={field.type || 'text'} 
                      required 
                      value={formData[field.name] || ''} 
                      onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                      step={field.type === 'number' ? '0.01' : undefined}
                    />
                  )}
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
