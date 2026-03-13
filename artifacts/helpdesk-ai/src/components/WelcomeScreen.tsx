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
    <div className="flex flex-col items-center justify-center h-full min-h-[70vh] max-w-4xl mx-auto px-6 text-center py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Avatar / Logo */}
      <div className="relative mb-10 group">
        <div className="absolute -inset-6 bg-primary/25 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
        <img 
          src={`${import.meta.env.BASE_URL}images/ai-avatar.png`} 
          alt="HelpDesk Pro AI Logo" 
          className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl shadow-2xl border border-primary/20" 
        />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight">
        HelpDesk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-400">Pro AI</span>
      </h1>
      
      <p className="text-muted-foreground text-lg md:text-xl mb-4 max-w-2xl font-medium">
        Your personal IT support expert for Levels 1, 2, and 3
      </p>
      <p className="text-muted-foreground/70 text-base md:text-lg mb-14 max-w-2xl">
        Get instant advice on troubleshooting, escalations, KB articles, and more
      </p>
       
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {PROMPTS.map((p, i) => (
          <button 
            key={i} 
            onClick={() => onPromptSelect(p.desc)}
            className="flex flex-col text-left p-6 md:p-7 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md hover:bg-card/80 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary group-hover:from-primary/40 group-hover:to-secondary/50 text-primary group-hover:scale-110 shadow-sm transition-all duration-300">
                <p.icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">{p.title}</span>
            </div>
            <p className="text-sm text-muted-foreground/90 group-hover:text-foreground/80 transition-colors leading-relaxed pl-1">
              {p.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
