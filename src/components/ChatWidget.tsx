import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { retrieveContext } from '@/lib/rag';
import { getCompanyName } from '@/data/knowledgeBase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const companyName = getCompanyName();

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `Hi! I'm here to help with any questions about ${companyName}. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // RAG: Retrieve relevant context from knowledge base
      const { context, hasContext } = retrieveContext(userMessage.content);
      
      console.log(`[ChatWidget] RAG result - hasContext: ${hasContext}`);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: userMessage.content,
          conversationHistory: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          knowledgeContext: context,
          companyName: companyName
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm sorry, I couldn't process that request."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[520px] bg-card rounded-2xl shadow-widget widget-glow border border-border/50 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="gradient-primary px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-primary-foreground font-semibold">{companyName} Support</h3>
                <p className="text-primary-foreground/70 text-xs">Powered by AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-in`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bubble-user text-primary-foreground rounded-br-md' 
                    : 'bubble-bot text-foreground border border-border/50 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-message-in">
                <div className="bubble-bot px-4 py-3 rounded-2xl rounded-bl-md border border-border/50 flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-50 transition-all hover:opacity-90"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 gradient-primary rounded-full shadow-widget flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform animate-float"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
