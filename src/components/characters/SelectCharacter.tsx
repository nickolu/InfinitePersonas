import {useEffect, useRef, useState} from 'react';
import {Box, Button, Grid, TextField, Typography} from '@mui/material';
import Character from '@/core/Character';
import Tile from '@/components/ui/Tile';
import characterData from './characterData.json';
import CharacterTile from './CharacterTile';
import SelectableButtonGroup from '@/components/ui/SelectableButtonGroup';
import useCharacterSort, {
  sortOptions,
} from '@/components/hooks/useCharacterSort';

type SelectCharacterProps = {
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character) => void;
};

const SelectCharacter = ({
  selectedCharacter,
  setSelectedCharacter,
}: SelectCharacterProps) => {
  const [isCustomCharacterFormOpen, setIsCustomCharacterFormOpen] =
    useState(false);
  const [customCharacterName, setCustomCharacterName] = useState('');
  const [customCharacterDescription, setCustomCharacterDescription] =
    useState('');

  const {setSortBy, sortedCharacterData} = useCharacterSort({
    characterData,
  });

  return (
    <Box>
      <Typography variant="h1">Select Character</Typography>

      <Grid container spacing={1}>
        <Grid item sm={12}>
          {isCustomCharacterFormOpen ? (
            <Tile hoverColor="white">
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSelectedCharacter({
                    name: customCharacterName,
                    description: customCharacterDescription,
                    category: 'custom',
                  });
                }}
              >
                <TextField
                  id="custom-character-name"
                  label="Name"
                  variant="filled"
                  fullWidth
                  value={customCharacterName}
                  onChange={(e) => {
                    setCustomCharacterName(e.target.value);
                  }}
                />
                <TextField
                  id="custom-character-description"
                  label="Description"
                  variant="filled"
                  fullWidth
                  multiline
                  rows={4}
                  value={customCharacterDescription}
                  onChange={(e) => {
                    setCustomCharacterDescription(e.target.value);
                  }}
                />
                <Button type="submit">Chat</Button>
              </Box>
            </Tile>
          ) : (
            <CharacterTile
              onSelect={(character) => {
                setIsCustomCharacterFormOpen(true);
              }}
              character={{
                name: 'Custom Character',
                description: 'Chat with any character you can imagine!',
                category: 'custom',
              }}
            />
          )}
          <Box
            display="flex"
            justifyContent={'flex-end'}
            alignItems={'center'}
            mr={1}
          >
            Sort:{' '}
            <Box ml={1}>
              <SelectableButtonGroup
                options={sortOptions}
                onSelection={setSortBy}
              />
            </Box>
          </Box>
        </Grid>

        {Object.keys(sortedCharacterData).map((key: string) => {
          const character: Character = sortedCharacterData[key];
          return (
            <Grid item key={key} sm={4}>
              <CharacterTile
                key={character.name}
                onSelect={(character) => {
                  setSelectedCharacter(character);
                }}
                character={character}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SelectCharacter;
