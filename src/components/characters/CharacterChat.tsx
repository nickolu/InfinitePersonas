import {useCallback, useEffect, useState} from 'react';
import {Box, Button, TextField, Theme, Typography} from '@mui/material';
import Character from '@/core/Character';
import Message from '@/core/Message';
import useCharacterChat from '@/components/hooks/useCharacterChat';
import useStreamingChat from '@/components/hooks/useStreamingChat';
import useChatLog from '@/components/hooks/useChatLog';
import PageLoadingSpinner from '@/components/Loaders/PageLoadingSpinner';
import StreamingText from '@/components/util/StreamingText';
import {Autorenew} from '@mui/icons-material';
import CharacterTruthMeter from './CharacterTruthMeter';

type CharacterChatProps = {
    character: Character;
    children: React.ReactNode;
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
                    <StreamingText>{message.text}</StreamingText>
                </Typography>
            </Box>
        ) : null
    );
};

const CharacterChat = ({character, children}: CharacterChatProps) => {
    const [inputText, setInputText] = useState('');
    const [streamingText, setStreamingText] = useState('');
    const [isStreamComplete, setIsStreamComplete] = useState(true);
    
    const {messages, addBotMessage, addUserMessage, removeLastMessage, updateLastBotMessage} =
        useChatLog();
    
    // Legacy chat hook for fallback
    const {isLoading: isLegacyLoading, generateResponse: generateLegacyResponse} = useCharacterChat({
        character,
        messages,
        onSuccess: addBotMessage,
    });
    
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
            console.error('Streaming error:', error);
            // Fall back to non-streaming approach
            generateLegacyResponse();
        }
    });
    
    const isLoading = isLegacyLoading || isStreaming;
    
    const lastTwoMessages = messages.slice(-2);
    const lastMessage = lastTwoMessages[1];
    const secondToLastMessage = lastTwoMessages[0];

    // Load welcome message when component mounts
    useEffect(() => {
        if (character && messages.length === 0) {
            // Add an empty bot message that will be filled with streaming content
            addBotMessage('');
            setStreamingText('');
            setIsStreamComplete(false);
            generateStreamingResponse();
        }
    }, [character, messages.length, addBotMessage, generateStreamingResponse, isStreaming]);
    
    useEffect(() => {
        if (lastMessage && lastMessage.isUser) {
            // Add an empty bot message that will be filled with streaming content
            addBotMessage('');
            setStreamingText('');
            setIsStreamComplete(false);
            generateStreamingResponse();
        }
    }, [lastMessage?.id, addBotMessage, generateStreamingResponse, lastMessage]);

    const handleSendMessage = useCallback(() => {
        if (inputText.trim() && !isLoading) {
            addUserMessage(inputText);
            setInputText('');
        }
    }, [addUserMessage, inputText, isLoading]);

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
                {children}
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
                />
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                >
                    Send
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
            <CharacterTruthMeter 
                character={character} 
                messages={messages} 
                isStreamComplete={isStreamComplete}
            />
        </Box>
    );
};

export default CharacterChat;
