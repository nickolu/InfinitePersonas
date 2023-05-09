import axios from 'axios';
import {use, useEffect, useState} from 'react';
import Character from '../../core/Character';
import Message from '@/core/Message';

async function getTruthfulnessRating(input: string, character: Character) {
  const apiUrl = `/api/LLM/rateTruthfulness`;

  try {
    const response = await axios.post(apiUrl, {params: {input, character}});

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function useRateTruthfulness({
  messages,
  character,
  onSuccess,
}: {
  messages: Message[];
  character: Character;
  onSuccess: (text: string) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && !lastMessage?.isUser) {
      setIsLoading(true);

      getTruthfulnessRating(lastMessage.text, character)
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
