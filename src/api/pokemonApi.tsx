// src/api/pokemonApi.ts
const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_COUNT = 898;

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  koreanName: string;
  description: string;
}

export async function getRandomPokemon(): Promise<PokemonData> {
  const randomId = Math.floor(Math.random() * POKEMON_COUNT) + 1;
  
  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`${POKEMON_API_BASE_URL}/pokemon/${randomId}`),
      fetch(`${POKEMON_API_BASE_URL}/pokemon-species/${randomId}`)
    ]);

    const pokemonData = await pokemonRes.json();
    const speciesData = await speciesRes.json();

    const koreanName = speciesData.names.find(
      (name: any) => name.language.name === 'ko'
    )?.name || pokemonData.name;

    const koreanDescription = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'ko'
    )?.flavor_text || '';

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types.map((type: any) => type.type.name),
      imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
      koreanName,
      description: koreanDescription.replace(/\n/g, ' ')
    };
  } catch (error) {
    throw new Error('failed to load pokemon');
  }
}