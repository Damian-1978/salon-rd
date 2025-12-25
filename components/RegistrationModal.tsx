
import React, { useState } from 'react';
import { X, ShieldCheck, MessageCircle, Heart, CheckCircle2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { RegistrationRecord } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (record: RegistrationRecord) => void;
  hasItemsInCart: boolean;
  onCompleteOrder: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegister, 
  hasItemsInCart,
  onCompleteOrder 
}) => {
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [formData, setFormData] = useState({ name: '', salonName: '', phone: '', rnc: '' });

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
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={handleClose} />
      <div className="bg-white text-black w-full max-w-md rounded-[3.5rem] overflow-hidden relative shadow-2xl animate-in zoom-in duration-500 border-4 border-white">
        
        {step === 'FORM' ? (
          <>
            <div className="p-12 flex flex-col items-center text-center">
              <button onClick={handleClose} className="absolute top-10 right-10 p-3 bg-rose-50 text-rose-300 rounded-2xl active-scale"><X className="w-5 h-5" /></button>
              <div className="w-20 h-20 mb-8 rounded-[2rem] bg-rose-gradient text-white flex items-center justify-center shadow-lg transform rotate-3 border-4 border-white"><span className="font-brand text-3xl font-bold">S</span></div>
              <h2 className="text-4xl font-brand font-bold mb-3 tracking-tight text-gray-900">Acceso Pro</h2>
              <p className="text-rose-300 text-xs font-black uppercase tracking-widest mb-4">Valida tu Perfil de Salon</p>
              <div className="h-0.5 w-12 bg-rose-100 rounded-full mb-2"></div>
            </div>

            <form onSubmit={handleSubmit} className="px-12 pb-16 space-y-4">
              <input required type="text" placeholder="Tu Nombre Completo" className="w-full bg-rose-50/30 border border-rose-50 rounded-[1.8rem] py-5 px-8 text-sm focus:ring-4 focus:ring-rose-100 outline-none font-bold placeholder:text-rose-200 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="text" placeholder="Nombre del Salón" className="w-full bg-rose-50/30 border border-rose-50 rounded-[1.8rem] py-5 px-8 text-sm focus:ring-4 focus:ring-rose-100 outline-none font-bold placeholder:text-rose-200 transition-all" value={formData.salonName} onChange={e => setFormData({...formData, salonName: e.target.value})} />
              <input required type="tel" placeholder="WhatsApp (Ej: 8492752807)" className="w-full bg-rose-50/30 border border-rose-50 rounded-[1.8rem] py-5 px-8 text-sm focus:ring-4 focus:ring-rose-100 outline-none font-bold placeholder:text-rose-200 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <button type="submit" className="w-full bg-rose-gradient text-white py-6 rounded-[2.2rem] font-black text-xs active-scale shadow-xl uppercase tracking-widest mt-4">Validar y Acceder</button>
            </form>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-rose-gradient text-white rounded-[2.8rem] flex items-center justify-center shadow-lg border-4 border-white animate-bounce"><CheckCircle2 className="w-12 h-12" /></div>
            <div className="space-y-3">
              <h2 className="text-4xl font-brand font-bold text-gray-900 leading-tight">¡Bienvenida,<br/>Profesional!</h2>
              <p className="text-rose-300 text-[10px] font-black uppercase tracking-widest">Tu perfil ha sido verificado</p>
            </div>
            <div className="w-full space-y-4">
              <button onClick={() => { handleClose(); if(hasItemsInCart) onCompleteOrder(); }} className="w-full bg-rose-gradient text-white py-6 rounded-[2.2rem] font-black text-xs active-scale shadow-2xl flex items-center justify-center gap-4 uppercase tracking-widest">
                <ShoppingBag className="w-5 h-5" /> {hasItemsInCart ? 'Finalizar Mi Pedido' : 'Empezar a Comprar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
