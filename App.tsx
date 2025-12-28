
import React, { useState, useMemo, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import RegistrationModal from './components/RegistrationModal';
import ProductDetailModal from './components/ProductDetailModal';
import { MOCK_PRODUCTS, CATEGORIES_CONFIG, MOCK_SUPPLIERS, MOCK_REGISTRATIONS, POINTS_PER_PESO } from './constants';
import { Product, CartItem, Order, RegistrationRecord, StylistProfile, Supplier } from './types';
import { Home, ShoppingBag, LayoutDashboard, Star, ShieldCheck, UserCircle2, Tag, Sparkles, Trophy, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados con carga inicial desde LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('srd_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('srd_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    const saved = localStorage.getItem('srd_regs');
    return saved ? JSON.parse(saved) : MOCK_REGISTRATIONS;
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('srd_sups');
    return saved ? JSON.parse(saved) : MOCK_SUPPLIERS;
  });
  const [stylist, setStylist] = useState<StylistProfile | null>(() => {
    const saved = localStorage.getItem('srd_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'info' | 'success'} | null>(null);

  // Handlers de actualización con persistencia
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('srd_products', JSON.stringify(newProducts));
  };

  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('srd_orders', JSON.stringify(newOrders));
  };

  const updateRegistrations = (newRegs: RegistrationRecord[]) => {
    setRegistrations(newRegs);
    localStorage.setItem('srd_regs', JSON.stringify(newRegs));
  };

  const updateSuppliers = (newSups: Supplier[]) => {
    setSuppliers(newSups);
    localStorage.setItem('srd_sups', JSON.stringify(newSups));
  };

  const updateStylist = (profile: StylistProfile) => {
    setStylist(profile);
    localStorage.setItem('srd_profile', JSON.stringify(profile));
  };

  const totalPoints = useMemo(() => {
    return Math.floor(orders.reduce((acc, o) => acc + (o.total * POINTS_PER_PESO), 0));
  }, [orders]);

  const showToast = (message: string, type: 'info' | 'success' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const supplier = suppliers.find(s => s.id === p.supplierId);
      if (!p.isPublished || !supplier?.isAuthorized) return false;
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products, suppliers]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast("Añadido a la Bolsa Pro", "success");
  };

  const handleCheckout = (order: Order) => {
    const updatedOrders = [order, ...orders];
    updateOrders(updatedOrders);
    
    const updatedProducts = products.map(p => {
      const item = order.items.find(i => i.id === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p;
    });
    updateProducts(updatedProducts);
    setCart([]);
    showToast(`Pedido Enviado. Ganaste ${Math.floor(order.total * POINTS_PER_PESO)} Puntos.`, "success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F9]">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] animate-slide-up">
           <div className="bg-rose-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-rose-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
           </div>
        </div>
      )}

      <TopHeader onOpenCart={() => setIsCartOpen(true)} cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onSearch={setSearchQuery} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-4 pb-48 space-y-12">
        {/* Hero Section */}
        <section className="relative h-[40vh] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white group">
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-950/20 to-transparent p-10 flex flex-col justify-end">
             <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Club de Fidelidad Salón RD</span>
                </div>
                <h2 className="font-brand text-4xl sm:text-6xl font-bold text-white leading-tight">Elite Beauty <br/><span className="text-rose-300 italic">Marketplace RD</span>.</h2>
                <div className="flex gap-4">
                   {stylist ? (
                     <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-white border border-white/10">
                       <Sparkles className="w-5 h-5 text-amber-300" />
                       <span className="text-xs font-black uppercase tracking-widest">{totalPoints} Puntos Salón</span>
                     </div>
                   ) : (
                     <button onClick={() => setIsRegModalOpen(true)} className="bg-white text-rose-900 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Registrar Mi Salón</button>
                   )}
                </div>
             </div>
          </div>
        </section>

        {/* Suplidores Destacados */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase text-gray-900 tracking-[0.2em] flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-rose-500" /> Suplidores Oficiales
              </h3>
              <button onClick={() => setIsAdminOpen(true)} className="text-[9px] font-black uppercase text-rose-400 border-b border-rose-100">Ver Todos</button>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
              {suppliers.slice(0, 8).map(sup => (
                <div key={sup.id} className="shrink-0 w-64 bg-white p-6 rounded-[2.5rem] border border-rose-50 shadow-sm flex items-center gap-4 transition-all hover:scale-105">
                   <div className="w-12 h-12 bg-rose-50 text-rose-900 rounded-xl flex items-center justify-center font-brand font-bold text-xl">{sup.businessName.charAt(0)}</div>
                   <div>
                      <h4 className="font-bold text-[11px] uppercase text-gray-900 line-clamp-1">{sup.businessName}</h4>
                      <p className="text-[9px] font-bold text-rose-300 uppercase">{sup.location}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Categorías */}
        <section className="sticky top-[80px] z-30 -mx-4 px-4 bg-[#FFF9F9]/95 backdrop-blur-xl py-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-rose-50">
           <button onClick={() => setActiveCategory('All')} className={`shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'All' ? 'bg-rose-900 text-white shadow-xl scale-105' : 'bg-white border border-rose-100 text-rose-300'}`}>Todos</button>
           {CATEGORIES_CONFIG.map(cat => (
             <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeCategory === cat.name ? 'bg-rose-900 text-white shadow-xl scale-105' : 'bg-white border border-rose-100 text-rose-300'}`}>
                {cat.icon}
                {cat.name}
             </button>
           ))}
        </section>

        {/* Catálogo Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} onViewDetail={(product) => setSelectedProduct(product)} />
          ))}
        </section>
      </main>

      <ProductDetailModal product={selectedProduct} supplier={suppliers.find(s => s.id === selectedProduct?.supplierId) || null} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        products={products} 
        onUpdateProducts={updateProducts} 
        orders={orders} 
        onUpdateOrders={updateOrders} 
        registrations={registrations} 
        onUpdateRegistrations={updateRegistrations} 
        suppliers={suppliers} 
        onUpdateSuppliers={updateSuppliers} 
      />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={handleCheckout} onOpenRegistration={() => setIsRegModalOpen(true)} stylist={stylist} />
      <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} onRegister={updateStylist} hasItemsInCart={cart.length > 0} onCompleteOrder={() => setIsCartOpen(true)} />
      <AIAssistant />

      {/* Nav Inferior Elite */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-rose-50 px-10 pt-4 pb-safe flex justify-between items-center z-50 rounded-t-[4rem] shadow-[0_-30px_60px_rgba(0,0,0,0.08)]">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex flex-col items-center gap-1.5 text-rose-900">
          <Home className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Catálogo</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1.5 text-rose-300 relative">
          <ShoppingBag className="w-5 h-5" />
          {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-rose-900 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
          <span className="text-[8px] font-black uppercase tracking-widest">Bolsa</span>
        </button>
        <button onClick={() => setIsAdminOpen(true)} className="w-16 h-16 bg-rose-900 text-white rounded-[2rem] flex items-center justify-center -mt-16 shadow-2xl border-[6px] border-[#FFF9F9] transition-all hover:scale-110 active:rotate-12">
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setIsRegModalOpen(true)} className="flex flex-col items-center gap-1.5 text-rose-300">
          <UserCircle2 className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Mi Salón</span>
        </button>
        <div className="flex flex-col items-center gap-1.5 text-amber-500">
          <Trophy className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">{totalPoints} Pts</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
