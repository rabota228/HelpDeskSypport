import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Plus, MessageSquare, Trash2, PanelLeftClose } from "lucide-react";
import { 
  useListOpenaiConversations, 
  useDeleteOpenaiConversation 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: conversations, isLoading } = useListOpenaiConversations();
  const { mutate: deleteConv } = useDeleteOpenaiConversation();

  const sortedConversations = useMemo(() => {
    return [...(conversations || [])].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [conversations]);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    deleteConv({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
        if (location === `/chat/${id}`) {
          navigate("/");
        }
      }
    });
  };

  const currentChatId = location.startsWith("/chat/") 
    ? parseInt(location.split("/")[2]) 
    : null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar Panel */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src={`${import.meta.env.BASE_URL}images/ai-avatar.png`} 
              alt="Logo" 
              className="w-8 h-8 rounded-lg border border-white/10 shadow-sm"
            />
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              HelpDesk <span className="text-primary">Pro</span>
            </span>
          </Link>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4 border-b border-sidebar-border">
          <Link 
            href="/"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-ios hover:shadow-ios-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 active:scale-95 text-sm sm:text-base"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            New Incident
          </Link>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground/70 mb-3 px-2 mt-2 uppercase tracking-wider">
            Recent Incidents
          </div>
          
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground animate-pulse">
              Loading history...
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground/50">
              No previous incidents found.
            </div>
          ) : (
            sortedConversations.map(conv => {
              const isActive = currentChatId === conv.id;
              return (
                <Link 
                  key={conv.id} 
                  href={`/chat/${conv.id}`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl transition-all group",
                    isActive 
                      ? "glass bg-white/8 border-primary/40 text-primary" 
                      : "glass-sm text-muted-foreground hover:bg-white/5 hover:text-foreground hover:border-white/15"
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="truncate text-sm font-medium">{conv.title}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, conv.id)} 
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
