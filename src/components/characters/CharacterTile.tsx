import {Box, Paper, Typography} from '@mui/material';
import Character from '../../core/Character';
import Tile from '../ui/Tile';

type CharacterTileProps = {
  character: Character;
  onSelect: (character: Character) => void;
};

type CategoryColors = {
  [key: string]: string;
};

const categoryColors: CategoryColors = {
  custom: 'none',
  art: '#f191f1',
  leader: '#7b7bee',
  hero: '#76d5d5',
  fictional: '#e68080',
  science: '#e2e279',
};

const CharacterTile = ({character, onSelect}: CharacterTileProps) => {
  const categoryColor = categoryColors[character.category] || 'grey';
  return (
    <Tile
      onClick={() => onSelect(character)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `2px solid ${categoryColor}`,
      }}
    >
      <Box
        display="flex"
        flexGrow={1}
        height={'100%'}
        flexDirection={'column'}
        justifyContent={'space-between'}
        className={character.category}
        paddingRight={'8px'}
      >
        <Box>
          <Typography variant="h6">{character.name}</Typography>
          <Typography fontSize={'0.9rem'}>{character.description}</Typography>
        </Box>
      </Box>
    </Tile>
  );
};

export default CharacterTile;
