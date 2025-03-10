import axios from 'axios';
import {use, useCallback, useEffect, useState} from 'react';
import Character from '../../core/Character';
import Message, {UserMessage} from '@/core/Message';

const RESET_TIMEOUT_MS = 1000;

function shouldRetry(
  error: any,
  attempt: number,
  maxRetry: number
): {retry: boolean; message: string} {
  const defaultMessage = 'An unknown error occurred';

  if (!error.response) {
    return {retry: false, message: error.message || defaultMessage};
  }

  if (error.response.status >= 500 && error.response.status < 600) {
    const errorMessage = `Error: ${error.message || defaultMessage}`;

    if (attempt >= maxRetry) {
      return {
        retry: false,
        message: `${errorMessage}. Maximum retry attempts exceeded.`,
      };
    }

    return {retry: true, message: errorMessage};
  }

  return {retry: false, message: error.message || defaultMessage};
}

async function getNextChatMessage(
  messages: Message[],
  character: Character,
  maxRetry: number = 3
): Promise<{text: string}> {
  const apiUrl = `/api/LLM/characterChat`;

  let attempt = 0;

  while (attempt < maxRetry) {
    try {
      const response = await axios.post(apiUrl, {
        params: {character, messages},
      });
      return response.data;
    } catch (error: any) {
      const {retry, message} = shouldRetry(error, attempt, maxRetry);

      if (retry) {
        await new Promise((res) => setTimeout(res, RESET_TIMEOUT_MS));
        attempt++;
      } else {
        return {text: `Error: ${message}`};
      }
    }
  }

  return {text: 'Error: Unexpected error'};
}

export function useWelcomeMessage(
  character: Character,
  onSuccess: (text: string) => void
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getNextChatMessage([new UserMessage('hello!')], character).then(
      (response) => {
        setIsLoading(false);
        onSuccess(response.text);
      }
    );
  }, [character, onSuccess]);

  return {
    isLoading,
  };
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
  const {isLoading: isWelcomeMessageLoading} = useWelcomeMessage(
    character,
    onSuccess
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateResponse = useCallback(() => {
    setIsLoading(true);

    getNextChatMessage(messages, character)
      .then((response) => {
        setIsLoading(false);
        onSuccess(response.text);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [messages, character, onSuccess]);

  return {
    isLoading: isLoading || isWelcomeMessageLoading,
    generateResponse,
  };
}
