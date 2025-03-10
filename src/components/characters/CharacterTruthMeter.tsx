import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    LinearProgressProps,
    Typography,
} from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import AddIcon from '@mui/icons-material/Add';
import useRateCharacterTruthfulness from '@/components/hooks/useRateCharacterTruthfulness';
import Character from '@/core/Character';
import Message from '@/core/Message';

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
}: {
    character: Character;
    messages: Message[];
}) => {
    // Only show the truth meter if we have at least 2 messages and the last one is from the bot
    if (messages.length < 2 || messages[messages.length - 1].isUser) {
        return null;
    }
    
    const botResponse = messages[messages.length - 1];
    const userMessage = messages[messages.length - 2];
    
    const {truthfulnessRating, truthfulnessExplanation, isLoading} =
        useRateCharacterTruthfulness({
            userMessage,
            botResponse,
            character,
        });

    return (
        <Box
            mt={4}
            sx={{
                display: 'flex',
                alignSelf: 'flex-end',
                color: '#fafafa',
            }}
        >
            {/* MUI ACCORDION: */}
            <Accordion
                disableGutters
                elevation={0}
                sx={{
                    background: '#4a4a4a',
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
                            <Box color="#fafafa" flexGrow={0} ml={4}>
                                <Typography sx={{marginBottom: 0}}>
                                    Loading...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box color="#fafafa">
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
