import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30 text-foreground">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex items-center justify-between p-3.5 sm:p-4 border-b border-border bg-card/80 backdrop-blur-md z-10 shrink-0 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 sm:p-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors active:scale-95"
          >
            <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-tight text-sm sm:text-base">HelpDesk Pro</span>
          </div>
          <div className="w-9 sm:w-10" /> {/* Spacer for flex centering */}
        </div>
        
        {/* Child Content (ChatArea) */}
        {children}
      </main>
    </div>
  );
}
