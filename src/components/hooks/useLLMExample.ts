import axios from 'axios';
import {useState} from 'react';

async function fetchExample(input: string, actions: string[]) {
  const apiUrl = `/api/LLM/example`;

  try {
    const response = await axios.post(apiUrl, {params: {input, actions}});
    return JSON.parse(response?.data?.text?.toLowerCase())?.action || '';
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function useLLMExample() {
  const [action, setAction] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function example(input: string, actions: string[]): Promise<void> {
    setIsLoading(true);
    try {
      const action = await fetchExample(input, actions);
      setAction(action);
      setIsLoading(false);
    } catch (error) {
      setAction('error');
      setIsLoading(false);
    }
  }

  return {action, example, isLoading};
}
