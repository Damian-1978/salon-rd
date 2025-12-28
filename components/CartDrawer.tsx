
import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Receipt, ArrowLeft, CheckCircle2, Share2, DollarSign, Send, MessageSquare, Truck, User, Trophy, Sparkles } from 'lucide-react';
import { CartItem, StylistProfile, Order, PaymentMethod, Supplier } from '../types';
import { PLATFORM_MARKUP, MOCK_SUPPLIERS, POINTS_PER_PESO } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: (order: Order) => void;
  onOpenRegistration: () => void;
  stylist: StylistProfile | null;
}

const MINIMUM_PURCHASE = 2500;

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQty, onRemove, onCheckout, onOpenRegistration, stylist }) => {
  const [view, setView] = useState<'ITEMS' | 'CHECKOUT' | 'SUCCESS'>('ITEMS');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('TRANSFER');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((acc, i) => acc + (i.quantity >= i.bulkThreshold ? i.bulkPrice : i.price) * i.quantity, 0);
  const total = subtotal;
  const isMinMet = subtotal >= MINIMUM_PURCHASE;
  const potentialPoints = Math.floor(total * POINTS_PER_PESO);

  const handleProcessOrder = () => {
    if (!stylist) return onOpenRegistration();
    if (!isMinMet) return;

    const order: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      invoiceNumber: `SRD-${Date.now().toString().slice(-6)}`,
      stylist,
      items: [...items],
      subtotal,
      total,
      paymentMethod: payMethod,
      paymentStatus: 'PAID',
      status: 'PENDING',
      timestamp: Date.now(),
      platformEarning: total - (total / PLATFORM_MARKUP)
    };

    onCheckout(order);
    setLastOrder(order);
    setView('SUCCESS');
  };

  const getOrderSuppliers = () => {
    if (!lastOrder) return [];
    const supplierIds = Array.from(new Set(lastOrder.items.map(i => i.supplierId)));
    return supplierIds.map(id => MOCK_SUPPLIERS.find(s => s.id === id)).filter(Boolean) as Supplier[];
  };

  const notifySupplier = (sup: Supplier) => {
    if (!lastOrder) return;
    const myItems = lastOrder.items.filter(item => item.supplierId === sup.id);
    const detail = myItems.map(i => `• ${i.name} (x${i.quantity})`).join('\n');
    const msg = `*PEDIDO PROFESIONAL - SALÓN RD*\n` +
                `--------------------------\n` +
                `*Orden:* ${lastOrder.invoiceNumber}\n` +
                `*Salón:* ${lastOrder.stylist.salonName}\n` +
                `*Contacto:* ${lastOrder.stylist.phone}\n` +
                `--------------------------\n` +
                `*Productos Solicitados:*\n${detail}\n\n` +
                `Confirmar despacho para: ${lastOrder.stylist.city}`;
    window.open(`https://wa.me/1${sup.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[4500]">
      <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-[#FFFBFA] shadow-2xl flex flex-col rounded-l-[4rem] overflow-hidden animate-in slide-in-from-right duration-500">
        
        <div className="p-10 border-b flex justify-between items-center bg-white pt-safe">
          <div>
            <h2 className="font-black text-[10px] uppercase text-rose-900 tracking-[0.4em] mb-1">{view === 'ITEMS' ? 'Mi Bolsa Pro' : 'Finalizar Pedido'}</h2>
            <p className="text-[11px] font-bold text-gray-400">Entrega Estimada: 24-48h</p>
          </div>
          <button onClick={onClose} className="p-4 bg-rose-50 rounded-2xl active:scale-90 transition-transform"><X className="w-5 h-5 text-rose-900" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {view === 'ITEMS' && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="py-40 text-center opacity-20 flex flex-col items-center">
                  <ShoppingBag className="mb-6 w-20 h-20" />
                  <p className="font-black uppercase tracking-widest text-xs">Tu bolsa está vacía</p>
                </div>
              ) : (
                <>
                  <div className="bg-rose-900 p-8 rounded-[3rem] text-white flex items-center justify-between shadow-xl mb-6">
                     <div className="flex items-center gap-4">
                        <Trophy className="w-8 h-8 text-amber-400" />
                        <div>
                           <p className="text-[9px] font-black uppercase opacity-60">Ganarás con este pedido</p>
                           <p className="text-xl font-black">{potentialPoints} Puntos Salón</p>
                        </div>
                     </div>
                     <Sparkles className="w-6 h-6 text-white/30" />
                  </div>
                  {items.map(i => (
                    <div key={i.id} className="flex gap-4 p-5 bg-white rounded-[2.5rem] border border-rose-50 shadow-sm items-center hover:shadow-md transition-all">
                      <img src={i.images[0]} className="w-14 h-14 rounded-2xl object-cover border border-rose-50" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[11px] truncate uppercase text-gray-900">{i.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-3 bg-rose-50/50 rounded-xl p-1 px-3">
                            <button onClick={() => onUpdateQty(i.id, -1)} className="text-rose-900"><Minus className="w-3 h-3"/></button>
                            <span className="text-[12px] font-black text-rose-900">{i.quantity}</span>
                            <button onClick={() => onUpdateQty(i.id, 1)} className="text-rose-900"><Plus className="w-3 h-3"/></button>
                          </div>
                          <p className="font-black text-xs text-gray-900">RD${((i.quantity >= i.bulkThreshold ? i.bulkPrice : i.price) * i.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => onRemove(i.id)} className="p-2 text-rose-100 hover:text-rose-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {view === 'CHECKOUT' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-5">
              <div className="bg-white p-8 rounded-[3rem] border border-rose-100 shadow-xl space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-300">Resumen del Despacho</h3>
                 <div className="space-y-1">
                    <p className="text-2xl font-brand font-bold text-gray-900 leading-none">{stylist?.salonName}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stylist?.city} · {stylist?.phone}</p>
                 </div>
                 <div className="pt-4 border-t border-rose-50 flex items-center gap-2 text-emerald-500">
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Entrega en {stylist?.city.includes('Santo Domingo') || stylist?.city.includes('Santiago') ? '24 HORAS' : '48 HORAS'}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Método de Pago Profesional</p>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setPayMethod('TRANSFER')} className={`p-8 rounded-[3rem] border-2 flex flex-col items-center gap-4 transition-all ${payMethod === 'TRANSFER' ? 'bg-rose-900 border-rose-900 text-white shadow-xl scale-105' : 'bg-white border-rose-50 text-gray-300'}`}>
                      <div className={`p-4 rounded-2xl ${payMethod === 'TRANSFER' ? 'bg-white/20' : 'bg-rose-50'}`}>🏛️</div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Transferencia</span>
                    </button>
                    <button onClick={() => setPayMethod('CASH')} className={`p-8 rounded-[3rem] border-2 flex flex-col items-center gap-4 transition-all ${payMethod === 'CASH' ? 'bg-rose-900 border-rose-900 text-white shadow-xl scale-105' : 'bg-white border-rose-50 text-gray-300'}`}>
                      <div className={`p-4 rounded-2xl ${payMethod === 'CASH' ? 'bg-white/20' : 'bg-rose-50'}`}>💵</div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Efectivo</span>
                    </button>
                 </div>
              </div>
            </div>
          )}

          {view === 'SUCCESS' && lastOrder && (
            <div className="h-full flex flex-col items-center text-center space-y-10 animate-in zoom-in duration-700 pb-20">
              <div className="w-24 h-24 bg-rose-gradient text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white rotate-6 scale-110">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-brand font-bold text-gray-900">¡Pedido Enviado!</h3>
                <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Su stock pro viene en camino</p>
              </div>

              <div className="w-full space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left pl-6">Notificar a Suplidores</p>
                {getOrderSuppliers().map(sup => (
                  <button key={sup.id} onClick={() => notifySupplier(sup)} className="w-full bg-white border border-emerald-50 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-emerald-200 transition-all active:scale-95 shadow-sm group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-black text-emerald-700 uppercase mb-1">Confirmar con:</p>
                        <p className="font-bold text-gray-900 text-sm truncate uppercase">{sup.businessName}</p>
                      </div>
                    </div>
                    <Send className="w-5 h-5 text-emerald-500" />
                  </button>
                ))}
              </div>

              <div className="bg-rose-900 text-white p-10 rounded-[4rem] w-full text-left shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Receipt className="w-24 h-24" /></div>
                 <p className="text-[10px] font-black uppercase opacity-60 mb-2">Total del Pedido</p>
                 <p className="text-5xl font-black mb-6">RD${lastOrder.total.toLocaleString()}</p>
                 <div className="flex items-center gap-3 text-amber-400 text-xs font-black uppercase">
                    <Trophy className="w-5 h-5" /> Acumulaste {Math.floor(lastOrder.total * POINTS_PER_PESO)} Puntos
                 </div>
              </div>

              <button onClick={onClose} className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-widest">Volver al Mercado</button>
            </div>
          )}
        </div>

        {view !== 'SUCCESS' && items.length > 0 && (
          <div className="p-10 border-t bg-white pb-safe shadow-[0_-40px_80px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-2">Total Neto RD$</p>
                <p className="text-5xl font-black text-gray-900">RD${total.toLocaleString()}</p>
              </div>
              {view === 'ITEMS' && !isMinMet && (
                <div className="bg-rose-50 text-rose-500 px-5 py-3 rounded-2xl text-[10px] font-black uppercase border border-rose-100 animate-pulse">
                   Min: RD$${MINIMUM_PURCHASE.toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              {view === 'CHECKOUT' && (
                <button onClick={() => setView('ITEMS')} className="p-8 bg-rose-50 text-rose-600 rounded-[2.5rem] active:scale-90 transition-transform">
                  <ArrowLeft className="w-8 h-8" />
                </button>
              )}
              <button 
                onClick={view === 'ITEMS' ? () => setView('CHECKOUT') : handleProcessOrder}
                className={`flex-1 py-8 rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.4em] shadow-2xl transition-all active:scale-95 ${(!isMinMet && view === 'ITEMS') ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' : 'bg-rose-gradient text-white shadow-rose-200'}`}
              >
                {!stylist ? 'Registrar Salón' : view === 'ITEMS' ? 'Siguiente Paso' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
