
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, MessageCircleHeart } from 'lucide-react';
import { ChatMessage } from '../types';
import { getBeautyAdvice } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '¡Bienvenida, colega! Soy tu consultora experta de SALÓN RD. ¿En qué puedo ayudarte a perfeccionar hoy?', timestamp: Date.now() }
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

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getBeautyAdvice(input);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    setIsTyping(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-28 right-6 w-16 h-16 bg-rose-gradient text-white rounded-[1.8rem] shadow-soft flex items-center justify-center hover:scale-110 transition-transform z-50 border-4 border-white ${isOpen ? 'hidden' : ''}`}
      >
        <Sparkles className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-rose-500"></span>
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[92vw] max-w-sm h-[650px] max-h-[85vh] bg-white rounded-[3.5rem] shadow-2xl flex flex-col z-[60] border-4 border-white overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-6 bg-rose-gradient text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Consultora Pro</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-rose-200 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-rose-100 font-black uppercase tracking-widest">En Línea</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-rose-50/30 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-[13px] leading-relaxed font-medium ${
                  m.role === 'user' 
                    ? 'bg-rose-600 text-white shadow-soft rounded-br-none' 
                    : 'bg-white text-gray-700 shadow-sm border border-rose-100 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-rose-50 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-rose-200 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-rose-50 rounded-b-[3.5rem]">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Duda técnica o de productos..."
                className="w-full bg-rose-50/50 border-none rounded-[1.8rem] py-5 pl-8 pr-16 text-sm font-medium focus:ring-2 focus:ring-rose-200 outline-none placeholder:text-rose-200"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-rose-gradient text-white rounded-2xl flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 shadow-soft"
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
