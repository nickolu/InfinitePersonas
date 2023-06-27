import Character from "@/core/Character";

export default function useCharacterFilter(
    characters: Character
) {
    function filterByCategory(category: string) {
        return Object.values(characters).filter(
            (character) => character.category === category
        );
    }
    function filterByNameRegex(input: string) {
        const regex = new RegExp(input, "gi");
        return Object.values(characters).filter((character) =>
            character.name.match(regex)
        );
    }
    return {
        filterByCategory,
        filterByNameRegex
    };
}
