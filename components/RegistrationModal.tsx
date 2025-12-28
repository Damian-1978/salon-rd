
import React, { useState } from 'react';
import { X, ShieldCheck, MessageCircle, Heart, CheckCircle2, ShoppingBag, Sparkles, ArrowRight, UserCircle2, MapPin } from 'lucide-react';
import { RegistrationRecord } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (record: RegistrationRecord) => void;
  hasItemsInCart: boolean;
  onCompleteOrder: () => void;
}

const CITIES = ["Santo Domingo", "Santiago", "La Romana", "Haina", "Puerto Plata", "Bávaro", "Punta Cana", "La Vega", "Moca", "Bonao", "Baní", "Azua", "San Cristóbal"];

const RegistrationModal: React.FC<RegistrationModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegister, 
  hasItemsInCart,
  onCompleteOrder 
}) => {
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [formData, setFormData] = useState({ name: '', salonName: '', phone: '', rnc: '', city: 'Santo Domingo' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: RegistrationRecord = {
      ...formData,
      id: `REG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      registeredAt: Date.now(),
      status: 'NEW'
    };
    onRegister(newRecord);
    setStep('SUCCESS');
  };

  const handleClose = () => {
    setStep('FORM');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={handleClose} />
      <div className="bg-white text-black w-full max-w-md rounded-[4rem] overflow-hidden relative shadow-2xl animate-in zoom-in duration-500 border-x-4 border-b-4 border-white">
        
        {step === 'FORM' ? (
          <>
            <div className="p-10 flex flex-col items-center text-center bg-rose-50/30">
              <button onClick={handleClose} className="absolute top-8 right-8 p-2.5 bg-white text-rose-300 rounded-xl shadow-sm"><X className="w-5 h-5" /></button>
              <div className="w-16 h-16 mb-6 rounded-2xl bg-rose-gradient text-white flex items-center justify-center shadow-lg border-2 border-white"><UserCircle2 className="w-8 h-8" /></div>
              <h2 className="text-3xl font-brand font-bold mb-2 tracking-tight text-gray-900">Acceso Salón Pro</h2>
              <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">Exclusivo para profesionales en RD.</p>
            </div>

            <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-rose-300 uppercase pl-4">Tu Nombre</label>
                <input required type="text" placeholder="Ej: Mirtha García" className="w-full bg-rose-50/30 border border-rose-50 rounded-[1.5rem] py-4 px-6 text-xs focus:ring-4 focus:ring-rose-100 outline-none font-bold transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-rose-300 uppercase pl-4">Nombre del Salón</label>
                <input required type="text" placeholder="Ej: Mirtha Beauty Center" className="w-full bg-rose-50/30 border border-rose-50 rounded-[1.5rem] py-4 px-6 text-xs focus:ring-4 focus:ring-rose-100 outline-none font-bold transition-all" value={formData.salonName} onChange={e => setFormData({...formData, salonName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-rose-300 uppercase pl-4">WhatsApp</label>
                  <input required type="tel" placeholder="809-..." className="w-full bg-rose-50/30 border border-rose-50 rounded-[1.5rem] py-4 px-6 text-xs focus:ring-4 focus:ring-rose-100 outline-none font-bold transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-rose-300 uppercase pl-4">Ciudad</label>
                  <select className="w-full bg-rose-50/30 border border-rose-50 rounded-[1.5rem] py-4 px-4 text-[10px] focus:ring-4 focus:ring-rose-100 outline-none font-bold transition-all h-[52px]" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-rose-gradient text-white py-5 rounded-[1.8rem] font-black text-[10px] active-scale shadow-xl uppercase tracking-widest mt-4">Activar Mi Perfil Pro</button>
            </form>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-rose-gradient text-white rounded-[2.5rem] flex items-center justify-center shadow-lg border-4 border-white animate-bounce"><CheckCircle2 className="w-10 h-10" /></div>
            <div className="space-y-2">
              <h2 className="text-3xl font-brand font-bold text-gray-900 leading-tight">¡Bienvenida,<br/>Colega!</h2>
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><ShieldCheck className="w-3 h-3" /> Salón RD Verificado</p>
            </div>
            <button onClick={() => { handleClose(); if(hasItemsInCart) onCompleteOrder(); }} className="w-full bg-rose-900 text-white py-6 rounded-[2rem] font-black text-[10px] active-scale shadow-2xl flex items-center justify-center gap-4 uppercase tracking-widest">
              {hasItemsInCart ? 'Enviar Mi Pedido Ahora' : 'Ir al Catálogo Pro'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
