import Character from '@/core/Character';
import {useCallback, useState} from 'react';

type CharacterData = {
  [key: string]: Character;
};

type CharacterEntry = [string, Character];

type CharacterSortOption = {
  value: string;
  label: string;
};

export const sortOptions: Record<string, CharacterSortOption> = {
  name: {value: 'name', label: 'Name'},
  category: {value: 'category', label: 'Category'},
  random: {value: 'random', label: 'Random'},
}

function sortCharacters(
  sortBy: string,
  characters: CharacterData,
  reverse: boolean = false
) {
  let sortedCharacters = Object.entries(characters);

  const option = sortOptions[sortBy];
  if (option) {
    sortedCharacters = sortedCharacters.sort((a, b) => {
      if (option.value === 'random') {
        return Math.random() - 0.5;
      } else {
        return a[1][option.value as keyof Character].localeCompare(
          b[1][option.value as keyof Character]
        );
      }
    });
  }
  
  if (reverse) {
    sortedCharacters = sortedCharacters.reverse();
  }

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
  const [reverse, setReverse] = useState<boolean>(false);
  let sortedCharacterData = sortCharacters(sortBy, characterData, reverse);

  return {
    reverse,
    sortBy,
    setReverse,
    setSortBy,
    sortedCharacterData,
  };
}
