import {useCallback, useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import Character from '@/core/Character';
import Message from '@/core/Message';
import useCharacterChat from '@/components/hooks/useCharacterChat';
import useChatLog from '@/components/hooks/useChatLog';
import PageLoadingSpinner from '@/components/Loaders/PageLoadingSpinner';
import AppearingText from '@/components/util/AppearingText';
import useRateTruthfulness from '@/components/hooks/useRateTruthfulness';

type CharacterChatProps = {
  character: Character;
};

const CharacterChat = ({character}: CharacterChatProps) => {
  const [inputText, setInputText] = useState('');
  const [truthfulnessRating, setTruthfulnessRating] = useState<number>(0);
  const {messages, addBotMessage, addUserMessage} = useChatLog();
  const {isLoading} = useCharacterChat({
    character,
    messages,
    onSuccess: addBotMessage,
  });
  const {isLoading: isRateTruthfulnessLoading} = useRateTruthfulness({
    messages,
    character,
    onSuccess: useCallback((responseText) => {
      try {
        const truthfulnessRating = parseInt(responseText);
        setTruthfulnessRating(truthfulnessRating);
      } catch (e) {
        console.error('truthfulness rating is not a number', e);
      }
    }, []),
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
          if (!inputText) {
            return;
          }
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
      {isRateTruthfulnessLoading ? (
        <Box mt={2}>
          <Typography>Calculating truthfulness...</Typography>
        </Box>
      ) : (
        <>
          {truthfulnessRating === 0 && (
            <Box mt={2}>
              <Typography>
                The last statement was not rated for truthfulness.
              </Typography>
            </Box>
          )}
          {truthfulnessRating < 4 && (
            <Box mt={2}>
              <Typography>
                The last thing the AI was rated {truthfulnessRating}/5 for
                truthfulness.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CharacterChat;
