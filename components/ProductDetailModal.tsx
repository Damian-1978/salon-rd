
import React from 'react';
import { X, Phone, MessageSquare, Star, ShieldAlert, CheckCircle2, Package, Truck } from 'lucide-react';
import { Product, Supplier } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  supplier: Supplier | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, supplier, onClose, onAddToCart }) => {
  if (!product) return null;

  const openWhatsApp = () => {
    if (!supplier) return;
    const msg = `Hola, soy de un salón interesado en el producto: ${product.name} (ID: ${product.id})`;
    window.open(`https://wa.me/${supplier.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-rose-950/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] overflow-hidden relative shadow-2xl animate-in zoom-in duration-500 flex flex-col sm:flex-row border-8 border-white">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-3 bg-white/90 backdrop-blur-sm text-rose-900 rounded-2xl shadow-lg active:scale-90 transition-transform">
          <X className="w-6 h-6" />
        </button>

        {/* Image Section */}
        <div className="w-full sm:w-1/2 h-64 sm:h-auto relative bg-rose-50">
          <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/30">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Precio Profesional</p>
            <p className="text-4xl font-black text-white">RD${product.bulkPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full sm:w-1/2 overflow-y-auto p-8 sm:p-12 no-scrollbar space-y-8 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{product.category}</span>
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                <Star className="w-3 h-3 text-amber-500 fill-current" />
                <span className="text-[10px] font-black text-amber-700">{product.rating}</span>
              </div>
            </div>
            <h2 className="text-3xl font-brand font-bold text-gray-900 uppercase leading-tight mb-2">{product.name}</h2>
            <p className="text-sm font-black text-rose-400 uppercase tracking-widest">{product.brand}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Descripción Técnica</h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-rose-50 p-5 rounded-[2rem] border border-rose-100">
                <p className="text-[9px] font-black text-rose-300 uppercase mb-2">Beneficios</p>
                <ul className="space-y-1">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="text-[10px] font-bold text-rose-900 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" /> {b}
                    </li>
                  ))}
                </ul>
             </div>
             <div className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100">
                <p className="text-[9px] font-black text-indigo-300 uppercase mb-2">Logística</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-900">Stock: {product.stock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-900">Min: {product.bulkThreshold} unidades</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Supplier Section */}
          <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Suministrado por</p>
                <p className="font-bold text-gray-900 uppercase">{supplier?.businessName || 'Cargando suplidor...'}</p>
              </div>
              <ShieldAlert className="w-6 h-6 text-gray-300" />
            </div>
            
            <div className="flex gap-3">
              <a href={`tel:${supplier?.phone}`} className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl flex items-center justify-center gap-3 text-gray-900 hover:bg-gray-100 transition-colors active:scale-95 shadow-sm">
                <Phone className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Llamar</span>
              </a>
              <button onClick={openWhatsApp} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-colors active:scale-95 shadow-lg shadow-emerald-100">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => { onAddToCart(product); onClose(); }}
            className="w-full bg-rose-gradient text-white py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
          >
            Añadir a la Bolsa Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
