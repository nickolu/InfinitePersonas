import {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import Character from '@/core/Character';
import Message from '@/core/Message';
import useCharacterChat from '@/components/hooks/useCharacterChat';
import useChatLog from '@/components/hooks/useChatLog';
import PageLoadingSpinner from '@/components/Loaders/PageLoadingSpinner';
import AppearingText from '@/components/util/AppearingText';
import useRateCharacterTruthfulness from '@/components/hooks/useRateCharacterTruthfulness';
import CharacterTruthMeter from './CharacterTruthMeter';

type CharacterChatProps = {
  character: Character;
};

const CharacterChat = ({character}: CharacterChatProps) => {
  const [inputText, setInputText] = useState('');
  const {messages, addBotMessage, addUserMessage} = useChatLog();
  const {isLoading} = useCharacterChat({
    character,
    messages,
    onSuccess: addBotMessage,
  });
  const lastMessage = messages[messages.length - 1];
  const {isLoading: isRateTruthfulnessLoading, truthfulnessRating} =
    useRateCharacterTruthfulness({
      message: lastMessage,
      character,
    });

  return (
    <Box>
      <Typography variant="h1">
        You are now chatting with {character.name}
      </Typography>
      <Typography>{character.description}</Typography>

      {messages && messages?.length > 0 && (
        <Box>
          {messages.map((message: Message) => {
            return (
              <Box key={message.id} className={message.isUser ? 'user' : 'bot'}>
                <Typography>
                  <AppearingText>{message.text}</AppearingText>
                </Typography>
              </Box>
            );
          })}
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
          <Box flexGrow={1} width="100%" pr={3}>
            <TextareaAutosize
              id="outlined-basic"
              style={{width: '100%', minHeight: '50px'}}
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              value={inputText}
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
