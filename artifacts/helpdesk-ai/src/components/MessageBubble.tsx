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
        "flex gap-3 sm:gap-4 md:gap-5 w-full", 
        isUser ? "flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          <div className="w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 border border-primary/40 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow flex-shrink-0">
            <User className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 text-primary" />
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary/15 blur-md rounded-lg"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/ai-avatar.png`} 
              alt="AI" 
              className="relative w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-lg shadow-lg border border-primary/20 object-cover" 
            />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 min-w-0 max-w-[90%] sm:max-w-[85%] md:max-w-[75%]", 
        isUser ? "text-right" : ""
      )}>
        {isUser ? (
          <div className="inline-block bg-gradient-to-br from-primary/90 to-primary text-primary-foreground px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-3xl rounded-tr-sm text-xs sm:text-sm md:text-base shadow-ios-sm font-medium leading-relaxed hover:shadow-ios transition-all break-words">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none text-xs sm:text-sm md:text-base leading-relaxed 
            prose-p:mb-3 sm:prose-p:mb-4 md:prose-p:mb-5 prose-p:text-foreground/90 prose-headings:mb-2 sm:prose-headings:mb-3 md:prose-headings:mb-4 prose-headings:mt-4 sm:prose-headings:mt-5 md:prose-headings:mt-6 
            prose-pre:bg-[#1a1f3a] prose-pre:border prose-pre:border-primary/20 prose-pre:shadow-ios prose-pre:p-3 sm:prose-pre:p-4 prose-pre:rounded-2xl
            prose-code:text-cyan-300 prose-a:text-primary prose-strong:text-foreground"
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
