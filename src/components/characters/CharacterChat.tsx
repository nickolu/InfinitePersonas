import {useEffect, useState} from 'react';
import {Character} from '../../core/Character';
import useCharacterChat from '../hooks/useCharacterChat';
import useChatLog from '../hooks/useChatLog';
import {Box, Button, TextField, Typography} from '@mui/material';
import PageLoadingSpinner from '../Loaders/PageLoadingSpinner';
import Message from '@/core/Message';
import AppearingText from '../util/AppearingText';

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
          addUserMessage(inputText);
          setInputText('');
        }}
      >
        <Box display="flex" mt={3}>
          <Box flexGrow={1} width="100%">
            <TextField
              id="outlined-basic"
              label="Message"
              variant="outlined"
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              value={inputText}
              fullWidth
            />
          </Box>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterChat;
