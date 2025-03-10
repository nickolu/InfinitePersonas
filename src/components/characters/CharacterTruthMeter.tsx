import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    CircularProgress,
    LinearProgressProps,
    Typography,
} from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import AddIcon from '@mui/icons-material/Add';
import useRateCharacterTruthfulness from '@/components/hooks/useRateCharacterTruthfulness';
import Character from '@/core/Character';
import Message from '@/core/Message';
import { useState, useEffect } from 'react';

function getTruthfulnessColor(truthfulnessRating: number | null): {
    color: LinearProgressProps['color'];
    hexColor: string;
} {
    const colors = ['', 'error', 'warning', 'info', 'success', 'success'];
    const hexColors = [
        '',
        '#f44336',
        '#ff9800',
        '#2196f3',
        '#4caf50',
        '#4caf50',
    ];

    if (!truthfulnessRating) {
        return {
            color: 'primary',
            hexColor: '#2196f3',
        };
    }

    return {
        color: colors[truthfulnessRating] as LinearProgressProps['color'],
        hexColor: hexColors[truthfulnessRating],
    };
}

const truthfulnessDescriptions = [
    'not something we can check for truthfulness',
    'very untruthful',
    'untruthful',
    'neutral',
    'truthful',
    'very truthful',
];

const TruthMeterContent = ({
    truthfulnessRating,
    truthfulnessExplanation,
}: {
    truthfulnessRating: number;
    truthfulnessExplanation: string;
}) => {
    console.log(truthfulnessRating, truthfulnessExplanation);
    return (
        <Box mt={2}>
            <Typography>
                We think the last message from the bot was{' '}
                {truthfulnessDescriptions[truthfulnessRating]} because:{' '}
            </Typography>
            <Typography>{truthfulnessExplanation}</Typography>
        </Box>
    );
};

const CharacterTruthMeter = ({
    character,
    messages,
    isStreamComplete = true,
}: {
    character: Character;
    messages: Message[];
    isStreamComplete?: boolean;
}) => {
    
    const botResponse = messages[messages.length - 1] ?? null;
    const userMessage = messages[messages.length - 2] ?? null;
    
    const {
        truthfulnessRating, 
        truthfulnessExplanation, 
        isLoading,
        startAnalysis
    } = useRateCharacterTruthfulness({
        userMessage,
        botResponse,
        character,
        skipAutoAnalysis: true, // Skip automatic analysis, we'll trigger it manually
    });

    // Start analysis when streaming is complete
    useEffect(() => {
        if (isStreamComplete && botResponse && !botResponse.isUser) {
            startAnalysis();
        }
    }, [isStreamComplete, botResponse, startAnalysis]);

    // Only show the truth meter if we have at least 2 messages and the last one is from the bot
    if (messages.length < 2 || messages[messages.length - 1].isUser) {
        return null;
    }

    return (
        <Box
            mt={4}
            sx={{
                display: 'flex',
                alignSelf: 'flex-end',
                width: '100%',
            }}
        >
            {/* MUI ACCORDION: */}
            <Accordion
                disableGutters
                elevation={0}
                sx={{
                    border:
                        '2px solid ' +
                        getTruthfulnessColor(truthfulnessRating).hexColor,
                    width: '100%',
                    flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)',
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: '12px',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={
                        <Box
                            color={
                                getTruthfulnessColor(truthfulnessRating)
                                    .hexColor
                            }
                        >
                            <ArrowForwardIosSharpIcon
                                sx={{fontSize: '0.9rem'}}
                                color="inherit"
                            />
                        </Box>
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                        flexGrow: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexGrow: 0,
                            margin: 0,
                            '&.Mui-expanded': {
                                margin: 0,
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                marginBottom: 0,
                            }}
                            color={
                                getTruthfulnessColor(truthfulnessRating)
                                    .hexColor
                            }
                        >
                            AI TruthMeter ({truthfulnessRating || '?'} / 5)
                        </Typography>
                        {isLoading && (
                            <Box flexGrow={0} ml={4}>
                                <CircularProgress size={20} />
                            </Box>
                        )}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        {isLoading ? (
                            'Loading...'
                        ) : (
                            <TruthMeterContent
                                truthfulnessRating={truthfulnessRating}
                                truthfulnessExplanation={
                                    truthfulnessExplanation
                                }
                            />
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default CharacterTruthMeter;
