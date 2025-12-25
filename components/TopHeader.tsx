
import React from 'react';
import { Search, ShoppingCart, Bell } from 'lucide-react';

interface TopHeaderProps {
  onOpenCart: () => void;
  cartCount: number;
  onSearch: (query: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onOpenCart, cartCount, onSearch }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-rose-50 px-6 py-4 pt-safe">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 text-white flex items-center justify-center rounded-[1.2rem] shadow-soft transform -rotate-3 border-2 border-white">
            <span className="font-brand text-xl font-bold">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-brand text-xl font-bold tracking-tight uppercase text-gray-900">SALÓN RD</h1>
          </div>
        </div>

        <div className="flex-1 max-w-md relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-200 w-4 h-4 group-focus-within:text-rose-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar productos para tu salón..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-rose-50/50 border border-rose-50 rounded-[1.5rem] py-3 pl-14 pr-6 text-xs font-medium focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder:text-rose-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 text-rose-200 hover:text-rose-500 active-scale rounded-2xl transition-colors relative bg-rose-50/30">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-600 border-2 border-white rounded-full"></span>
          </button>
          <button 
            onClick={onOpenCart}
            className="p-3 text-rose-200 hover:text-rose-500 active-scale rounded-2xl transition-colors relative bg-rose-50/30"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
