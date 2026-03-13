import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  getGetOpenaiConversationQueryKey, 
  getListOpenaiConversationsQueryKey 
} from '@workspace/api-client-react';
import { useToast } from './use-toast';

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sendMessage = useCallback(async (conversationId: number, content: string) => {
    setIsStreaming(true);
    setStreamedContent('');

    try {
      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message to the assistant.');
      }
      
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (!dataStr.trim()) continue;
              
              try {
                const data = JSON.parse(dataStr);
                if (data.done) {
                  done = true;
                } else if (data.content) {
                  setStreamedContent((prev) => prev + data.content);
                }
              } catch (e) {
                console.error('[SSE Parse Error] Failed to parse chunk:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Communication Error",
        description: "Failed to reach the AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStreaming(false);
      // Invalidate queries to fetch the definitive persisted state from DB
      queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(conversationId) });
      queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
    }
  }, [queryClient, toast]);

  return { sendMessage, isStreaming, streamedContent };
}
