import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Persona, EmotionState } from '../types';
import { Send, StopCircle, User, Bot } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';

interface Props {
  persona: Persona;
  onEndSession: (history: ChatMessage[]) => void;
  initialHistory?: ChatMessage[];
}

export const ChatInterface: React.FC<Props> = ({ persona, onEndSession, initialHistory = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>(EmotionState.NEUTRAL);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (initialHistory.length > 0) {
      setMessages(initialHistory);
    } else if (messages.length === 0) {
      // Initial greeting if empty
       setMessages([{
         id: 'init',
         role: 'model',
         text: `Hello... I'm ${persona.name}.`,
         timestamp: Date.now(),
         emotion: EmotionState.NEUTRAL
       }]);
    }
  }, [persona.id]); // Depend on ID to reset if persona changes

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    if (!isThinking) {
        inputRef.current?.focus();
    }
  }, [isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Call Gemini Service
      const response = await generateChatResponse(persona, messages, userMsg.text);
      
      const modelMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        emotion: response.emotion
      };
      
      setCurrentEmotion(response.emotion || EmotionState.NEUTRAL);
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'model',
        text: "(System Error: Connection lost)",
        timestamp: Date.now(),
        emotion: EmotionState.TIRED
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Visual indicator for current emotion
  const getEmotionColor = (emotion: EmotionState) => {
    switch (emotion) {
      case EmotionState.HAPPY: return 'bg-emerald-900/50 text-emerald-300 border-emerald-800';
      case EmotionState.ANXIOUS: return 'bg-amber-900/50 text-amber-300 border-amber-800';
      case EmotionState.IRRITATED: return 'bg-red-900/50 text-red-300 border-red-800';
      case EmotionState.TIRED: return 'bg-slate-700 text-slate-300 border-slate-600';
      default: return 'bg-blue-900/50 text-blue-300 border-blue-800';
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={persona.avatarBase64 || `https://picsum.photos/seed/${persona.id}/50/50`} 
              alt={persona.name} 
              className="w-10 h-10 rounded-full object-cover border border-slate-600"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-100">{persona.name}</h3>
            <div className={`text-xs px-2 py-0.5 rounded-full inline-block border mt-1 ${getEmotionColor(currentEmotion)}`}>
              State: {currentEmotion}
            </div>
          </div>
        </div>
        <button 
          onClick={() => onEndSession(messages)}
          className="text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 px-4 py-2 rounded-lg font-medium flex items-center transition-colors border border-red-900/30"
        >
          <StopCircle size={16} className="mr-2" /> End Session
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-900/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-900 text-indigo-300' : 'bg-slate-700 text-slate-300'}`}>
                    {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className={`px-5 py-3.5 rounded-2xl text-base shadow-sm leading-relaxed whitespace-pre-wrap ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        
        {isThinking && (
          <div className="flex justify-start">
             <div className="flex items-end gap-2">
               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-slate-300"/>
               </div>
               <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1">
                 <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            disabled={isThinking}
            className="flex-grow bg-slate-900 text-slate-100 placeholder-slate-500 border border-slate-600 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-center">
             <p className="text-xs text-slate-500">AI simulates a persona based on psychological frameworks. Responses may vary.</p>
        </div>
      </div>
    </div>
  );
};