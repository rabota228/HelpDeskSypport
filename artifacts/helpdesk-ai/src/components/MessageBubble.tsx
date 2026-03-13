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
        "flex gap-4 w-full", 
        isUser ? "flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-inner">
            <User className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur rounded-lg"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/ai-avatar.png`} 
              alt="AI" 
              className="relative w-9 h-9 rounded-lg shadow-md border border-white/10 object-cover" 
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
          <div className="inline-block bg-secondary text-secondary-foreground px-5 py-3.5 rounded-2xl rounded-tr-sm text-[15px] shadow-md border border-white/5 font-medium leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none text-[15px] leading-relaxed 
            prose-p:mb-4 prose-headings:mb-4 prose-headings:mt-6 
            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50 prose-pre:shadow-lg prose-pre:p-4
            prose-code:text-cyan-300 prose-a:text-cyan-400"
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
