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

  return {
    messages,
    addUserMessage,
    addBotMessage,
    addSystemMessage,
    removeLastMessage,
    numberOfRemovals,
  };
};

export default useChatLog;
