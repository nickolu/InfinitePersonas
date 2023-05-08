import Message, {BotMessage, SystemMessage, UserMessage} from '@/core/Message';
import {useState, useCallback} from 'react';

const useChatLog = () => {
  const [messages, setMessages] = useState<Message[]>([]);

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

  return {messages, addUserMessage, addBotMessage, addSystemMessage};
};

export default useChatLog;
