import axios from 'axios';
import {useEffect, useState} from 'react';
import Character from '@/core/Character';
import Message from '@/core/Message';

async function getTruthfulnessRating(
    input1: string = 'hello',
    input2: string,
    character: Character
) {
    const apiUrl = `/api/LLM/rateTruthfulness`;

    try {
        const response = await axios.post(apiUrl, {
            params: {input1, input2, character},
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getTruthfulnessExplanation(
    input1: string = 'hello',
    input2: string,
    character: Character,
    truthfulnessRating: number
) {
    const apiUrl = `/api/LLM/explainTruthfulnessRating`;

    try {
        const response = await axios.post(apiUrl, {
            params: {input1, input2, character, truthfulnessRating},
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default function useRateCharacterTruthfulness({
    userMessage,
    botResponse,
    character,
}: {
    userMessage: Message;
    botResponse: Message;
    character: Character;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [truthfulnessRating, setTruthfulnessRating] = useState<number>(0);
    const [truthfulnessExplanation, setTruthfulnessExplanation] =
        useState<string>('');

    useEffect(() => {
        if (userMessage && botResponse && !botResponse?.isUser) {
            setIsLoading(true);

            getTruthfulnessRating(userMessage.text, botResponse.text, character)
                .then((response) => {
                    setIsLoading(false);
                    setTruthfulnessRating(Number(response.text));
                    setTruthfulnessExplanation('')
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                });
        }
    }, [userMessage, botResponse, character]);

    useEffect(() => {
        if (userMessage && botResponse && !botResponse?.isUser) {
            setIsLoading(true);

            getTruthfulnessExplanation(
                userMessage.text,
                botResponse.text,
                character,
                truthfulnessRating
            )
                .then((response) => {
                    setIsLoading(false);
                    setTruthfulnessExplanation(response.text);
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                });
        }
    }, [truthfulnessRating, userMessage, botResponse, character]);

    return {
        isLoading,
        truthfulnessRating,
        truthfulnessExplanation,
    };
}
