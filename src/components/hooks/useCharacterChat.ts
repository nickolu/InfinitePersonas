import axios from 'axios';
import {use, useEffect, useState} from 'react';
import {Character} from '../../core/Character';
import Message from '@/core/Message';

async function getNextMessageFromChat(
  messages: Message[],
  character: Character
) {
  const apiUrl = `/api/LLM/characterChat`;

  try {
    const response = await axios.post(apiUrl, {params: {character, messages}});

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function useCharacterChat({
  character,
  messages,
  onSuccess,
}: {
  messages: Message[];
  onSuccess: (text: string) => void;
  character: Character;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.isUser) {
      setIsLoading(true);

      getNextMessageFromChat(messages, character)
        .then((response) => {
          setIsLoading(false);
          onSuccess(response.text);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [messages, character, onSuccess]);

  return {
    isLoading,
  };
}
