import {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {Box, Button, Stack, TextField, Theme, Typography, keyframes} from '@mui/material';
import Character from '@/core/Character';
import Message from '@/core/Message';
import useStreamingChat from '@/components/hooks/useStreamingChat';
import useChatLog from '@/components/hooks/useChatLog';
import PageLoadingSpinner from '@/components/Loaders/PageLoadingSpinner';
import StreamingText from '@/components/util/StreamingText';
import {Autorenew} from '@mui/icons-material';
import CharacterTruthMeter from './CharacterTruthMeter';
import axios from 'axios';

type CharacterChatProps = {
    character: Character;
    resetButton: React.ReactNode;
};

const userMessageStyles = {
    padding: 2,
    borderRadius: 2,
    backgroundColor: (theme: Theme) => theme.palette.grey[100],
    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginBottom: 2,
};

const botMessageStyles = {
    padding: 2,
    borderRadius: 2,
    backgroundColor: (theme: Theme  ) => theme.palette.primary.light,
    color: (theme: Theme) => theme.palette.primary.contrastText,
    alignSelf: 'flex-start',
    maxWidth: '70%',
    marginBottom: 2,
};

const UserMessage = ({message}: {message: Message}) => {
    return (
        <Box className="user" sx={userMessageStyles}>
            <Typography sx={{ marginBottom: 0 }}>{message.text}</Typography>
        </Box>
    );
};

const BotMessage = ({message}: {message: Message}) => {
    return (
        message.text ? (
            <Box className="bot" sx={botMessageStyles}>
                <Typography sx={{ marginBottom: 0 }}>
                    <StreamingText text={message.text} />
                </Typography>
            </Box>
        ) : null
    );
};

const CharacterChat = ({character, resetButton}: CharacterChatProps) => {
    
    const [inputText, setInputText] = useState('');
    const [streamingText, setStreamingText] = useState('');
    const [isStreamComplete, setIsStreamComplete] = useState(true);
    const [isLegacyLoading, setIsLegacyLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const {messages, addBotMessage, addUserMessage, removeLastMessage, updateLastBotMessage, clearMessages} =
        useChatLog(character.name);
    
    // Custom implementation of legacy chat without welcome message
    const generateLegacyResponse = useCallback(() => {
        setIsLegacyLoading(true);
        
        axios.post('/api/LLM/characterChat', {
            params: { character, messages }
        })
        .then(response => {
            setIsLegacyLoading(false);
            addBotMessage(response.data.text);
        })
        .catch(error => {
            setIsLegacyLoading(false);
        });
    }, [character, messages, addBotMessage]);
    
    // Streaming chat hook
    const {
        isStreaming,
        generateStreamingResponse,
        stopStreaming
    } = useStreamingChat({
        character,
        messages,
        onChunk: (chunk) => {
            setStreamingText(prev => prev + chunk);
            updateLastBotMessage(prev => prev + chunk);
        },
        onComplete: (fullText) => {
            setIsStreamComplete(true);
        },
        onError: (error) => {
            // Fall back to non-streaming approach
            generateLegacyResponse();
        },
        onStartStreaming: () => {
            addBotMessage('');
            setStreamingText('');
        }
    });
    
    // Calculate if we're in a loading state
    const isLoading = useMemo(() => {
        return isStreaming || isLegacyLoading || !isStreamComplete;
    }, [isStreaming, isLegacyLoading, isStreamComplete]);
    
    const lastTwoMessages = messages.slice(-2);
    const lastMessage = lastTwoMessages[1];
    const secondToLastMessage = lastTwoMessages[0];

    // Effect to handle user messages and trigger bot response
    useEffect(() => {
        // Skip if there are no messages
        if (!messages || messages.length === 0) {
            return;
        }

        const lastMessage = messages[messages.length - 1];

        // If the last message is from the user, generate a bot response
        if (lastMessage && lastMessage.isUser) {
            setIsStreamComplete(false);
            generateStreamingResponse();
        }
    }, [messages, generateStreamingResponse]);
    
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSendMessage = useCallback(() => {
        if (!inputText.trim() || isLoading) {
            return;
        }

        addUserMessage(inputText);
        setInputText('');
    }, [inputText, isLoading, addUserMessage]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const handleRetry = useCallback(() => {
        if (isLoading) return;

        if (lastMessage && !lastMessage.isUser && secondToLastMessage) {
            removeLastMessage();
            // Add an empty bot message that will be filled with streaming content
            addBotMessage('');
            setStreamingText('');
            setIsStreamComplete(false);
            generateStreamingResponse();
        }
    }, [
        isLoading,
        lastMessage,
        secondToLastMessage,
        removeLastMessage,
        addBotMessage,
        generateStreamingResponse,
    ]);

    // Define a subtle fade-in animation
    const fadeIn = keyframes`
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    `;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2,
                }}
            >
             
                {messages.length === 0 && (
                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            textAlign: 'center',
                            p: 2,
                            color: (theme) => theme.palette.text.secondary,
                            animation: `${fadeIn} 0.6s ease-out`,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1, color: (theme) => theme.palette.primary.main }}>
                            Chat with {character.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {character.description}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                            fontStyle: 'italic',
                            backgroundColor: (theme) => theme.palette.grey[100],
                            p: 2,
                            borderRadius: 2,
                            maxWidth: '80%'
                        }}>
                            Type a message below to start the conversation.
                        </Typography>
                        <Stack justifyContent="center" flexDirection="row">{resetButton}</Stack>
                        
                    </Box>
                    
                )}
                
                {messages.map((message) => {
                    if (message.isUser) {
                        return <UserMessage key={message.id} message={message} />;
                    }
                    return <BotMessage key={message.id} message={message} />;
                })}
                {isLoading && <PageLoadingSpinner />}
            </Box>
            <Box
                sx={{
                    p: 2,
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    gap: 1,
                }}
            >
                
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    multiline
                    maxRows={4}
                    inputRef={inputRef}
                />
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                >
                    Send
                </Button>
                <Button
                    variant="outlined"
                    onClick={clearMessages}
                    sx={{ ml: 1 }}
                >
                    Clear Chat
                </Button>
                {lastMessage && !lastMessage.isUser && (
                    <Button
                        variant="outlined"
                        onClick={handleRetry}
                        disabled={isLoading}
                        startIcon={<Autorenew />}
                    >
                        Retry
                    </Button>
                )}
            </Box>
            
            {messages.length > 0 && (
                <CharacterTruthMeter 
                    character={character} 
                    messages={messages} 
                    isStreamComplete={isStreamComplete}
                />
            )}
        </Box>
    );
};

export default CharacterChat;
