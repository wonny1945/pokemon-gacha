'use client'
import React, { useState, useRef, useEffect } from 'react';
import { getRandomPokemon, PokemonRarity, getPokemonById } from '@/api/pokemonApi';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import ShareButtons from '@/components/ui/ShareButtons';
import { Bangers } from 'next/font/google'
import { useLanguageStore } from '@/store/languageStore';


const bangers = Bangers({
  weight: '400',
  subsets: ['latin']
})

interface IGatchaCardProps {
  isRandom: boolean;
}

interface Pokemon {
  imageUrl: string;
  koreanName: string;
  types: string[];
  description: string;
  rarity: PokemonRarity;
  id: number;
}

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

const RARITY_GRADIENTS: Record<Exclude<PokemonRarity, 'all'>, {
  colors: string[];
  shadow: string;
}> = {
  legendary: {
    colors: ['#FFD700', '#FDB931', '#FFE45C', '#FDB931', '#FFD700'],
    shadow: 'rgba(255, 215, 0, 0.8)',
  },
  rare: {
    colors: ['#9333EA', '#A855F7', '#C084FC', '#A855F7', '#9333EA'],
    shadow: 'rgba(147, 51, 234, 0.8)',
  },
  common: {
    colors: ['#f9fafb', '#f3f4f6'],
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

const getRarityStyle = (rarity: PokemonRarity, type: 'card' | 'container') => {
  const effectiveRarity = rarity === 'all' ? 'common' : rarity;
  const gradient = RARITY_GRADIENTS[effectiveRarity];
  
  if (effectiveRarity === 'common') {
    return {
      background: `linear-gradient(to bottom, ${gradient.colors.join(', ')})`,
      boxShadow: `inset 0 0 5px ${gradient.shadow}`,
    };
  }

  const baseStyle = {
    background: `
      linear-gradient(
        125deg,
        ${gradient.colors.map((color, i) => `${color} ${i * 25}%`).join(', ')}
      )
    `,
    backgroundSize: '400% 400%',
    animation: `${type === 'card' ? 'shimmer' : 'shimmerBg'} 5s ease-in-out infinite`,
  };

  if (type === 'card') {
    return {
      ...baseStyle,
      boxShadow: `0 0 35px ${gradient.shadow}`,
      ...(effectiveRarity === 'rare' && {
        border: '4px solid rgba(255, 215, 0, 0.5)',
      }),
    };
  }

  // container 타입일 경우
  return {
    ...baseStyle,
    boxShadow: `inset 0 0 30px ${gradient.shadow}, 0 0 20px ${gradient.shadow}`,
  };
};

const getCardStyle = (rarity: PokemonRarity) => getRarityStyle(rarity, 'card');
const getImageContainerStyle = (rarity: PokemonRarity) => getRarityStyle(rarity, 'container');

const shineEffect = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 100%)`,
  transform: 'translateX(-100%) translateY(-100%)',
  pointerEvents: 'none' as const,
};

const keyframes = `
  @keyframes shimmer {
    0% { background-position: 0% 0%; }
    25% { background-position: 100% 100%; }
    50% { background-position: 100% 0%; }
    75% { background-position: 0% 100%; }
    100% { background-position: 0% 0%; }
  }
  
  @keyframes shine {
    from { transform: translateX(-100%) translateY(-100%); }
    to { transform: translateX(100%) translateY(100%); }
  }

  @keyframes shimmerBg {
    0% { background-position: 0% 0%; }
    25% { background-position: 100% 100%; }
    50% { background-position: 100% 0%; }
    75% { background-position: 0% 100%; }
    100% { background-position: 0% 0%; }
  }
`;

const TRANSLATIONS = {
  ko: {
    legendary: '전설의 포켓몬',
    rare: '희귀 포켓몬',
    common: '일반 포켓몬',
    clickToDraw: '클릭하여 포켓몬을 뽑아보세요!',
    tryAgain: 'Try Again'
  },
  en: {
    legendary: 'Legendary Pokemon',
    rare: 'Rare Pokemon',
    common: 'Common Pokemon',
    clickToDraw: 'Click to draw a Pokemon!',
    tryAgain: 'Try Again'
  }
} as const;

export default function GatchaCard({ isRandom }: IGatchaCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguageStore();

  // 언어 변경 시 포켓몬 데이터 다시 로드
  useEffect(() => {
    const reloadPokemon = async () => {
      if (pokemon?.id) {
        try {
          setIsLoading(true);
          const data = await getPokemonById(pokemon.id, language);
          setPokemon(data);
        } catch (error) {
          console.error('Failed to reload pokemon:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    reloadPokemon();
  }, [language, pokemon?.id]);

  const handleCardClick = async () => {
    if (isLoading || isFlipped) return;
    try {
      setIsLoading(true);
      const randomPokemon = await getRandomPokemon(isRandom ? 'all' : 'common', language);
      setPokemon(randomPokemon);
      setIsFlipped(true);
    } catch (error) {
      console.error('Failed to fetch pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isFlipped) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / 20);
    const rotateY = (-(x - centerX) / 20);
    
    card.style.transition = 'transform 0.1s ease-out';
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    
    cardRef.current.style.transition = 'transform 0.5s ease-out';
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialTransform = card.style.transform;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      card.style.transform = `${initialTransform} translate(${deltaX}px, ${deltaY}px)`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTransitioning(true);
    setIsFlipped(false);
    
    setTimeout(() => {
      setPokemon(null);
      setIsTransitioning(false);
    }, 1000);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isFlipped) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / 20);
    const rotateY = (-(x - centerX) / 20);
    
    card.style.transition = 'transform 0.1s ease-out';
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  };

  const handleTouchStart = () => {
    if (!isFlipped) return;
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    if (!isFlipped) return;
    handleMouseLeave();
  };

  return (
    <div className="flex flex-col items-center gap-20 ">
      <style>{keyframes}</style>
      <div 
        ref={cardRef}
        className={`
          w-full max-w-xs relative rounded-2xl min-h-[450px]
          [transform-style:preserve-3d]
          hover:cursor-pointer
          touch-none
          ${isLoading ? 'animate-pulse pointer-events-none' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`
            relative w-full h-full text-center
            [transform-style:preserve-3d]
            transition-all duration-1000 ease-in-out
            ${isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}
          `}
        >
          {/* 카드 앞면 */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{
              transform: 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              opacity: isFlipped ? 0 : 1,
              transition: 'transform 1s, opacity 0.5s',
              pointerEvents: isFlipped ? 'none' : 'auto'
            }}
          >
            <div className="relative z-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 backdrop-blur-sm bg-opacity-80 shadow-inner before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_10%,transparent_20%)] before:bg-[length:10px_10px] flex items-center justify-center min-h-[450px]">
              <span className="text-white text-xl font-bold">
                {TRANSLATIONS[language].clickToDraw}
              </span>
            </div>
          </div>

          {/* 카드 뒷면 */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{
              transform: 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              opacity: isFlipped ? 1 : 0,
              transition: 'transform 1s, opacity 0.5s',
              pointerEvents: isFlipped ? 'auto' : 'none'
            }}
          >
            <div 
              className="w-full max-w-xs overflow-hidden transition-transform duration-200 ease-out relative p-0 rounded-2xl"
              style={{
                transformStyle: 'preserve-3d',
                ...getCardStyle(pokemon?.rarity || 'common')
              }}
            >
              <div 
                style={{
                  ...shineEffect,
                  borderRadius: '1rem',
                  animation: isHovered ? 'shine 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                }} 
              />
              
              <div 
                className="bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-xl p-4 backdrop-blur-sm bg-opacity-80 shadow-inner relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_10%,transparent_20%)] before:bg-[length:10px_10px]"
                style={{ transform: 'translateZ(20px)' }}
              >
                <div className="text-sm mb-2 font-bold z-10 relative text-left">
                  <span className={
                    pokemon?.rarity === 'legendary' ? 'text-amber-500' :
                    pokemon?.rarity === 'rare' ? 'text-purple-500' : 
                    'text-gray-500'
                  }>
                    {pokemon?.rarity === 'legendary' ? TRANSLATIONS[language].legendary :
                     pokemon?.rarity === 'rare' ? TRANSLATIONS[language].rare : 
                     TRANSLATIONS[language].common}
                  </span>
                </div>

                <div 
                  className="mb-4 p-4 rounded-xl border border-gray-200 overflow-hidden relative z-10"
                  style={{
                    ...getImageContainerStyle(pokemon?.rarity || 'common'),
                    transform: 'translateZ(10px)',
                  }}
                >
                  <div className="relative z-10 transform transition-transform duration-300">
                    <Image
                      src={pokemon?.imageUrl || ''}
                      alt={pokemon?.koreanName || ''}
                      width={300}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4 z-10 relative text-left">
                  <h2 className="text-xl font-bold mb-2">{pokemon?.koreanName}</h2>
                  <div className="flex gap-2 mb-3">
                    {pokemon?.types.map((type: string) => (
                      <span
                        key={type}
                        className={`${typeColors[type] || 'bg-gray-500'} px-3 py-1 rounded-full text-white text-sm`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{pokemon?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(isFlipped || isTransitioning) && (
        <div className="max-w-xs flex flex-col items-center">
          {/* Share Buttons */}
          {pokemon && (
            <ShareButtons 
              pokemonName={pokemon.koreanName} 
              cardRarity={pokemon.rarity}
            />
          )}
          
          {/* Try Again Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            className={`
              ${bangers.className}
              bg-gradient-to-b from-amber-300 to-amber-400 
              px-10 py-5 text-2xl rounded-lg 
              border-b-4 border-amber-500 
              transition-all duration-600
              animate-bounce
              mt-6
            `}
          >
            {TRANSLATIONS[language].tryAgain}
          </Button>
        </div>
      )}
    </div>
  );
} 

