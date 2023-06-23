import {useCallback, useEffect, useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import Character from '@/core/Character';
import Message from '@/core/Message';
import useCharacterChat from '@/components/hooks/useCharacterChat';
import useChatLog from '@/components/hooks/useChatLog';
import PageLoadingSpinner from '@/components/Loaders/PageLoadingSpinner';
import AppearingText from '@/components/util/AppearingText';
import useRateCharacterTruthfulness from '@/components/hooks/useRateCharacterTruthfulness';
import CharacterTruthMeter from './CharacterTruthMeter';
import {Autorenew} from '@mui/icons-material';

type CharacterChatProps = {
  character: Character;
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

const CharacterChat = ({character}: CharacterChatProps) => {
  const [inputText, setInputText] = useState('');
  const {messages, addBotMessage, addUserMessage, removeLastMessage} =
    useChatLog();
  const {isLoading, generateResponse} = useCharacterChat({
    character,
    messages,
    onSuccess: addBotMessage,
  });
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (lastMessage && lastMessage.isUser) {
      generateResponse();
    }
  }, [lastMessage, generateResponse]);

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
              return <UserMessage key={message.id} message={message} />;
            }
            return <BotMessage key={message.id} message={message} />;
          })}
          {lastMessage && !lastMessage?.isUser && messages.length > 1 && (
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
        onSubmit={(e) => {
          e.preventDefault();
          if (isLoading) {
            return;
          }
          if (!inputText) {
            return;
          }
          addUserMessage(inputText);
          setInputText('');
        }}
      >
        <Box display="flex" mt={3}>
          <Box flexGrow={1} width="100%" pr={1}>
            <TextField
              id="character-chat-input"
              label="Message"
              variant="outlined"
              rows={4}
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              value={inputText}
              fullWidth
            />
          </Box>
          <Button disabled={isLoading} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
      {lastMessage && !lastMessage?.isUser && (
        <CharacterTruthMeter
          message={messages[messages.length - 1]}
          character={character}
        />
      )}
    </Box>
  );
};

export default CharacterChat;
