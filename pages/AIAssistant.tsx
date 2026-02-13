
import React, { useState, useRef, useEffect } from 'react';
import { Team, AIChat, ChatMessage } from '../types';
import { chatWithAssistant } from '../geminiService';
import { saveChat, deleteChat } from '../storage';

const AIAssistant: React.FC<{ activeTeam: Team | null }> = ({ activeTeam }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Sync with active team's active chat
  useEffect(() => {
    if (activeTeam && activeChatId) {
      const chat = activeTeam.chats.find(c => c.id === activeChatId);
      if (chat) setMessages(chat.messages);
    } else {
      setMessages([]);
    }
  }, [activeChatId, activeTeam]);

  if (!activeTeam) return <div className="text-center py-20 text-gray-400 font-bold">Selecciona un equipo primero.</div>;

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    const currentMessages: ChatMessage[] = [...messages, { role: 'user', text: userText, timestamp: Date.now() }];
    
    setInput('');
    setMessages(currentMessages);
    setLoading(true);

    try {
      const responseText = await chatWithAssistant(userText, { activeTeam, history: messages });
      const finalMessages: ChatMessage[] = [...currentMessages, { role: 'model', text: responseText, timestamp: Date.now() }];
      
      const chatId = activeChatId || crypto.randomUUID();
      const chat: AIChat = {
        id: chatId,
        title: userText.slice(0, 30) + '...',
        messages: finalMessages,
        lastUpdate: Date.now()
      };
      
      saveChat(activeTeam.id, chat);
      if (!activeChatId) setActiveChatId(chatId);
      setMessages(finalMessages);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión. Inténtalo de nuevo.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = activeTeam.chats.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-6">
      <div className="w-80 bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b">
          <button 
            onClick={startNewChat}
            className="w-full py-3 bg-soccer-green text-white rounded-2xl font-bold hover:bg-soccer-accent transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Nueva Consulta
          </button>
          <div className="mt-4 relative">
            <input 
              type="text" 
              placeholder="Buscar histórico..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-soccer-accent"
            />
            <i className="fa-solid fa-search absolute left-3 top-2.5 text-gray-400 text-[10px]"></i>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredChats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-xl cursor-pointer transition relative group ${activeChatId === chat.id ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50 border border-transparent'}`}
            >
              <h4 className="text-xs font-bold text-gray-700 truncate pr-6">{chat.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{new Date(chat.lastUpdate).toLocaleDateString()}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteChat(activeTeam.id, chat.id); if(activeChatId === chat.id) startNewChat(); }}
                className="absolute right-2 top-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                <i className="fa-solid fa-trash-alt text-[10px]"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden shadow-sm relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4 opacity-40">
              <div className="w-20 h-20 bg-soccer-green/10 text-soccer-green rounded-3xl flex items-center justify-center text-4xl">
                <i className="fa-solid fa-robot"></i>
              </div>
              <h3 className="text-xl font-bold">¿En qué puedo apoyarte hoy?</h3>
              <p className="text-sm font-medium leading-relaxed">Soy tu consultor UEFA C. Puedo ayudarte con tareas, análisis de partidos o gestión de grupo.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-5 rounded-3xl font-medium text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-soccer-green text-white rounded-tr-none' : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 p-5 rounded-3xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-soccer-accent rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-soccer-accent rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-soccer-accent rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-6 bg-gray-50 border-t">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Haz una consulta técnica..."
              className="w-full pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-soccer-accent shadow-inner font-medium text-sm"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2.5 bg-soccer-green text-white rounded-xl hover:bg-soccer-accent transition shadow-md disabled:bg-gray-300"
            >
              <i className="fa-solid fa-paper-plane px-1"></i>
            </button>
          </div>
          <p className="mt-3 text-[10px] text-center text-gray-400 font-black uppercase tracking-[0.2em]">
            Herramienta consultiva profesional • No sustituye al entrenador
          </p>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
