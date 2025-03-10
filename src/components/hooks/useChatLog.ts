import Message, {BotMessage, SystemMessage, UserMessage} from '@/core/Message';
import {useState, useCallback, useEffect} from 'react';

const CHAT_STORAGE_KEY = 'infinitePersonas_chatLog';

const useChatLog = (characterId?: string) => {
  const storageKey = characterId ? `${CHAT_STORAGE_KEY}_${characterId}` : CHAT_STORAGE_KEY;
  
  // Initialize state from localStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages.map((msg: any) => {
          if (msg.isUser) {
            const userMsg = new UserMessage(msg.text);
            userMsg.id = msg.id;
            return userMsg;
          } else {
            const botMsg = new BotMessage(msg.text);
            botMsg.id = msg.id;
            return botMsg;
          }
        });
      }
    } catch (e) {
      console.error('Error loading chat from localStorage:', e);
    }
    return [];
  });
  
  const [numberOfRemovals, setNumberOfRemovals] = useState<number>(0);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return;
    
    try {
      const serializedMessages = JSON.stringify(messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        id: msg.id
      })));
      localStorage.setItem(storageKey, serializedMessages);
    } catch (e) {
      console.error('Error saving chat to localStorage:', e);
    }
  }, [messages, storageKey]);

  const addUserMessage = useCallback((message: string) => {
    setMessages((messages) => {
      if (!messages) {
        return [new UserMessage(message)];
      }
      const newMessages = [...messages, new UserMessage(message)];
      return newMessages;
    });
  }, []);

  const addBotMessage = useCallback((message: string) => {
    setMessages((messages) => {
      if (!messages) {
        return [new BotMessage(message)];
      }
      const newMessages = [...messages, new BotMessage(message)];
      return newMessages;
    });
  }, []);

  const addSystemMessage = useCallback((message: string) => {
    setMessages((messages) => {
      if (!messages) {
        return [new SystemMessage(message)];
      }
      return [...messages, new SystemMessage(message)];
    });
  }, []);

  const removeLastMessage = useCallback(() => {
    setNumberOfRemovals((numberOfRemovals) => numberOfRemovals + 1);
    setMessages((messages) => {
      if (!messages) {
        return [];
      }
      return messages.slice(0, -1);
    });
  }, []);

  const updateLastBotMessage = useCallback((updater: (prevText: string) => string) => {
    setMessages((messages) => {
      if (!messages || messages.length === 0) {
        return messages;
      }
      
      const lastIndex = messages.length - 1;
      const lastMessage = messages[lastIndex];
      
      // Only update if the last message is a bot message
      if (!lastMessage.isUser) {
        const updatedMessage = new BotMessage(updater(lastMessage.text));
        updatedMessage.id = lastMessage.id; // Preserve the original ID
        
        return [
          ...messages.slice(0, lastIndex),
          updatedMessage
        ];
      }
      
      return messages;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    messages,
    addUserMessage,
    addBotMessage,
    addSystemMessage,
    removeLastMessage,
    updateLastBotMessage,
    clearMessages,
    numberOfRemovals,
  };
};

export default useChatLog;
