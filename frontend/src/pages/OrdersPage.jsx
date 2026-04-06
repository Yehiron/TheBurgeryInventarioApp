import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { jsPDF } from 'jspdf';
import { Download, Send, Trash2 } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await api.get('/purchase_orders');
    // Sort by descending id (most recent first)
    setOrders(data.sort((a,b) => b.id - a.id));
  };

  const handleDelete = async (id) => {
    if(confirm('¿Eliminar pedido?')) {
      await api.delete(`/purchase_orders/${id}`);
      loadData();
    }
  };

  return (
    <div>
      <h1 className="page-title">Pedidos de Compra</h1>
      
      {orders.length === 0 && <p>No hay pedidos registrados.</p>}
      
      {orders.map(order => (
        <OrderCard key={order.id} order={order} onDelete={() => handleDelete(order.id)} />
      ))}
    </div>
  );
}

function OrderCard({ order, onDelete }) {
  const dateStr = new Date(order.fecha).toLocaleString('es-ES');
  
  // Group by supplier
  const groups = {}; // supplierId -> { supplier, items: [] }
  
  order.items.forEach(item => {
    const sup = item.ingredient.supplier;
    const supId = sup ? sup.id : 'sin_proveedor';
    if (!groups[supId]) {
      groups[supId] = { supplier: sup, items: [] };
    }
    
    // Sum quantities for same ingredient
    const existing = groups[supId].items.find(i => i.ingredient.id === item.ingredient.id);
    if(existing) {
        existing.cantidad += item.cantidad;
    } else {
        groups[supId].items.push({...item});
    }
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(22);
    doc.text('The Burgery', 105, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(16);
    doc.text('Orden de Compra', 105, y, { align: 'center' });
    y += 15;

    doc.setFontSize(12);
    doc.text(`Fecha: ${dateStr}`, 20, y);
    y += 15;

    Object.values(groups).forEach(group => {
        const { supplier, items } = group;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`PROVEEDOR: ${supplier ? supplier.nombre : 'Sin asignado'}`, 20, y);
        y += 8;

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        items.forEach(item => {
            doc.text(`- ${item.ingredient.nombre} — ${item.cantidad} ${item.ingredient.unidadMedida}`, 25, y);
            y += 8;
        });
        
        y += 5; // space between suppliers
        if(y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save(`pedido_consolidado_${order.id}.pdf`);
  };

  const sendWhatsApp = (supplierGroup) => {
    const { supplier, items } = supplierGroup;
    if (!supplier?.telefono) {
      alert("El proveedor no tiene número de teléfono registrado.");
      return;
    }

    let text = `Hola, somos The Burgery.\nQueremos realizar el siguiente pedido:\n\n`;
    items.forEach(item => {
      text += `• ${item.ingredient.nombre} — ${item.cantidad} ${item.ingredient.unidadMedida}\n`;
    });
    text += `\nGracias.`;

    const encodedText = encodeURIComponent(text);
    const phone = supplier.telefono.replace(/\D/g,'');
    window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="card" style={{borderLeft: '4px solid #111'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
            <div>
                <h2>Pedido #{order.id}</h2>
                <div style={{color: '#666'}}>{dateStr}</div>
            </div>
            <div style={{display: 'flex', gap: '16px'}}>
                <button className="outline" onClick={generatePDF} style={{padding: '8px 16px', fontSize: '16px'}}>
                    <Download size={18}/> Descargar PDF (Unificado)
                </button>
                <button className="danger outline" onClick={onDelete} style={{padding: '8px'}}><Trash2 size={16}/></button>
            </div>
        </div>
        <hr style={{margin: '16px 0', borderColor: '#eee'}}/>
        
        {Object.values(groups).map((group, idx) => (
            <div key={idx} style={{marginBottom: '32px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #ddd'}}>
                <h3 style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between'}}>
                    {group.supplier ? group.supplier.nombre : 'Sin Proveedor Asignado'}
                    <span style={{fontSize: '14px', color: '#666', fontWeight: 'normal'}}>
                        {group.supplier?.telefono}
                    </span>
                </h3>
                
                <table style={{marginBottom: '16px', backgroundColor: 'transparent'}}>
                    <thead>
                        <tr>
                            <th style={{backgroundColor: 'transparent', paddingLeft: 0}}>Producto</th>
                            <th style={{backgroundColor: 'transparent'}}>Cant.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {group.items.map(item => (
                            <tr key={item.ingredient.id}>
                                <td style={{paddingLeft: 0}}>{item.ingredient.nombre}</td>
                                <td>{item.cantidad} {item.ingredient.unidadMedida}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{display: 'flex', gap: '16px'}}>
                    <button onClick={() => sendWhatsApp(group)} style={{flex: 1, backgroundColor: '#25D366', color: 'white', padding: '12px', fontSize: '16px'}}>
                        <Send size={18}/> Enviar pedido a {group.supplier ? group.supplier.nombre : 'Proveedor'} por WhatsApp
                    </button>
                </div>
            </div>
        ))}

    </div>
  );
}
