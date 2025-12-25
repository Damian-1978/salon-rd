
import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, AlertCircle, UserPlus, CreditCard, Landmark, Banknote, CheckCircle2, Sparkles, Receipt, ShieldCheck, ChevronRight, ArrowLeft, Star } from 'lucide-react';
import { CartItem, StylistProfile, Order, PaymentMethod } from '../types';

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

const MINIMUM_PURCHASE = 2000;
const WHATSAPP_ADMIN = "8492752807";

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQty, onRemove, onCheckout, onOpenRegistration, stylist }) => {
  const [view, setView] = useState<'ITEMS' | 'PAYMENT' | 'CONFIRMATION'>('ITEMS');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen && view === 'CONFIRMATION' && items.length > 0) {
      setView('ITEMS');
    }
  }, [isOpen]);

  const subtotal = items.reduce((acc, item) => (item.quantity >= item.bulkThreshold ? item.bulkPrice : item.price) * item.quantity + acc, 0);
  const isMinMet = subtotal >= MINIMUM_PURCHASE;

  const goToPayment = () => {
    if (!stylist) return onOpenRegistration();
    if (!isMinMet) return;
    setView('PAYMENT');
  };

  const finalizeOrder = () => {
    if (!stylist) return;

    const order: Order = {
      id: `RD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      stylist,
      items: [...items],
      subtotal,
      savings: 0,
      type: 'ORDER',
      status: 'PENDING',
      paymentMethod,
      paymentStatus: 'PENDING',
      timestamp: Date.now()
    };

    onCheckout(order);
    setLastOrder(order);
    
    const lines = items.map(i => `• ${i.name} [x${i.quantity}] - RD$${((i.quantity >= i.bulkThreshold ? i.bulkPrice : i.price) * i.quantity).toLocaleString()}`).join('\n');
    const msg = `*PEDIDO SALÓN RD*\n\nID: ${order.id}\nSalón: ${stylist.salonName}\n\n*PRODUCTOS:*\n${lines}\n\n*TOTAL:* RD$${subtotal.toLocaleString()}\n*PAGO:* ${paymentMethod === 'CASH' ? 'PAGO CONTRA ENTREGA' : 'TRANSFERENCIA'}\n\n_Aguardo confirmación para despacho._`;
    
    window.open(`https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(msg)}`, '_blank');
    setView('CONFIRMATION');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500]">
      <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-lg flex">
        <div className="bg-white w-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 rounded-l-[4rem] sm:rounded-l-[5rem] overflow-hidden border-l-4 border-white">
          
          <div className="p-10 border-b border-rose-50 flex items-center justify-between pt-safe bg-[#FFF9F9]/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              {view === 'PAYMENT' && <button onClick={() => setView('ITEMS')} className="p-3 bg-white rounded-xl shadow-sm text-rose-600 active-scale border border-rose-50"><ArrowLeft className="w-5 h-5" /></button>}
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-rose-900 leading-none mb-1">
                  {view === 'CONFIRMATION' ? '¡Orden Enviada!' : 'Mi Bolsa Pro'}
                </h2>
                <p className="text-[9px] font-bold text-rose-300 uppercase tracking-widest">{items.length} Referencias seleccionadas</p>
              </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white rounded-2xl shadow-sm text-rose-200 active-scale border border-rose-50"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 sm:p-12 no-scrollbar bg-[#FFFBFA]">
            {view === 'CONFIRMATION' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-rose-gradient text-white rounded-[3.5rem] flex items-center justify-center shadow-2xl animate-bounce border-4 border-white"><CheckCircle2 className="w-16 h-16" /></div>
                <div className="bg-emerald-50 p-8 rounded-[3rem] border-2 border-emerald-100 shadow-xl">
                    <p className="text-[13px] font-black text-emerald-800 leading-relaxed uppercase tracking-tight italic">"Su pedido ha sido enviado exitosamente espere su entrega en 4 días y recuerde pago contra entrega a través de transferencia."</p>
                </div>
                {lastOrder && (
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-rose-50 text-left space-y-3 w-full">
                     <p className="text-[10px] font-black text-rose-300 uppercase text-center border-b border-rose-50 pb-2">Ref: {lastOrder.id}</p>
                     <p className="text-sm font-black text-gray-900 text-center uppercase tracking-widest">Inversión: RD${lastOrder.subtotal.toLocaleString()}</p>
                  </div>
                )}
                <button onClick={onClose} className="w-full bg-rose-900 text-white py-7 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl active-scale">Volver al Catálogo</button>
              </div>
            ) : view === 'PAYMENT' ? (
              <div className="space-y-10 animate-in slide-in-from-right-5">
                <div className="text-center space-y-2">
                   <h3 className="text-3xl font-brand font-bold text-gray-900">Pasarela B2B</h3>
                   <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-1.5 rounded-full text-rose-600 border border-rose-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Verificado por Salón RD</span>
                   </div>
                </div>
                <div className="space-y-4">
                  <button onClick={() => setPaymentMethod('CASH')} className={`w-full p-8 rounded-[3rem] border-4 flex items-center gap-6 transition-all ${paymentMethod === 'CASH' ? 'border-rose-900 bg-rose-900 text-white shadow-2xl scale-[1.02]' : 'border-rose-50 bg-white text-rose-200 shadow-sm'}`}>
                    <Banknote className="w-10 h-10" />
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-widest">Contra Entrega</p>
                      <p className="text-[9px] opacity-70 font-medium tracking-widest mt-0.5">Transferencia al recibir su pedido</p>
                    </div>
                  </button>
                  <button onClick={() => setPaymentMethod('TRANSFER')} className={`w-full p-8 rounded-[3rem] border-4 flex items-center gap-6 transition-all ${paymentMethod === 'TRANSFER' ? 'border-rose-900 bg-rose-900 text-white shadow-2xl scale-[1.02]' : 'border-rose-50 bg-white text-rose-200 shadow-sm'}`}>
                    <Landmark className="w-10 h-10" />
                    <div className="text-left">
                      <p className="font-black text-xs uppercase tracking-widest">Transferencia Previa</p>
                      <p className="text-[9px] opacity-70 font-medium tracking-widest mt-0.5">Banco Popular / Banreservas</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {!stylist && items.length > 0 && (
                  <div className="bg-rose-900 p-8 rounded-[3.5rem] text-white shadow-2xl border-4 border-white/20 animate-in zoom-in">
                    <Star className="w-10 h-10 text-rose-300 mb-4 animate-pulse" />
                    <h4 className="font-brand text-2xl font-bold mb-2">Desbloquea Precios Pro</h4>
                    <p className="text-[10px] font-bold text-rose-100 uppercase tracking-widest mb-6 leading-relaxed">Regístrate como salón verificado para acceder a tarifas mayoristas y logística prioritaria.</p>
                    <button onClick={onOpenRegistration} className="w-full bg-white text-rose-900 py-5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest active-scale flex items-center justify-center gap-3">
                      <UserPlus className="w-5 h-5" /> Registro de Salón
                    </button>
                  </div>
                )}

                {!isMinMet && items.length > 0 && stylist && (
                  <div className="bg-rose-50 p-6 rounded-[2.5rem] flex items-center gap-5 border border-rose-100 shadow-inner animate-pulse">
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                    <div>
                       <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Pedido Mínimo Pro</p>
                       <p className="text-lg font-black text-rose-900 leading-tight">Faltan RD${(MINIMUM_PURCHASE - subtotal).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                
                {items.length === 0 ? (
                  <div className="py-40 text-center opacity-10 flex flex-col items-center gap-8">
                    <ShoppingBag className="w-20 h-20" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">Sin productos en bolsa</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 p-5 bg-white rounded-[2.5rem] items-center border border-rose-50 shadow-soft">
                        <img src={item.images[0]} className="w-16 h-16 rounded-[1.2rem] object-cover shadow-md" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[11px] uppercase truncate text-gray-900 mb-0.5">{item.name}</h4>
                          <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3 bg-rose-50/50 p-1 rounded-xl">
                              <button onClick={() => onUpdateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white text-rose-900 rounded-lg shadow-sm active-scale"><Minus className="w-3 h-3" /></button>
                              <span className="text-xs font-black w-4 text-center text-rose-900">{item.quantity}</span>
                              <button onClick={() => onUpdateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-rose-900 text-white rounded-lg shadow-md active-scale"><Plus className="w-3 h-3" /></button>
                            </div>
                            <p className="text-sm font-black text-gray-900">RD${((item.quantity >= item.bulkThreshold ? item.bulkPrice : item.price) * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="p-2 text-rose-100 hover:text-rose-600 transition-colors active-scale"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {(view === 'ITEMS' || view === 'PAYMENT') && items.length > 0 && (
            <div className="p-10 border-t border-rose-50 bg-white pb-safe shadow-[0_-30px_90px_rgba(225,29,72,0.15)] rounded-t-[5rem]">
              <div className="flex justify-between items-end px-2 mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-rose-200 tracking-widest">Inversión Total</span>
                  <span className="text-4xl font-black text-gray-900 leading-none">RD${subtotal.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="bg-rose-50 text-rose-900 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border border-rose-100">B2B Verified</span>
                </div>
              </div>
              <button 
                onClick={view === 'PAYMENT' ? finalizeOrder : goToPayment} 
                disabled={!isMinMet && !!stylist} 
                className={`w-full py-7 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all ${(!isMinMet && stylist) ? 'bg-rose-50 text-rose-200 cursor-not-allowed' : 'bg-rose-gradient text-white active-scale hover:scale-[1.01]'}`}
              >
                {!stylist ? <><UserPlus className="w-6 h-6" /> Registro de Salón</> : view === 'PAYMENT' ? <>Finalizar Pedido <ChevronRight className="w-5 h-5" /></> : <>Elegir Método de Pago <Send className="w-6 h-6" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
