
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, ShieldCheck, Lock, UserCheck, BarChart3 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getBeautyAdvice } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Bienvenido al Centro de Soporte SALÓN RD PRO. ¿Eres Administrador, Suplidor o Estilista?', 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Detectar login de administrador en el chat para cambiar modo de IA
    if (input === '1319') {
      setIsAdmin(true);
    }

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
    const response = await getBeautyAdvice(input, history, isAdmin);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    setIsTyping(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-32 right-6 w-16 h-16 bg-rose-gradient text-white rounded-[1.8rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] border-4 border-white ${isOpen ? 'hidden' : ''}`}
      >
        <Bot className="w-8 h-8" />
        {isAdmin && <span className="absolute -top-1 -right-1 bg-indigo-600 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"><BarChart3 className="w-3 h-3" /></span>}
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[92vw] max-w-sm h-[700px] max-h-[85vh] bg-white rounded-[3.5rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.3)] flex flex-col z-[200] border-4 border-white overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <div className={`p-8 flex items-center justify-between transition-colors ${isAdmin ? 'bg-indigo-900' : 'bg-rose-900'} text-white`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 rotate-3">
                {isAdmin ? <BarChart3 className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">
                  {isAdmin ? 'Modo Administrador' : 'Soporte SALÓN RD'}
                </h3>
                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">IA Conectada</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2.2rem] text-[13px] leading-relaxed font-medium shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-rose-900 text-white rounded-br-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-full shadow-sm border border-gray-100 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-rose-200 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-t border-gray-50">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escriba su consulta profesional..."
                className="w-full bg-gray-50 border-none rounded-[1.8rem] py-5 pl-8 pr-16 text-sm font-medium focus:ring-4 focus:ring-rose-100 outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-rose-900 text-white rounded-2xl flex items-center justify-center disabled:opacity-30 transition-all active:scale-90 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
