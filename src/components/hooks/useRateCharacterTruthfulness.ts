import axios from 'axios';
import {use, useCallback, useEffect, useState} from 'react';
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

export default function useRateCharacterTruthfulness({
  message,
  character,
}: {
  message: Message;
  character: Character;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [truthfulnessRating, setTruthfulnessRating] = useState<number>(0);

  useEffect(() => {
    if (message && !message?.isUser) {
      setIsLoading(true);

      getTruthfulnessRating(message.text, character)
        .then((response) => {
          setIsLoading(false);
          setTruthfulnessRating(Number(response.text));
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [message, character]);

  return {
    isLoading,
    truthfulnessRating,
  };
}
