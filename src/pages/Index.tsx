import { ChatWidget } from '@/components/ChatWidget';
import { MessageCircle, Zap, Shield, Code } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Support Widget
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Customer Support,
            <br />
            <span className="text-primary">Empowered by AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">A chat widget using RAG-lite architecture. Answers questions strictly from your knowledge base — no hallucinations.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Context-Grounded</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Embeddable</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Real-time AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            title: 'Knowledge Base',
            desc: 'Your FAQs, policies, and docs are chunked and indexed for retrieval.'
          }, {
            title: 'Smart Retrieval',
            desc: 'Keyword matching finds the most relevant chunks for each question.'
          }, {
            title: 'Grounded Responses',
            desc: 'AI answers ONLY from provided context. No making things up.'
          }].map((item, i) => <div key={i} className="bg-card p-6 rounded-xl border border-border">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Try it prompt */}
      <section className="py-16 px-6 text-center">
        <p className="text-muted-foreground mb-2">👉 Try the widget in the bottom-right corner</p>
        <p className="text-sm text-muted-foreground">Ask about our services, project process, support hours, or AI chatbot solutions</p>
      </section>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Footer */}
      <footer className="py-6 px-6 text-center border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Built with ❤️ by{' '}
          <a 
            href="https://github.com/goldenfay" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            goldenfay
          </a>
        </p>
      </footer>
    </div>;
};
export default Index;