
import React, { useState, useMemo, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import RegistrationModal from './components/RegistrationModal';
import { MOCK_PRODUCTS, CATEGORIES_CONFIG } from './constants';
import { Product, CartItem, Order, RegistrationRecord, StylistProfile } from './types';
// Fixed: Added X to the imports from lucide-react
import { Home, ShoppingBag, LayoutDashboard, ArrowLeft, Plus, Minus, Tag, Info, Sparkles, Star, ChevronRight, CheckCircle2, ShieldCheck, Beaker, Zap, Eye, UserCircle2, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [stylist, setStylist] = useState<StylistProfile | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'info' | 'success' | 'warning'} | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('salon_rd_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    
    const savedOrders = localStorage.getItem('salon_rd_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedRegs = localStorage.getItem('salon_rd_registrations');
    if (savedRegs) setRegistrations(JSON.parse(savedRegs));
    
    const savedProfile = localStorage.getItem('salon_rd_stylist_profile');
    if (savedProfile) setStylist(JSON.parse(savedProfile));
  }, []);

  const showNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification("Añadido a la Bolsa Pro", "success");
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const handleCheckout = (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    localStorage.setItem('salon_rd_orders', JSON.stringify(newOrders));
    
    const updatedProducts = products.map(p => {
      const cartItem = order.items.find(item => item.id === p.id);
      if (cartItem) return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('salon_rd_products', JSON.stringify(updatedProducts));

    setCart([]);
    showNotification("Orden Sincronizada con el Almacén", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem('salon_rd_stylist_profile');
    setStylist(null);
    showNotification("Sesión Pro Finalizada", "info");
  };

  const currentUnitPrice = selectedProduct 
    ? (selectedQty >= selectedProduct.bulkThreshold ? selectedProduct.bulkPrice : selectedProduct.price) 
    : 0;

  const isBulkActive = selectedProduct ? selectedQty >= selectedProduct.bulkThreshold : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F9]">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[3000] w-auto">
           <div className="flex items-center gap-3 px-8 py-4 rounded-[2rem] shadow-2xl animate-slide-up bg-rose-900 text-white border border-white/10 backdrop-blur-lg">
              <Sparkles className="w-4 h-4 text-rose-300 animate-pulse" />
              <p className="text-[11px] font-black uppercase tracking-[0.2em]">{toast.message}</p>
           </div>
        </div>
      )}

      <TopHeader 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onSearch={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-4 pb-32 space-y-8">
        <section className="relative h-[30vh] sm:h-[40vh] rounded-[3.5rem] overflow-hidden bg-rose-100 shadow-soft border-4 border-white">
          <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-rose-900/10 to-transparent p-6 sm:p-12 flex flex-col justify-end">
             <div className="max-w-xl space-y-2 animate-in slide-in-from-left-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                   <ShieldCheck className="w-3 h-3 text-rose-300" />
                   <span className="text-[8px] font-black uppercase tracking-[0.2em]">Salón RD Pro Official</span>
                </div>
                <h2 className="font-brand text-4xl sm:text-7xl font-bold text-white leading-[1.1]">Suministros <span className="text-rose-300">Maestros.</span></h2>
                {stylist && (
                  <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest bg-white/10 backdrop-blur-sm self-start px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <UserCircle2 className="w-3 h-3" /> Bienvenido, {stylist.salonName}
                  </p>
                )}
             </div>
          </div>
        </section>

        <section className="sticky top-[80px] z-30 -mx-4 px-4 bg-[#FFF9F9]/50 backdrop-blur-md py-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <button 
              onClick={() => setActiveCategory('All')} 
              className={`flex-shrink-0 px-8 py-4 rounded-[2.2rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === 'All' ? 'bg-rose-900 text-white shadow-xl scale-105' : 'bg-white text-rose-300 border border-rose-50'}`}
            >
              Todos
            </button>
            {CATEGORIES_CONFIG.map((cat) => (
              <button 
                key={cat.name} 
                onClick={() => setActiveCategory(cat.name)} 
                className={`flex-shrink-0 px-8 py-4 rounded-[2.2rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeCategory === cat.name ? 'bg-rose-gradient text-white shadow-xl scale-105' : 'bg-white text-rose-300 border border-rose-50'}`}
              >
                <span className="opacity-70">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={(p) => addToCart(p, 1)} 
              onViewDetail={(p) => { setSelectedProduct(p); setActiveImageIdx(0); setSelectedQty(1); }} 
            />
          ))}
        </section>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-white animate-slide-up sm:max-w-2xl sm:mx-auto sm:my-[2vh] sm:rounded-[4rem] sm:shadow-2xl overflow-hidden border-x sm:border-4 border-white">
          <div className="p-6 flex items-center justify-between border-b pt-safe bg-white sticky top-0 z-10">
            <button onClick={() => setSelectedProduct(null)} className="p-4 bg-rose-50 text-rose-600 rounded-[1.2rem] active-scale transition-colors hover:bg-rose-100"><ArrowLeft className="w-5 h-5" /></button>
            <div className="text-center">
              <span className="font-black text-[9px] uppercase tracking-[0.3em] text-rose-900">Vista Profesional</span>
              <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">#{selectedProduct.id}</p>
            </div>
            <button onClick={() => { setSelectedProduct(null); setIsCartOpen(true); }} className="p-4 bg-rose-50 text-rose-600 rounded-[1.2rem] relative active-scale">
               <ShoppingBag className="w-5 h-5" />
               {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-900 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FFFBFA]">
            <div className="p-6 sm:p-10 space-y-6">
              <img 
                src={selectedProduct.images[activeImageIdx]} 
                className="w-full aspect-square object-cover rounded-[3.5rem] shadow-2xl border-4 border-white" 
                alt={selectedProduct.name} 
              />
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {selectedProduct.images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImageIdx(idx)} className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIdx === idx ? 'border-rose-600 scale-110' : 'border-transparent opacity-60'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-brand text-gray-900 font-bold">{selectedProduct.name}</h2>
                <div className="flex gap-2">
                  <span className="bg-rose-900 text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{selectedProduct.brand}</span>
                  <span className="bg-white border border-rose-100 text-rose-400 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{selectedProduct.category}</span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-10 pb-10 space-y-6">
               <div className="bg-white p-8 rounded-[3rem] shadow-soft border border-rose-50 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-rose-200 uppercase tracking-widest">Inversión Unitaria</p>
                      <span className={`text-4xl font-black ${isBulkActive ? 'text-emerald-500' : 'text-rose-900'}`}>RD${currentUnitPrice.toLocaleString()}</span>
                    </div>
                    {isBulkActive && <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-[9px] font-black uppercase">Tarifa Mayorista</span>}
                  </div>
                  <div className="flex items-center justify-between bg-rose-50/50 p-4 rounded-[2.5rem]">
                    <button onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))} className="w-16 h-16 bg-white border border-rose-100 rounded-[1.8rem] flex items-center justify-center active-scale"><Minus className="w-6 h-6 text-rose-900" /></button>
                    <span className="text-5xl font-black text-gray-900">{selectedQty}</span>
                    <button onClick={() => setSelectedQty(selectedQty + 1)} className="w-16 h-16 bg-rose-900 text-white rounded-[1.8rem] flex items-center justify-center active-scale shadow-xl"><Plus className="w-6 h-6" /></button>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-8 border-t bg-white sticky bottom-0 flex justify-between items-center gap-6 shadow-2xl rounded-t-[4rem]">
             <div>
                <span className="text-[10px] font-black uppercase text-rose-200 block tracking-widest">Total Cotización</span>
                <span className="text-4xl font-black text-gray-900">RD${(currentUnitPrice * selectedQty).toLocaleString()}</span>
             </div>
             <button 
               onClick={() => { addToCart(selectedProduct, selectedQty); setSelectedProduct(null); }} 
               className="flex-1 bg-rose-gradient text-white py-6 rounded-[2rem] font-black uppercase tracking-widest active-scale shadow-xl text-[10px]"
             >
               Agregar a Bolsa
             </button>
          </div>
        </div>
      )}

      <AdminPanel 
        isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} 
        products={products} onUpdateProducts={(p) => { setProducts(p); localStorage.setItem('salon_rd_products', JSON.stringify(p)); }} 
        orders={orders} onUpdateOrders={(o) => { setOrders(o); localStorage.setItem('salon_rd_orders', JSON.stringify(o)); }} 
        registrations={registrations} onUpdateRegistrations={(r) => { setRegistrations(r); localStorage.setItem('salon_rd_registrations', JSON.stringify(r)); }}
      />

      <CartDrawer 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        items={cart} onUpdateQty={updateQty} 
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} 
        onCheckout={handleCheckout}
        onOpenRegistration={() => setIsRegModalOpen(true)} 
        stylist={stylist}
      />

      <RegistrationModal 
        isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} 
        hasItemsInCart={cart.length > 0} onCompleteOrder={() => setIsCartOpen(true)}
        onRegister={record => {
          const newRegs = [record, ...registrations];
          setRegistrations(newRegs);
          localStorage.setItem('salon_rd_registrations', JSON.stringify(newRegs));
          setStylist(record);
          localStorage.setItem('salon_rd_stylist_profile', JSON.stringify(record));
          showNotification("Perfil Pro Activado", "success");
        }} 
      />

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl border-t border-rose-50 px-10 pt-4 pb-safe flex justify-between items-center z-[100] rounded-t-[3.5rem] shadow-soft">
        <button onClick={() => {setActiveCategory('All'); window.scrollTo({top: 0, behavior: 'smooth'});}} className="flex flex-col items-center gap-1 active-scale text-rose-900">
          <Home className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Inicio</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 active-scale relative text-rose-200">
          <ShoppingBag className="w-5 h-5" />
          {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-rose-900 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-black text-white border-2 border-white">{cart.length}</span>}
          <span className="text-[8px] font-black uppercase tracking-widest">Bolsa</span>
        </button>
        <button onClick={() => setIsAdminOpen(true)} className="w-16 h-16 bg-rose-900 text-white rounded-[2.2rem] flex items-center justify-center shadow-2xl -mt-12 border-[6px] border-[#FFF9F9] active-scale">
          <LayoutDashboard className="w-7 h-7" />
        </button>
        <button onClick={() => setIsRegModalOpen(true)} className={`flex flex-col items-center gap-1 active-scale ${stylist ? 'text-rose-900' : 'text-rose-200'}`}>
          <Tag className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">{stylist ? 'Perfil' : 'Pro'}</span>
        </button>
        <button onClick={stylist ? handleLogout : () => setIsRegModalOpen(true)} className="flex flex-col items-center gap-1 text-rose-200 active-scale">
          {stylist ? <X className="w-5 h-5 text-gray-400" /> : <Star className="w-5 h-5" />}
          <span className="text-[8px] font-black uppercase tracking-widest">{stylist ? 'Salir' : 'Club'}</span>
        </button>
      </nav>

      <AIAssistant />
    </div>
  );
};

export default App;
