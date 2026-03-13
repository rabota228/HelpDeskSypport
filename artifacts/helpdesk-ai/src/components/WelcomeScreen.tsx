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
    <div className="flex flex-col items-center justify-center h-full min-h-screen max-w-5xl mx-auto px-4 sm:px-6 text-center py-8 sm:py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Avatar / Logo with iOS glow */}
      <div className="relative mb-8 sm:mb-10 group">
        <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        <img 
          src={`${import.meta.env.BASE_URL}images/ai-avatar.png`} 
          alt="HelpDesk Pro AI Logo" 
          className="relative w-24 sm:w-28 md:w-36 h-24 sm:h-28 md:h-36 rounded-3xl shadow-ios border border-white/10" 
        />
      </div>
      
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
        HelpDesk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Pro AI</span>
      </h1>
      
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-2 sm:mb-3 max-w-2xl font-medium">
        Your personal IT support expert for Levels 1, 2, and 3
      </p>
      <p className="text-xs sm:text-sm md:text-base text-muted-foreground/70 mb-10 sm:mb-12 md:mb-14 max-w-2xl">
        Get instant advice on troubleshooting, escalations, KB articles, and more
      </p>
       
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full">
        {PROMPTS.map((p, i) => (
          <button 
            key={i} 
            onClick={() => onPromptSelect(p.desc)}
            className="flex flex-col text-left p-4 sm:p-5 md:p-7 glass rounded-3xl hover:bg-white/8 hover:border-white/20 hover:shadow-ios transition-all duration-300 group active:scale-95 sm:active:scale-100"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-primary/25 to-accent/15 text-primary group-hover:from-primary/35 group-hover:to-accent/25 group-hover:scale-110 shadow-ios-sm transition-all duration-300">
                <p.icon className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <span className="font-semibold text-foreground text-base sm:text-lg group-hover:text-primary transition-colors leading-tight">{p.title}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground/90 group-hover:text-foreground/80 transition-colors leading-relaxed pl-1">
              {p.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
