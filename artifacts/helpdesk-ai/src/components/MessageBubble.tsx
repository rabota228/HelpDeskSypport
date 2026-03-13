import { User } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: {
    id: number | string;
    role: string;
    content: string;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-5 w-full", 
        isUser ? "flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 border border-primary/40 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <User className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-primary/15 blur-md rounded-lg"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/ai-avatar.png`} 
              alt="AI" 
              className="relative w-10 h-10 rounded-lg shadow-lg border border-primary/20 object-cover" 
            />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 min-w-0 max-w-[85%] md:max-w-[75%]", 
        isUser ? "text-right" : ""
      )}>
        {isUser ? (
          <div className="inline-block bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground px-6 py-4 rounded-2xl rounded-tr-sm text-[15px] shadow-lg border border-white/8 font-medium leading-relaxed hover:shadow-xl transition-shadow">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none text-[15px] leading-relaxed 
            prose-p:mb-5 prose-p:text-foreground/90 prose-headings:mb-4 prose-headings:mt-6 
            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50 prose-pre:shadow-lg prose-pre:p-4
            prose-code:text-cyan-300 prose-a:text-cyan-400 prose-strong:text-foreground"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || "..."}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
