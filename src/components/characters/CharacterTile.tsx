import {Box, Paper, Typography} from '@mui/material';
import Character from '../../core/Character';
import Tile from '../ui/Tile';

type CharacterTileProps = {
  character: Character;
  onSelect: (character: Character) => void;
};

const CharacterTile = ({character, onSelect}: CharacterTileProps) => {
  return (
    <Tile onClick={() => onSelect(character)}>
      <Typography variant="h6">{character.name}</Typography>
      <Typography fontSize={'0.9rem'}>{character.description}</Typography>
    </Tile>
  );
};

export default CharacterTile;
