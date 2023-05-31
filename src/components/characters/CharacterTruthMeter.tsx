import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@mui/material';
import useRateCharacterTruthfulness from '@/components/hooks/useRateCharacterTruthfulness';
import Character from '@/core/Character';
import Message from '@/core/Message';

function getTruthfulnessColor(truthfulnessRating: number | null): {
  color: LinearProgressProps['color'];
  hexColor: string;
} {
  const colors = ['', 'error', 'warning', 'info', 'success', 'success'];
  const hexColors = ['', '#f44336', '#ff9800', '#2196f3', '#4caf50', '#4caf50'];

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

const TruthMeterContent = ({
  truthfulnessRating,
}: {
  truthfulnessRating: number;
}) => {
  if (Number(truthfulnessRating) === 0) {
    return (
      <Typography>
        The AI wasn&apos;t able to rate the truthfulness of the AI&apos;s last
        message. It&apos;s possible that the AI was confused or the message
        can&apos;t be rated for truthfulness.
      </Typography>
    );
  }

  return (
    <Box mt={2}>
      <Typography>
        The last message from the AI was rated {truthfulnessRating}/5 for
        truthfulness.
      </Typography>
    </Box>
  );
};

const CharacterTruthMeter = ({
  message,
  character,
}: {
  message: Message;
  character: Character;
}) => {
  const {truthfulnessRating, isLoading} = useRateCharacterTruthfulness({
    message,
    character,
  });

  return (
    <Box
      sx={{
        background: '#111',
        marginTop: '30px;',
        borderRadius: '20px;',
        padding: '20px;',
        color: '#fff',
        border:
          '2px solid ' + getTruthfulnessColor(truthfulnessRating).hexColor,
      }}
    >
      <Typography
        variant="h6"
        color={getTruthfulnessColor(truthfulnessRating).hexColor}
      >
        AI TruthMeter
      </Typography>
      {isLoading && (
        <Box position="absolute" width="100%" textAlign="center">
          <Typography variant="caption">Loading...</Typography>
        </Box>
      )}
      <TruthMeterContent truthfulnessRating={truthfulnessRating} />
      <Typography variant="body2">
        Warning: AI will lie to you. Even this meter could be wrong! It&apos;s
        important to make sure to verify information you get from AI sources.
      </Typography>
    </Box>
  );
};

export default CharacterTruthMeter;
