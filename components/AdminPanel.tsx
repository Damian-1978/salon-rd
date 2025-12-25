
import React, { useState, useMemo } from 'react';
import { X, Plus, Lock, ShoppingCart, Search, ArrowLeft, Database, Trash2, CheckCircle2, Phone, BarChart3, TrendingUp, PackageSearch, Users, Star, Camera, Landmark, Banknote, CreditCard, Receipt, MessageCircle, Send, Calendar, MapPin, ShieldCheck, Edit3, Save, Image as ImageIcon, Tag } from 'lucide-react';
import { Product, Category, Order, RegistrationRecord, PaymentStatus } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  registrations: RegistrationRecord[];
  onUpdateRegistrations: (regs: RegistrationRecord[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onUpdateProducts, 
  orders, 
  onUpdateOrders, 
  registrations, 
  onUpdateRegistrations 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PRODUCTOS' | 'PEDIDOS' | 'FACTURACION' | 'CLIENTES'>('PRODUCTOS');
  
  // Estados para edición de productos
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1319') setIsAuthenticated(true);
    else { alert('PIN INCORRECTO'); setPassword(''); }
  };

  // Lógica de Inventario
  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedProducts;
    if (isAddingProduct) {
      updatedProducts = [editingProduct, ...products];
    } else {
      updatedProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    }
    
    onUpdateProducts(updatedProducts);
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('¿Seguro que desea eliminar este producto del catálogo?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsAddingProduct(false);
  };

  const startAdd = () => {
    const newId = (Math.max(0, ...products.map(p => parseInt(p.id))) + 1).toString();
    setEditingProduct({
      id: newId,
      name: '',
      brand: '',
      category: Category.TRATAMIENTOS,
      description: '',
      price: 0,
      bulkPrice: 0,
      bulkThreshold: 6,
      images: [''],
      stock: 0,
      hairType: ['Todo tipo'],
      benefits: [],
      applicationTime: 'Variable',
      professionalWarning: 'Uso profesional.',
      rating: 5,
      reviews: 0
    });
    setIsAddingProduct(true);
  };

  const togglePaymentStatus = (orderId: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, paymentStatus: (o.paymentStatus === 'PAID' ? 'PENDING' : 'PAID') as PaymentStatus } : o);
    onUpdateOrders(updated);
  };

  const sendInvoiceToClient = (order: Order) => {
    const itemsStr = order.items.map(i => `• ${i.name} [x${i.quantity}] - RD$${((i.quantity >= i.bulkThreshold ? i.bulkPrice : i.price) * i.quantity).toLocaleString()}`).join('\n');
    const msg = `*SALÓN RD - FACTURA PRO*\n\nHola *${order.stylist.name}* (${order.stylist.salonName}).\n\nConfirmamos su pedido *#${order.id}*.\n\n*DESCRIPCIÓN:* \n${itemsStr}\n\n*TOTAL:* RD$${order.subtotal.toLocaleString()}\n\n*ENTREGA:* Su pedido será entregado en *4 días hábiles*.\n\n*PAGO:* Favor realizar transferencia a:\n\n- *Popular:* 789234561\n- *Banreservas:* 960123452\n- *RNC:* 131-98765-4\n- *Titular:* SALÓN RD SUMINISTROS\n\n_Envie el comprobante por esta vía para despachar._`;
    let phone = order.stylist.phone.replace(/\D/g,'');
    if (phone.length === 10) phone = `1${phone}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.subtotal, 0);
    const pending = orders.filter(o => o.paymentStatus !== 'PAID').length;
    return { revenue, pending, clients: registrations.length };
  }, [orders, registrations]);

  const filteredInventory = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-white animate-in fade-in duration-300 overflow-hidden">
      <div className="bg-rose-900 text-white px-6 py-6 flex items-center justify-between shadow-2xl pt-safe">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center font-brand font-bold text-xl rotate-3">A</div>
           <h2 className="font-brand font-bold text-xl uppercase tracking-tighter">Control Maestro RD</h2>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 rounded-2xl active-scale transition-colors"><X className="w-5 h-5" /></button>
      </div>

      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-rose-50/30">
           <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
              <div className="inline-flex p-8 bg-rose-900 text-white rounded-[2.5rem] shadow-xl"><Lock className="w-10 h-10" /></div>
              <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Ingrese PIN de Seguridad</p>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PIN" className="w-full bg-white border-4 border-rose-100 rounded-[2.5rem] py-8 text-center text-4xl font-bold tracking-[1.5rem] focus:border-rose-600 outline-none shadow-inner" autoFocus />
              <button type="submit" className="w-full bg-rose-gradient text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest active-scale">Desbloquear Sistema</button>
           </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
           {/* Navigation Tabs */}
           <div className="bg-white border-b border-rose-50 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shadow-sm">
              <button onClick={() => setActiveTab('DASHBOARD')} className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'DASHBOARD' ? 'bg-rose-900 text-white shadow-md' : 'text-rose-200'}`}>Métricas</button>
              <button onClick={() => setActiveTab('PRODUCTOS')} className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'PRODUCTOS' ? 'bg-rose-900 text-white shadow-md' : 'text-rose-200'}`}>Inventario Pro</button>
              <button onClick={() => setActiveTab('PEDIDOS')} className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'PEDIDOS' ? 'bg-rose-900 text-white shadow-md' : 'text-rose-200'}`}>Logística</button>
              <button onClick={() => setActiveTab('FACTURACION')} className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'FACTURACION' ? 'bg-rose-900 text-white shadow-md' : 'text-rose-200'}`}>Caja {stats.pending > 0 && '●'}</button>
              <button onClick={() => setActiveTab('CLIENTES')} className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'CLIENTES' ? 'bg-rose-900 text-white shadow-md' : 'text-rose-200'}`}>Red Pro</button>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32 bg-rose-50/20">
              {/* TAB: INVENTARIO (EDITAR TODO EL APP) */}
              {activeTab === 'PRODUCTOS' && !editingProduct && (
                <div className="space-y-6 animate-in slide-in-from-bottom-5">
                   <div className="flex items-center justify-between">
                      <h3 className="font-brand font-bold text-2xl uppercase tracking-tighter text-rose-900">Catálogo Maestro</h3>
                      <button onClick={startAdd} className="bg-rose-gradient text-white px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-lg active-scale">
                        <Plus className="w-4 h-4" /> Nuevo Producto
                      </button>
                   </div>

                   <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-200" />
                      <input 
                        type="text" 
                        placeholder="Buscar en el inventario..." 
                        className="w-full bg-white border border-rose-50 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-100 shadow-sm"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                   </div>

                   <div className="grid gap-4">
                      {filteredInventory.map(p => (
                        <div key={p.id} className="bg-white p-5 rounded-[2.5rem] border border-rose-50 shadow-soft flex items-center gap-4 group">
                           <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white">
                              <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-black text-rose-300 uppercase tracking-widest mb-1">{p.brand} · {p.category}</p>
                              <h4 className="font-bold text-[12px] text-gray-900 uppercase truncate leading-none mb-2">{p.name}</h4>
                              <div className="flex items-center gap-4">
                                 <p className="text-xs font-black text-rose-900">RD${p.bulkPrice.toLocaleString()}</p>
                                 <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${p.stock < 5 ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-rose-50 text-rose-300'}`}>
                                    Stock: {p.stock}
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => startEdit(p)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl active-scale hover:bg-rose-100 transition-colors shadow-sm"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-4 bg-rose-50 text-rose-300 rounded-2xl active-scale hover:text-rose-600 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* FORMULARIO DE EDICIÓN / ADICIÓN */}
              {editingProduct && (
                <div className="bg-white p-8 rounded-[3.5rem] shadow-soft border border-rose-50 animate-in zoom-in duration-300 space-y-8">
                   <div className="flex items-center justify-between border-b border-rose-50 pb-6">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setEditingProduct(null)} className="p-3 bg-rose-50 text-rose-600 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
                        <div>
                          <h3 className="text-xl font-brand font-bold text-gray-900 uppercase tracking-tighter">{isAddingProduct ? 'Añadir Producto' : 'Editar Producto'}</h3>
                          <p className="text-[9px] font-black text-rose-200 uppercase tracking-widest">ID: #{editingProduct.id}</p>
                        </div>
                      </div>
                      <button onClick={saveProduct} className="bg-rose-gradient text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl active-scale">
                        <Save className="w-4 h-4" /> Guardar Cambios
                      </button>
                   </div>

                   <form className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Nombre del Producto</label>
                            <input required className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Eje: Blower Pro Ionic..." />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Marca</label>
                            <input required className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} placeholder="Eje: HairLuxe..." />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Precio Detal</label>
                               <input type="number" className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Precio Mayorista</label>
                               <input type="number" className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.bulkPrice} onChange={e => setEditingProduct({...editingProduct, bulkPrice: parseInt(e.target.value)})} />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Categoría</label>
                               <select className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})}>
                                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Stock Inicial</label>
                               <input type="number" className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">URL Fotografía Principal</label>
                            <div className="flex gap-3">
                               <div className="w-16 h-16 bg-rose-50 rounded-xl overflow-hidden shrink-0 border border-rose-100 flex items-center justify-center text-rose-200">
                                  {editingProduct.images[0] ? <img src={editingProduct.images[0]} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6" />}
                               </div>
                               <input className="flex-1 bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.images[0]} onChange={e => setEditingProduct({...editingProduct, images: [e.target.value, ...editingProduct.images.slice(1)]})} placeholder="https://..." />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Descripción Pro</label>
                            <textarea rows={4} className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200 resize-none" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} placeholder="Detalles técnicos..." />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-rose-200 tracking-widest pl-2">Advertencia Profesional</label>
                            <input className="w-full bg-rose-50/30 border border-rose-50 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-200" value={editingProduct.professionalWarning} onChange={e => setEditingProduct({...editingProduct, professionalWarning: e.target.value})} placeholder="Ej: Solo para cabina..." />
                         </div>
                      </div>
                   </form>
                </div>
              )}

              {/* VISTAS RESTANTES (MÉTRICAS, FACTURACIÓN, ETC) - SE MANTIENEN IGUAL PERO DENTRO DE LA LÓGICA AUTH */}
              {activeTab === 'DASHBOARD' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-5">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-rose-50">
                         <TrendingUp className="text-emerald-500 w-5 h-5 mb-2" />
                         <p className="text-[9px] font-black text-rose-200 uppercase tracking-widest">Facturación</p>
                         <h4 className="text-xl font-black">RD${stats.revenue.toLocaleString()}</h4>
                      </div>
                      <div className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-rose-50">
                         <Users className="text-purple-500 w-5 h-5 mb-2" />
                         <p className="text-[9px] font-black text-rose-200 uppercase tracking-widest">Salones RD</p>
                         <h4 className="text-xl font-black">{stats.clients}</h4>
                      </div>
                   </div>
                   <div className="bg-white p-8 rounded-[3rem] shadow-soft border border-rose-50">
                      <h4 className="text-[10px] font-black uppercase text-rose-900 tracking-widest mb-4">Cartera Pendiente</h4>
                      <p className="text-2xl font-black text-rose-600">RD${orders.filter(o => o.paymentStatus !== 'PAID').reduce((a,b) => a+b.subtotal, 0).toLocaleString()}</p>
                   </div>
                </div>
              )}

              {activeTab === 'FACTURACION' && (
                <div className="space-y-6">
                   <h3 className="font-brand font-bold text-2xl uppercase tracking-tighter text-rose-900 px-2">Caja y Facturación</h3>
                   {orders.length === 0 ? <p className="text-center py-20 opacity-20 font-black uppercase text-[10px]">Sin movimientos</p> : 
                     orders.map(order => (
                       <div key={order.id} className={`bg-white p-8 rounded-[3.5rem] shadow-soft border-l-8 flex flex-col gap-5 ${order.paymentStatus === 'PAID' ? 'border-emerald-500 opacity-60' : 'border-rose-500'}`}>
                          <div className="flex justify-between items-start">
                             <div>
                                <p className="text-[9px] font-black text-rose-200 uppercase tracking-widest">ORDEN {order.id}</p>
                                <h4 className="font-bold text-lg text-gray-900 uppercase leading-none">{order.stylist.salonName}</h4>
                                <span className={`text-[8px] font-black uppercase tracking-widest mt-2 block ${order.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`}>
                                  {order.paymentStatus === 'PAID' ? 'COBRADO' : 'PENDIENTE DE COBRO'}
                                </span>
                             </div>
                             <div className="text-right">
                                <p className="text-2xl font-black text-gray-900">RD${order.subtotal.toLocaleString()}</p>
                                <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{order.paymentMethod}</span>
                             </div>
                          </div>
                          <div className="flex gap-3">
                             <button onClick={() => sendInvoiceToClient(order)} className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center gap-2 active-scale border border-emerald-100 font-black text-[9px] uppercase">
                                <MessageCircle className="w-4 h-4" /> Enviar Factura
                             </button>
                             {order.paymentStatus !== 'PAID' && (
                               <button onClick={() => togglePaymentStatus(order.id)} className="flex-[1.5] py-4 bg-rose-900 text-white rounded-2xl font-black uppercase text-[9px] shadow-lg active-scale flex items-center justify-center gap-2">
                                  <ShieldCheck className="w-4 h-4" /> Marcar Pago
                               </button>
                             )}
                          </div>
                       </div>
                     ))
                   }
                </div>
              )}

              {activeTab === 'CLIENTES' && (
                <div className="space-y-6">
                   <h3 className="font-brand font-bold text-2xl uppercase tracking-tighter text-rose-900 px-2">Red de Salones Pro</h3>
                   <div className="grid gap-4">
                      {registrations.map(reg => (
                        <div key={reg.id} className="bg-white p-6 rounded-[3rem] shadow-soft border border-rose-50 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-rose-gradient text-white rounded-xl flex items-center justify-center font-brand font-bold text-xl">{reg.salonName.charAt(0)}</div>
                              <div>
                                 <h4 className="font-bold text-sm text-gray-900 uppercase leading-none">{reg.salonName}</h4>
                                 <p className="text-[9px] text-rose-300 font-black uppercase tracking-widest mt-1">{reg.name}</p>
                              </div>
                           </div>
                           <a href={`https://wa.me/1${reg.phone.replace(/\D/g,'')}`} target="_blank" className="p-4 bg-rose-50 text-rose-600 rounded-2xl active-scale shadow-sm border border-rose-100"><MessageCircle className="w-5 h-5" /></a>
                        </div>
                      ))}
                      {registrations.length === 0 && <p className="text-center py-20 opacity-20 text-xs font-black uppercase">Sin registros aún</p>}
                   </div>
                </div>
              )}

              {activeTab === 'PEDIDOS' && (
                 <div className="space-y-6 pb-20">
                    <h3 className="font-brand font-bold text-2xl uppercase tracking-tighter text-rose-900 px-2">Logística de Despacho</h3>
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-8 rounded-[3.5rem] shadow-soft border border-rose-50 space-y-4">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest">ID #{order.id}</p>
                               <h4 className="font-bold text-lg leading-tight text-gray-900 uppercase">{order.stylist.salonName}</h4>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-50 text-rose-400'}`}>
                               {order.status === 'COMPLETED' ? 'Despachado' : 'Pendiente'}
                            </span>
                         </div>
                         <div className="bg-rose-50/50 p-4 rounded-2xl text-[10px] font-bold text-gray-600 space-y-1">
                            {order.items.map((i, idx) => <p key={idx}>• {i.name} [x{i.quantity}]</p>)}
                         </div>
                         <div className="flex justify-between items-center">
                            <p className="font-black text-2xl text-gray-900">RD${order.subtotal.toLocaleString()}</p>
                            <div className="flex gap-2">
                               {order.status !== 'COMPLETED' && (
                                 <button onClick={() => onUpdateOrders(orders.map(o => o.id === order.id ? {...o, status: 'COMPLETED'} : o))} className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl active-scale shadow-sm border border-emerald-100"><CheckCircle2 className="w-6 h-6" /></button>
                               )}
                               <a href={`https://wa.me/1${order.stylist.phone.replace(/\D/g,'')}`} target="_blank" className="p-5 bg-rose-900 text-white rounded-2xl active-scale shadow-lg"><Phone className="w-6 h-6" /></a>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
