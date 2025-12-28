
import React, { useState, useMemo } from 'react';
import { 
  X, Plus, Lock, Search, Trash2, ShieldCheck, Edit3, LogOut, Wallet, 
  Package, TrendingUp, Receipt, CheckCircle2, DollarSign,
  Eye, EyeOff, Calendar, UserCheck, CheckSquare, Square, Save,
  Users, Truck, FileText, Share2, Printer, Download, ArrowLeft,
  Phone, MessageSquare, ExternalLink, Copy, Globe, Sparkles, Instagram,
  SearchCode, MapPin, Building2, BadgeCheck, AlertCircle
} from 'lucide-react';
import { Product, Category, Order, RegistrationRecord, Supplier, CartItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  registrations: RegistrationRecord[];
  onUpdateRegistrations: (regs: RegistrationRecord[]) => void;
  suppliers: Supplier[];
  onUpdateSuppliers: (suppliers: Supplier[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, onClose, products, onUpdateProducts, orders, onUpdateOrders, 
  registrations, onUpdateRegistrations, suppliers, onUpdateSuppliers 
}) => {
  const [authMode, setAuthMode] = useState<'NONE' | 'MASTER' | 'SUPPLIER'>('NONE');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'STATS' | 'PRODUCTS' | 'ORDERS' | 'SUPPLIERS' | 'SALONS'>('STATS');
  const [loggedSupplier, setLoggedSupplier] = useState<Supplier | null>(null);
  const [search, setSearch] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1319') {
      setAuthMode('MASTER');
      setActiveTab('STATS');
    } else {
      const found = suppliers.find(s => s.id === password);
      if (found) {
        setLoggedSupplier(found);
        setAuthMode('SUPPLIER');
        setActiveTab('STATS');
      } else {
        alert('CÓDIGO DE ACCESO INVÁLIDO');
      }
    }
    setPassword('');
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('1') ? cleanPhone : `1${cleanPhone}`;
    const msg = `Saludos ${name}, le escribo desde el Panel de Gestión de Salón RD Pro.`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const toggleProductPublish = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p);
    onUpdateProducts(updated);
  };

  const myOrders = useMemo(() => {
    if (authMode === 'MASTER') return orders;
    return orders.filter(o => o.items.some(i => i.supplierId === loggedSupplier?.id));
  }, [orders, authMode, loggedSupplier]);

  const stats = useMemo(() => {
    if (authMode === 'SUPPLIER' && loggedSupplier) {
      const totalEarned = myOrders.reduce((acc, o) => {
        const myItems = o.items.filter(i => i.supplierId === loggedSupplier.id);
        return acc + myItems.reduce((s, it) => s + (it.basePrice * it.quantity), 0);
      }, 0);
      return { earnings: totalEarned, products: products.filter(p => p.supplierId === loggedSupplier.id).length, sales: myOrders.length };
    }
    return { 
      total: orders.reduce((a, b) => a + b.total, 0),
      appProfit: orders.reduce((a, b) => a + (b.platformEarning || 0), 0),
      salons: registrations.length,
      sups: suppliers.length
    };
  }, [myOrders, products, authMode, loggedSupplier, registrations, suppliers, orders]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.businessName.toLowerCase().includes(search.toLowerCase()) || 
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.representative.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const filteredProducts = useMemo(() => {
    const list = authMode === 'SUPPLIER' ? products.filter(p => p.supplierId === loggedSupplier?.id) : products;
    return list.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search, authMode, loggedSupplier]);

  const groupedSalons = useMemo(() => {
    const filtered = registrations.filter(r => 
      r.salonName.toLowerCase().includes(search.toLowerCase()) || 
      r.city.toLowerCase().includes(search.toLowerCase())
    );

    const groups: { [key: string]: RegistrationRecord[] } = {};
    filtered.forEach(s => {
      let region = "Otros Sectores";
      if (s.city.includes("Piantini") || s.city.includes("Naco") || s.city.includes("Evaristo") || s.city.includes("Gazcue") || s.city.includes("SD Centro")) region = "Distrito Nacional (Centro)";
      else if (s.city.includes("Bella Vista") || s.city.includes("Sur") || s.city.includes("Oeste")) region = "Santo Domingo (Sur/Oeste)";
      else if (s.city.includes("Santiago") || s.city.includes("Puerto Plata") || s.city.includes("San Francisco") || s.city.includes("Moca")) region = "Cibao / Región Norte";
      else if (s.city.includes("Punta Cana") || s.city.includes("Bávaro") || s.city.includes("Romana") || s.city.includes("Este")) region = "Zona Este (Turística)";
      
      if (!groups[region]) groups[region] = [];
      groups[region].push(s);
    });
    return groups;
  }, [registrations, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[4000] flex flex-col bg-[#FFFBFA] overflow-hidden">
      <div className="bg-rose-900 text-white p-6 flex items-center justify-between shadow-2xl pt-safe shrink-0">
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 ${authMode === 'SUPPLIER' ? 'bg-indigo-600' : 'bg-rose-600'} rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-white/20 rotate-3`}>
             {authMode === 'SUPPLIER' ? 'S' : 'M'}
           </div>
           <div>
            <h2 className="font-brand font-black text-xl uppercase tracking-tighter leading-none mb-1">
              {authMode === 'SUPPLIER' ? 'Panel Suplidor' : authMode === 'MASTER' ? 'Centro de Mando' : 'Acceso Pro'}
            </h2>
            <p className="text-[9px] font-black uppercase text-rose-300">
              {loggedSupplier ? `${loggedSupplier.businessName}` : 'GESTIÓN B2B RD'}
            </p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           {authMode !== 'NONE' && <button onClick={() => setAuthMode('NONE')} className="p-3 bg-white/10 rounded-xl hover:bg-white/20"><LogOut className="w-4 h-4" /></button>}
           <button onClick={onClose} className="p-3 bg-white/10 rounded-xl hover:bg-white/20"><X className="w-5 h-5" /></button>
        </div>
      </div>

      {authMode === 'NONE' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-rose-50/20">
           <form onSubmit={handleLogin} className="w-full max-w-xs space-y-8 text-center">
              <div className="inline-flex p-10 bg-rose-900 text-white rounded-[3rem] shadow-2xl border-4 border-white rotate-6"><Lock className="w-12 h-12" /></div>
              <div className="space-y-2">
                <h3 className="text-3xl font-brand font-bold text-gray-900">Seguridad</h3>
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Ingrese su PIN Maestro o Código Suplidor</p>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••" className="w-full bg-white border-4 border-rose-100 rounded-[2.5rem] py-8 text-center text-4xl font-black outline-none focus:border-rose-300 transition-colors" autoFocus />
              <button type="submit" className="w-full bg-rose-gradient text-white py-6 rounded-full font-black uppercase text-xs tracking-widest shadow-xl">Acceder al Sistema</button>
           </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
           <div className="bg-white border-b px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar shadow-sm shrink-0">
              <button onClick={() => setActiveTab('STATS')} className={`shrink-0 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest ${activeTab === 'STATS' ? 'bg-rose-900 text-white' : 'bg-gray-50 text-gray-400'}`}>Métricas</button>
              <button onClick={() => setActiveTab('PRODUCTS')} className={`shrink-0 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest ${activeTab === 'PRODUCTS' ? 'bg-rose-900 text-white' : 'bg-gray-50 text-gray-400'}`}>Inventario</button>
              <button onClick={() => setActiveTab('ORDERS')} className={`shrink-0 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest ${activeTab === 'ORDERS' ? 'bg-rose-900 text-white' : 'bg-gray-50 text-gray-400'}`}>Facturación</button>
              {authMode === 'MASTER' && (
                <>
                  <button onClick={() => { setActiveTab('SUPPLIERS'); setSearch(''); }} className={`shrink-0 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest ${activeTab === 'SUPPLIERS' ? 'bg-rose-900 text-white' : 'bg-gray-50 text-gray-400'}`}>50 Suplidores</button>
                  <button onClick={() => { setActiveTab('SALONS'); setSearch(''); }} className={`shrink-0 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest ${activeTab === 'SALONS' ? 'bg-rose-900 text-white' : 'bg-gray-50 text-gray-400'}`}>600 Salones</button>
                </>
              )}
           </div>

           <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 no-scrollbar space-y-6 pb-40">
              {/* BUSCADOR PARA TABLAS */}
              {activeTab !== 'STATS' && (
                <div className="relative mb-8">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-200" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por nombre, marca o ciudad..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border-none rounded-[2rem] py-6 pl-16 pr-8 text-sm font-bold shadow-xl shadow-rose-900/5 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                  />
                </div>
              )}

              {activeTab === 'STATS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-rose-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
                      <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                      <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Volumen Neto</p>
                      <p className="text-5xl font-black mb-6">RD${stats.total.toLocaleString()}</p>
                      <div className="flex gap-4">
                        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
                           <p className="text-[8px] font-black uppercase opacity-60 mb-1">Profit App</p>
                           <p className="text-lg font-black text-rose-300">RD${stats.appProfit.toLocaleString()}</p>
                        </div>
                      </div>
                   </div>
                   <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-rose-50 flex flex-col justify-center">
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <div className="w-12 h-12 bg-rose-50 text-rose-900 rounded-2xl flex items-center justify-center"><Building2 className="w-6 h-6" /></div>
                            <p className="text-3xl font-black text-gray-900">{stats.salons}</p>
                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Salones Red</p>
                         </div>
                         <div className="space-y-2">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-900 rounded-2xl flex items-center justify-center"><BadgeCheck className="w-6 h-6" /></div>
                            <p className="text-3xl font-black text-gray-900">{stats.sups}</p>
                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Suplidores RD</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'PRODUCTS' && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
                   {filteredProducts.map(p => (
                     <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-rose-50 flex items-center justify-between gap-6 shadow-sm group">
                        <div className="flex items-center gap-4 flex-1">
                           <img src={p.images[0]} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                           <div className="min-w-0">
                              <h4 className="font-bold text-sm uppercase text-gray-900 line-clamp-1">{p.name}</h4>
                              <p className="text-[9px] font-black text-rose-300 uppercase">{p.brand} • {p.category}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8 text-right shrink-0">
                           <div>
                              <p className="text-[8px] font-black text-gray-300 uppercase">Stock</p>
                              <p className={`text-sm font-black ${p.stock < 20 ? 'text-rose-600' : 'text-gray-900'}`}>{p.stock}</p>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                              <p className="text-[8px] font-black text-gray-300 uppercase">Visibilidad</p>
                              <button 
                                onClick={() => toggleProductPublish(p.id)}
                                className={`w-10 h-6 rounded-full relative transition-colors ${p.isPublished ? 'bg-emerald-500' : 'bg-gray-200'}`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${p.isPublished ? 'left-5' : 'left-1'}`} />
                              </button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {activeTab === 'SUPPLIERS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5">
                   {filteredSuppliers.map(s => (
                     <div key={s.id} className="bg-white p-8 rounded-[3rem] border border-rose-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BadgeCheck className="w-20 h-20" /></div>
                        <div className="flex items-center gap-5 mb-6">
                           <div className="w-16 h-16 bg-rose-900 text-white rounded-[1.8rem] flex items-center justify-center font-brand text-2xl font-bold italic rotate-3">{s.businessName.charAt(0)}</div>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase">ID: {s.id}</span>
                                <span className="text-[8px] font-black text-rose-300 uppercase truncate">{s.location}</span>
                              </div>
                              <h4 className="font-bold text-lg uppercase text-gray-900 line-clamp-1">{s.businessName}</h4>
                           </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-rose-50">
                           <div className="flex justify-between items-center">
                              <p className="text-[9px] font-black text-gray-400 uppercase">Representante</p>
                              <p className="text-xs font-bold text-gray-900">{s.representative}</p>
                           </div>
                           <div className="flex gap-2 mt-4">
                              <button onClick={() => openWhatsApp(s.phone, s.businessName)} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-100">
                                 <MessageSquare className="w-4 h-4" />
                                 <span className="text-[9px] font-black uppercase">WhatsApp</span>
                              </button>
                              <a href={`tel:${s.phone}`} className="p-4 bg-white text-rose-900 border border-rose-100 rounded-2xl hover:bg-rose-50 active:scale-95 transition-all">
                                 <Phone className="w-4 h-4" />
                              </a>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {activeTab === 'SALONS' && (
                <div className="space-y-12">
                   {(Object.entries(groupedSalons) as [string, RegistrationRecord[]][]).map(([region, salonList]) => (
                     <div key={region} className="space-y-6">
                        <div className="flex items-center gap-4 pl-4 sticky top-0 bg-gray-50/90 backdrop-blur-md py-4 z-10">
                           <div className="p-2 bg-rose-900 text-white rounded-xl"><MapPin className="w-4 h-4" /></div>
                           <h3 className="text-[11px] font-black uppercase text-rose-900 tracking-[0.3em]">{region}</h3>
                           <div className="flex-1 h-[1px] bg-rose-200/50"></div>
                           <span className="text-[10px] font-bold text-rose-300">{salonList.length} Salones</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {salonList.map(s => (
                            <div key={s.id} className="bg-white p-6 rounded-[2.8rem] border border-rose-50 flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-rose-50 text-rose-900 rounded-2xl flex items-center justify-center font-brand text-lg font-bold group-hover:bg-rose-900 group-hover:text-white transition-all">
                                      {s.salonName.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-[8px] font-black text-rose-300 uppercase tracking-tighter mb-0.5">{s.city}</p>
                                      <h4 className="font-bold text-sm uppercase text-gray-900 leading-none mb-1 line-clamp-1">{s.salonName}</h4>
                                      <div className="flex items-center gap-1.5 opacity-40">
                                         <UserCheck className="w-3 h-3" />
                                         <span className="text-[9px] font-bold">{s.name}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button onClick={() => openWhatsApp(s.phone, s.salonName)} className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100">
                                     <MessageSquare className="w-4 h-4" />
                                   </button>
                                   <a href={`tel:${s.phone}`} className="p-3 bg-white text-rose-900 border border-rose-100 rounded-xl hover:bg-rose-50 transition-all">
                                     <Phone className="w-4 h-4" />
                                   </a>
                                </div>
                            </div>
                          ))}
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {activeTab === 'ORDERS' && (
                <div className="space-y-4">
                   {myOrders.length === 0 ? (
                     <div className="py-40 text-center opacity-20">
                        <FileText className="w-20 h-20 mx-auto mb-4" />
                        <p className="font-black uppercase text-xs tracking-widest">Sin facturación reciente</p>
                     </div>
                   ) : (
                     myOrders.map(o => (
                       <div key={o.id} className="bg-white p-8 rounded-[3rem] border border-rose-50 shadow-sm flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-rose-50 text-rose-900 rounded-2xl flex items-center justify-center"><Receipt className="w-6 h-6" /></div>
                             <div>
                                <p className="text-[9px] font-black text-rose-300 uppercase mb-1">{o.invoiceNumber}</p>
                                <h4 className="font-bold text-gray-900 uppercase">{o.stylist.salonName}</h4>
                                <p className="text-[10px] font-bold text-gray-400">{new Date(o.timestamp).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className="text-right space-y-2">
                             <p className="text-xl font-black text-gray-900">RD${o.total.toLocaleString()}</p>
                             <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase">PROCESADO</span>
                          </div>
                       </div>
                     ))
                   )}
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
