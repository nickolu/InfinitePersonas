import {useCallback, useEffect, useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import Character from '@/core/Character';
import Message from '@/core/Message';
import useCharacterChat from '@/components/hooks/useCharacterChat';
import useChatLog from '@/components/hooks/useChatLog';
import PageLoadingSpinner from '@/components/Loaders/PageLoadingSpinner';
import AppearingText from '@/components/util/AppearingText';
import CharacterTruthMeter from './CharacterTruthMeter';
import {Autorenew} from '@mui/icons-material';

type CharacterChatProps = {
    character: Character;
    children: React.ReactNode;
};

const UserMessage = ({message}: {message: Message}) => {
    return (
        <Box className="user">
            <Typography>{message.text}</Typography>
        </Box>
    );
};

const BotMessage = ({message}: {message: Message}) => {
    return (
        <Box className="bot">
            <Typography>
                <AppearingText>{message.text}</AppearingText>
            </Typography>
        </Box>
    );
};

const CharacterChat = ({character, children}: CharacterChatProps) => {
    const [inputText, setInputText] = useState('');
    const {messages, addBotMessage, addUserMessage, removeLastMessage} =
        useChatLog();
    const {isLoading, generateResponse} = useCharacterChat({
        character,
        messages,
        onSuccess: addBotMessage,
    });
    
    const lastTwoMessages = messages.slice(-2);
    const lastMessage = lastTwoMessages[1];
    const secondToLastMessage = lastTwoMessages[0];

    useEffect(() => {
        if (lastMessage && lastMessage.isUser) {
            generateResponse();
        }
    }, [lastMessage, generateResponse]);

    const handleChatInput = useCallback(
        (e: {target: {value: string}}) => {
            setInputText(e.target.value);
        },
        [setInputText]
    );

    const handleSubmit = useCallback(
        (e: {preventDefault: () => void}) => {
            e.preventDefault();
            if (isLoading) {
                return;
            }
            if (!inputText) {
                return;
            }
            addUserMessage(inputText);
            setInputText('');
        },
        [isLoading, inputText, addUserMessage]
    );

    useEffect(()=>{
      console.log('lastMessage changed')
    }, [lastMessage])

    useEffect(()=>{
      console.log('secondToLastMessage changed')
    }, [secondToLastMessage])

    return (
        <Box>
            <Typography variant="h1">
                You are now chatting with {character.name}
            </Typography>
            <Typography>{character.description}</Typography>

            {messages && messages?.length > 0 && (
                <Box>
                    {messages.map((message: Message) => {
                        if (message.isUser) {
                            return (
                                <UserMessage
                                    key={message.id}
                                    message={message}
                                />
                            );
                        }
                        return (
                            <BotMessage key={message.id} message={message} />
                        );
                    })}
                    {lastMessage &&
                        !lastMessage?.isUser &&
                        messages.length > 1 && (
                            <Button
                                onClick={() => {
                                    removeLastMessage();
                                }}
                                sx={{
                                    padding: 0,
                                    minWidth: '44px',
                                    minHeight: '44px',
                                }}
                            >
                                <Autorenew />
                            </Button>
                        )}
                </Box>
            )}
            {isLoading && (
                <Box mt={3}>
                    <PageLoadingSpinner />
                </Box>
            )}
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Box display="flex" mt={3}>
                    <Box flexGrow={1} width="100%" pr={1}>
                        <TextField
                            id="character-chat-input"
                            label="Message"
                            variant="outlined"
                            rows={4}
                            onChange={handleChatInput}
                            value={inputText}
                            fullWidth
                        />
                    </Box>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        variant="contained"
                    >
                        Submit
                    </Button>
                </Box>
                {children}
            </Box>
            {lastMessage && !lastMessage?.isUser && (
                <CharacterTruthMeter
                    userMessage={secondToLastMessage}
                    botResponse={lastMessage}
                    character={character}
                />
            )}
        </Box>
    );
};

export default CharacterChat;
