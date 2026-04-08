import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Settings, 
  PlusCircle, 
  Mic, 
  Zap, 
  ShieldCheck, 
  Cpu,
  Sparkles,
  Send
} from 'lucide-react';
import { Message, INITIAL_MESSAGES } from './types';
import { getChatResponse } from './services/geminiService';

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }]
      }));
      history.push({ role: 'user', parts: [{ text: input }] });

      const startTime = performance.now();
      const responseText = await getChatResponse(history);
      const endTime = performance.now();
      const latency = `${Math.round(endTime - startTime)}ms`;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen ambient-gradient selection:bg-primary/30 flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-primary w-6 h-6 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
          <div className="flex flex-col">
            <h1 className="font-headline tracking-[0.2em] uppercase text-lg font-bold text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] leading-none">
              AETHER AI
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#8ff5ff]"></span>
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Neural Link Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-outline hover:text-primary transition-colors duration-300 active:scale-95">
            <History className="w-5 h-5" />
          </button>
          <button className="text-outline hover:text-primary transition-colors duration-300 active:scale-95">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Chat Canvas */}
      <main 
        ref={scrollRef}
        className="flex-1 max-w-4xl mx-auto w-full pt-28 pb-40 px-6 overflow-y-auto no-scrollbar scroll-smooth"
      >
        {/* Welcome Section */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-5xl font-light tracking-tight text-on-surface max-w-2xl mx-auto leading-tight">
            Synthesizing <span className="text-primary italic">Infinite</span> Possibilities.
          </h2>
          <p className="text-on-surface-variant font-body text-sm tracking-wide max-w-md mx-auto">
            Secure link established. How shall we expand the architecture of your thoughts today?
          </p>
        </div>

        {/* Conversation Stream */}
        <div className="flex flex-col gap-10">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col ${message.role === 'user' ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}
              >
                <div className={`flex items-center gap-3 mb-2 px-1 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-lg ${message.role === 'user' ? 'bg-surface-container-highest' : 'bg-primary/10'} flex items-center justify-center border ${message.role === 'user' ? 'border-outline-variant' : 'border-primary/20'}`}>
                    {message.role === 'user' ? (
                      <img 
                        alt="User Profile" 
                        className="w-full h-full rounded-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-Pe4nQLBzRZuHKChSzYeuPcJ2L8UL55A6MpOOM63q8d_vu1YHLdu-Ms803-9FkPVvyOwmXjzbDt8ZBFK4WN-b88iQcQdMm9NrlhRkgIRJcvyAxQOSCjZW219RO_9LO5hrW7PimhnrSxRjyJXxAv_Ja_cuSD9GS0AsuodDjZ7aRNJEVCjRS1kAk2v80iv5CWTcZUBwBqlzfA8C7lia-8UTOAm8ykj4zBmmA0jGXnnxJYMTxCfjwNK1mWKygbouZjAZAWbrViaxUpFD"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Cpu className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${message.role === 'user' ? 'text-on-surface-variant' : 'text-primary'}`}>
                    {message.role === 'user' ? 'Human Authority' : 'Aether Core'}
                  </span>
                </div>
                
                <div className={`${
                  message.role === 'user' 
                    ? 'bg-surface-container-highest/40 backdrop-blur-md border border-outline-variant/30 shadow-inner' 
                    : 'glass border-l-2 border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.2)]'
                } p-6 rounded-lg ${message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                  <p className="text-on-surface leading-relaxed font-body whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                
                {message.role === 'assistant' && (
                  <span className="mt-2 ml-1 text-[10px] text-outline font-medium uppercase tracking-tighter">
                    {message.timestamp} • Latency {message.latency || '14ms'}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 py-2 px-1"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-primary rounded-full blur-[4px] opacity-60 animate-pulse"></div>
                <div className="relative w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <span className="text-xs font-headline tracking-[0.1em] text-on-surface-variant uppercase italic">
                System processing neural pathways...
              </span>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom Command Center */}
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10 pt-4 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          {/* Quick Action Chips */}
          <div className="absolute -top-12 left-0 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-surface-container-highest/60 backdrop-blur-md border border-outline-variant/20 text-[10px] font-bold uppercase tracking-widest text-primary-dim hover:bg-primary/10 hover:border-primary/40 transition-all">
              Export Framework
            </button>
            <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-surface-container-highest/60 backdrop-blur-md border border-outline-variant/20 text-[10px] font-bold uppercase tracking-widest text-secondary hover:bg-secondary/10 hover:border-secondary/40 transition-all">
              Generate Visual
            </button>
            <button 
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="whitespace-nowrap px-4 py-1.5 rounded-full bg-surface-container-highest/60 backdrop-blur-md border border-outline-variant/20 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all"
            >
              Clear Buffer
            </button>
          </div>

          {/* Main Input Core */}
          <div className="glass rounded-xl flex items-center p-2 border border-outline-variant/20 focus-within:border-primary/50 focus-within:shadow-[0_0_30px_rgba(143,245,255,0.15)] transition-all duration-500">
            <button className="p-3 text-on-surface-variant hover:text-primary transition-colors">
              <PlusCircle className="w-5 h-5" />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline font-body text-sm py-4 px-2" 
              placeholder="Transmit instruction to Aether..." 
              type="text"
            />
            <div className="flex items-center gap-2 pr-2">
              <button className="p-3 text-on-surface-variant hover:text-secondary transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend}
                className="bg-primary text-on-primary p-3 rounded-lg shadow-[0_0_20px_rgba(0,238,252,0.4)] active:scale-95 transition-transform"
              >
                <Zap className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Security / State Footer */}
          <div className="mt-4 flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-outline" />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-outline">Quantum Encryption Enabled</span>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-outline">
              Aether OS v4.2.0
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Depth Decor */}
      <div className="fixed top-[15%] left-[10%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}
