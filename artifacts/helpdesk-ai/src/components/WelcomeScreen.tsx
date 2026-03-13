import { Terminal, ShieldAlert, BookOpen, LifeBuoy } from "lucide-react";

export function WelcomeScreen({ onPromptSelect }: { onPromptSelect: (p: string) => void }) {
  const PROMPTS = [
    { 
      icon: LifeBuoy, 
      title: "Troubleshoot VPN", 
      desc: "Guide me through fixing a user's Cisco AnyConnect connection issue." 
    },
    { 
      icon: BookOpen, 
      title: "Draft a KB Article", 
      desc: "Write a step-by-step guide for resetting a Microsoft 365 password." 
    },
    { 
      icon: ShieldAlert, 
      title: "Escalation Template", 
      desc: "Create a standard template for escalating a major network outage to L3." 
    },
    { 
      icon: Terminal, 
      title: "Analyze Logs", 
      desc: "Help me find the root cause of a recurring Windows blue screen from an event log." 
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] max-w-3xl mx-auto px-4 text-center mt-12 md:mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Avatar / Logo */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <img 
          src={`${import.meta.env.BASE_URL}images/ai-avatar.png`} 
          alt="HelpDesk Pro AI Logo" 
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl shadow-2xl border border-white/10" 
        />
      </div>
      
      <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
        HelpDesk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">Pro AI</span>
      </h1>
      
      <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl font-medium">
        Your specialized L1-L3 Support Assistant. How can I help resolve today's incidents?
      </p>
       
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {PROMPTS.map((p, i) => (
          <button 
            key={i} 
            onClick={() => onPromptSelect(p.desc)}
            className="flex flex-col text-left p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground shadow-sm transition-colors duration-300">
                <p.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-foreground text-lg">{p.title}</span>
            </div>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed">
              "{p.desc}"
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
