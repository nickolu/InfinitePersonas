import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import Character from '@/core/Character';
import Message from '@/core/Message';

interface UseStreamingChatProps {
  character: Character;
  messages: Message[];
  onChunk: (chunk: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: string) => void;
  onStartStreaming?: () => void;
}

const useStreamingChat = ({
  character,
  messages,
  onChunk,
  onComplete,
  onError,
  onStartStreaming,
}: UseStreamingChatProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fullTextRef = useRef<string>('');

  // Clean up any ongoing streams when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const generateStreamingResponse = useCallback(async () => {
    if (isStreaming) {
      return; // Don't start a new stream if one is already in progress
    }

    setIsStreaming(true);
    fullTextRef.current = '';

    // If onStartStreaming is provided, call it to add an empty bot message
    if (onStartStreaming) {
      onStartStreaming();
    }

    try {
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // Make the request to the streaming API
      const response = await fetch('/api/LLM/characterChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: { character, messages }
        }),
        signal,
      });

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // Create a reader to read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        // Decode the chunk and process each event
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.error) {
                onError(data.error);
                break;
              }
              
              if (data.done) {
                onComplete(fullTextRef.current);
                break;
              }
              
              if (data.content) {
                fullTextRef.current += data.content;
                onChunk(data.content);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Streaming error:', error);
        onError(error.message || 'An error occurred during streaming');
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [character, messages, onChunk, onComplete, onError, onStartStreaming, isStreaming]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  return {
    isStreaming,
    generateStreamingResponse,
    stopStreaming,
  };
};

export default useStreamingChat;
