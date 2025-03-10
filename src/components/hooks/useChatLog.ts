import Message, {BotMessage, SystemMessage, UserMessage} from '@/core/Message';
import {useState, useCallback, useEffect} from 'react';

const useChatLog = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [numberOfRemovals, setNumberOfRemovals] = useState<number>(0);

  const addUserMessage = useCallback((message: string) => {
    setMessages((messages) => {
      if (!messages) {
        return [new UserMessage(message)];
      }
      return [...messages, new UserMessage(message)];
    });
  }, []);

  const addBotMessage = useCallback((message: string) => {
    setMessages((messages) => {
      if (!messages) {
        return [new BotMessage(message)];
      }
      return [...messages, new BotMessage(message)];
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

  return {
    messages,
    addUserMessage,
    addBotMessage,
    addSystemMessage,
    removeLastMessage,
    updateLastBotMessage,
    numberOfRemovals,
  };
};

export default useChatLog;
