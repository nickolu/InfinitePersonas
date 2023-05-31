import axios from 'axios';
import {use, useCallback, useEffect, useState} from 'react';
import Character from '../../core/Character';
import Message, {UserMessage} from '@/core/Message';

async function getNextChatMessage(
  messages: Message[],
  character: Character
): Promise<{text: string}> {
  const apiUrl = `/api/LLM/characterChat`;
  console.log('getting chat');
  try {
    const response = await axios.post(apiUrl, {params: {character, messages}});
    console.log('response:', response);
    return response.data;
  } catch (error) {
    console.error('error:', error);
    console.error(error);
    throw error;
  }
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

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.isUser) {
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
    }
  }, [messages, character, onSuccess]);

  return {
    isLoading: isLoading || isWelcomeMessageLoading,
  };
}
