// src/api/pokemonApi.ts
import { useLanguageStore } from '../store/languageStore';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_COUNT = 386; // 3세대까지만 

// 전설의 포켓몬 ID 목록
const LEGENDARY_POKEMON_IDS = [
  144, 145, 146, 150, 151, // 1세대 전설
  243, 244, 245, 249, 250, 251, // 2세대 전설
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386 // 3세대 전설
];

// 레어 포켓몬 ID 목록
const RARE_POKEMON_IDS = [
  143, 149, // 1세대 레어
  201, 248, // 2세대 레어
  346, 373, 376, 334, 344, 365, // 3세대 레어
  359, 445, 635, 289, 306, 330 // 준전설급
];

export type PokemonRarity = 'legendary' | 'rare' | 'common' | 'all';

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  koreanName: string;
  description: string;
  rarity: PokemonRarity;
}

interface PokemonName {
  language: {
    name: string;
  };
  name: string;
}

interface FlavorTextEntry {
  language: {
    name: string;
  };
  flavor_text: string;
}

interface PokemonType {
  type: {
    name: string;
  };
}

// 설명 텍스트 정리를 위한 유틸리티 함수 추가
function cleanDescription(text: string): string {
  return text
    .replace(/\f/g, ' ')    // 폼피드 문자 제거
    .replace(/\u000c/g, ' ') // 유니코드 폼피드 문자 제거
    .replace(/\n/g, ' ')     // 줄바꿈 문자 제거
    .replace(/\r/g, ' ')     // 캐리지 리턴 제거
    .replace(/\x0c/g, ' ')   // 폼피드 문자 제거 (16진수)
    .replace(/\s+/g, ' ')    // 연속된 공백을 하나로 치환
    .trim();                 // 앞뒤 공백 제거
}

export async function getRandomPokemon(rarity: PokemonRarity = 'all'): Promise<PokemonData> {
  // 현재 선택된 언어 가져오기
  const currentLanguage = useLanguageStore.getState().language;
  
  let pokemonId: number;

  if (rarity === 'all') {
    const randomValue = Math.random();
    if (randomValue < 0.1) {
      rarity = 'legendary';
    } else if (randomValue < 0.3) {
      rarity = 'rare';
    } else {
      rarity = 'common';
    }
  }

  switch (rarity) {
    case 'legendary':
      pokemonId = LEGENDARY_POKEMON_IDS[Math.floor(Math.random() * LEGENDARY_POKEMON_IDS.length)];
      break;
    case 'rare':
      pokemonId = RARE_POKEMON_IDS[Math.floor(Math.random() * RARE_POKEMON_IDS.length)];
      break;
    case 'common':
      do {
        pokemonId = Math.floor(Math.random() * POKEMON_COUNT) + 1;
      } while (
        LEGENDARY_POKEMON_IDS.includes(pokemonId) || 
        RARE_POKEMON_IDS.includes(pokemonId)
      );
      break;
    default:
      pokemonId = Math.floor(Math.random() * POKEMON_COUNT) + 1;
  }

  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`${POKEMON_API_BASE_URL}/pokemon/${pokemonId}`),
      fetch(`${POKEMON_API_BASE_URL}/pokemon-species/${pokemonId}`)
    ]);

    const pokemonData = await pokemonRes.json();
    const speciesData = await speciesRes.json();

    // 언어에 따른 이름 선택
    const localizedName = speciesData.names.find(
      (name: PokemonName) => name.language.name === currentLanguage
    )?.name || pokemonData.name;

    // 언어에 따른 설명 선택
    const localizedDescription = speciesData.flavor_text_entries.find(
      (entry: FlavorTextEntry) => entry.language.name === currentLanguage
    )?.flavor_text || '';

    const rarityType = LEGENDARY_POKEMON_IDS.includes(pokemonId)
      ? 'legendary'
      : RARE_POKEMON_IDS.includes(pokemonId)
      ? 'rare'
      : 'common';

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types.map((type: PokemonType) => type.type.name),
      imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
      koreanName: localizedName,
      description: cleanDescription(localizedDescription),
      rarity: rarityType
    };
  } catch (error) {
    console.error('Failed to fetch pokemon:', error);
    throw new Error('Failed to fetch pokemon');
  }
}