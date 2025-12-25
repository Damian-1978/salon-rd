
import React from 'react';
import { Product } from '../types';
import { Plus, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetail: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetail }) => {
  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-rose-50 flex flex-col h-full active-scale relative transition-all hover:shadow-[0_20px_60px_-15px_rgba(225,29,72,0.15)] hover:border-rose-100">
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer bg-rose-50/30"
        onClick={() => onViewDetail(product)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute top-4 left-4">
           <div className="bg-rose-gradient text-white px-4 py-2 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] shadow-lg border border-white/20">
              RD${product.bulkPrice.toLocaleString()}
           </div>
        </div>

        <button 
          className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-xl text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="w-4 h-4" />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(product);
          }}
          className="absolute bottom-4 right-4 w-12 h-12 bg-white text-rose-600 rounded-[1.2rem] shadow-xl flex items-center justify-center active:scale-90 border border-rose-50"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1 gap-2 cursor-pointer" onClick={() => onViewDetail(product)}>
        <h3 className="font-bold text-[13px] text-gray-900 line-clamp-1 uppercase tracking-tight group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] text-rose-300 line-clamp-2 leading-relaxed font-medium uppercase tracking-widest">
          {product.brand}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-rose-50">
          <p className="text-base font-black text-gray-900">RD${product.bulkPrice.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-rose-500 fill-current" />
            <span className="text-[10px] font-bold text-rose-500">{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
