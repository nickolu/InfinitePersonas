import Character from '@/core/Character';
import {useState} from 'react';

type CharacterData = {
  [key: string]: Character;
};

type CharacterEntry = [string, Character];

type CharacterSortOption = {
  value: string;
  label: string;
};

export const sortOptions: CharacterSortOption[] = [
  {value: 'name', label: 'Name'},
  {value: 'category', label: 'Category'},
  {value: 'random', label: 'Random'},
];

function sortCharacters(
  sortBy: string,
  characters: CharacterData,
  reverse: boolean = false
) {
  let sortedCharacters = Object.entries(characters);

  sortOptions.forEach((option) => {
    if (sortBy === option.value) {
      if (option.value === 'random') {
        sortedCharacters = sortedCharacters.sort(() => Math.random() - 0.5);
      } else {
        sortedCharacters = sortedCharacters.sort((a, b) =>
          a[1][sortBy as keyof Character].localeCompare(
            b[1][sortBy as keyof Character]
          )
        );
      }
    }
  });

  return sortedCharacters.reduce(
    (acc: Record<string, Character>, [key, value]: CharacterEntry) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
}

export default function useCharacterSort({
  characterData,
}: {
  characterData: CharacterData;
}) {
  const [sortBy, setSortBy] = useState<string>('name');
  const sortedCharacterData = sortCharacters(sortBy, characterData);

  return {
    sortBy,
    setSortBy,
    sortedCharacterData,
  };
}
