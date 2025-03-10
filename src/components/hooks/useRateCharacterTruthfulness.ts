import axios from 'axios';
import {useEffect, useState, useRef, useCallback} from 'react';
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
    skipAutoAnalysis = false,
}: {
    userMessage: Message;
    botResponse: Message;
    character: Character;
    skipAutoAnalysis?: boolean;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [truthfulnessRating, setTruthfulnessRating] = useState<number>(0);
    const [truthfulnessExplanation, setTruthfulnessExplanation] = useState<string>('');
    
    // Function to start the analysis manually
    const startAnalysis = useCallback(() => {
        if (userMessage && botResponse && !botResponse?.isUser) {
            setIsLoading(true);
            setTruthfulnessExplanation('');
            
            getTruthfulnessRating(userMessage?.text ?? '', botResponse?.text ?? '', character)
                .then((response) => {
                    setTruthfulnessRating(Number(response.content));
                    getTruthfulnessExplanation(
                        userMessage?.text ?? '',
                        botResponse?.text ?? '',
                        character,
                        Number(response.content)
                    )
                        .then((response) => {
                            setIsLoading(false);
                            setTruthfulnessExplanation(response.content);
                        })
                        .catch((error) => {
                            console.error(error);
                            setIsLoading(false);
                        });
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                });
        }
    }, [userMessage, botResponse, character]);

    // Auto-start analysis if skipAutoAnalysis is false
    useEffect(() => {
        if (!skipAutoAnalysis && userMessage && botResponse && !botResponse?.isUser) {
            startAnalysis();
        }
    }, [userMessage, botResponse, character, skipAutoAnalysis, startAnalysis]);
    
    return {
        isLoading,
        truthfulnessRating,
        truthfulnessExplanation,
        startAnalysis,
    };
}
