import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Send, Loader2 } from "lucide-react";
import { 
  useGetOpenaiConversation, 
  useCreateOpenaiConversation,
  OpenaiMessage
} from "@workspace/api-client-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useToast } from "@/hooks/use-toast";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";

export function ChatArea({ chatId }: { chatId?: number }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialRef = useRef(false);

  // Data fetching
  const { data: conversation } = useGetOpenaiConversation(chatId!, { 
    query: { enabled: !!chatId } 
  });
  const { mutateAsync: createConv } = useCreateOpenaiConversation();
  const { sendMessage, isStreaming, streamedContent } = useChatStream();

  // Local state to hold messages (allows optimistic updates)
  const [localMessages, setLocalMessages] = useState<OpenaiMessage[]>([]);

  // Sync server messages to local state when not streaming
  useEffect(() => {
    if (conversation?.messages && !isStreaming) {
      setLocalMessages(conversation.messages);
    }
  }, [conversation?.messages, isStreaming]);

  // Handle URL passed initial message
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    
    if (msg && chatId && !hasSentInitialRef.current) {
      hasSentInitialRef.current = true;
      // Clean URL
      window.history.replaceState({}, '', `/chat/${chatId}`);
      handleSend(msg);
    }
  }, [chatId]);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, streamedContent]);

  // Auto-resize textarea
  const handleInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleInitialMessage = async (text: string) => {
    if (isCreating || !text.trim()) return;
    setIsCreating(true);
    try {
      const conv = await createConv({ 
        data: { title: text.length > 40 ? text.substring(0, 40) + '...' : text } 
      });
      // Navigation triggers the useEffect above which calls handleSend
      navigate(`/chat/${conv.id}?msg=${encodeURIComponent(text)}`);
    } catch (err) {
      toast({ title: "Error", description: "Could not create incident.", variant: "destructive" });
      setIsCreating(false);
    }
  };

  const handleSend = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isStreaming) return;

    if (!chatId) {
      await handleInitialMessage(trimmed);
      return;
    }

    // Reset input immediately
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Optimistic update
    const tempUserMsg: OpenaiMessage = {
      id: Date.now(),
      conversationId: chatId,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString()
    };
    
    setLocalMessages(prev => [...prev, tempUserMsg]);
    
    // Trigger stream
    await sendMessage(chatId, trimmed);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative selection:bg-primary/30">
      
      {/* Desktop Context Header */}
      {chatId && (
        <div className="hidden md:flex h-16 border-b border-border items-center px-6 bg-card/30 backdrop-blur-md sticky top-0 z-10">
          <span className="font-display font-semibold text-foreground text-lg tracking-tight">
            {conversation?.title || "Loading Incident..."}
          </span>
        </div>
      )}

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        {chatId ? (
          <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-12 pb-40 space-y-4 sm:space-y-5 md:space-y-6">
            {localMessages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {/* Streaming UI */}
            {isStreaming && (
              <MessageBubble message={{
                id: 'streaming',
                role: 'assistant',
                content: streamedContent || "..."
              }} />
            )}
            
            <div ref={messagesEndRef} className="h-2" />
          </div>
        ) : (
          <div className="h-full pb-40">
            <WelcomeScreen onPromptSelect={(text) => handleInitialMessage(text)} />
          </div>
        )}
      </div>

      {/* Input Area (Fixed to bottom) */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-4 sm:pb-5 md:pb-6 pt-12 sm:pt-14 md:pt-16 px-3 sm:px-4 md:px-8 border-none pointer-events-none">
        <div className="max-w-5xl mx-auto relative group pointer-events-auto">
          {/* Glowing background effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-lg opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
          
          {/* Input Box */}
          <div className="relative flex items-end gap-2 sm:gap-2.5 bg-card border-2 border-border/60 focus-within:border-primary/50 rounded-2xl p-2 sm:p-2.5 shadow-2xl transition-all duration-300">
            <textarea 
              ref={textareaRef}
              value={input}
              onChange={handleInputText}
              onKeyDown={onKeyDown}
              placeholder="Describe the issue, paste logs, or ask for an escalation path..."
              className="w-full bg-transparent resize-none p-2.5 sm:p-3 max-h-48 focus:outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground font-medium"
              rows={1}
              disabled={isCreating || isStreaming}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isCreating || isStreaming}
              className={cn(
                "p-3 sm:p-3.5 md:p-4 rounded-xl font-semibold transition-all duration-300 shrink-0 shadow-lg active:scale-95 sm:active:scale-100",
                input.trim() && !isCreating && !isStreaming
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 hover:-translate-y-0.5" 
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {isCreating ? <Loader2 className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 animate-spin" /> : <Send className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5" />}
            </button>
          </div>
          <div className="text-center mt-2 sm:mt-2.5 md:mt-3 text-xs font-mono text-muted-foreground/60">
            HelpDesk Pro AI can make mistakes. Always verify scripts and commands before execution.
          </div>
        </div>
      </div>

    </div>
  );
}
