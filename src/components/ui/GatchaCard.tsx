'use client'
import React, { useState, useRef } from 'react';
import { getRandomPokemon, PokemonRarity } from '@/api/pokemonApi';
import Image from 'next/image';

interface Pokemon {
    imageUrl: string;
    koreanName: string;
    types: string[];
    description: string;
    rarity: PokemonRarity;
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

const getRarityStyle = (rarity: PokemonRarity) => {
  switch (rarity) {
    case 'legendary':
      return {
        background: `
          linear-gradient(
            125deg, 
            #FFD700 0%, 
            #FDB931 25%, 
            #FFE45C 50%, 
            #FDB931 75%, 
            #FFD700 100%
          )
        `,
        backgroundSize: '400% 400%',
        animation: 'shimmer 3s ease-in-out infinite',
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
      };
    case 'rare':
      return {
        background: `
          linear-gradient(
            125deg,
            #9333EA 0%,
            #A855F7 25%,
            #C084FC 50%,
            #A855F7 75%,
            #9333EA 100%
          )
        `,
        backgroundSize: '400% 400%',
        animation: 'shimmer 3s ease-in-out infinite',
        boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
      };
    default:
      return {
        background: 'white',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      };
  }
};

const shineEffect = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `
    linear-gradient(
      90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.4) 45%,
      rgba(255, 255, 255, 0.7) 50%,
      rgba(255, 255, 255, 0.4) 55%,
      transparent 100%
    )
  `,
  transform: 'translateX(-100%) translateY(-100%)',
  pointerEvents: 'none' as const,
};


const getImageContainerStyle = (rarity: PokemonRarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          background: `
            linear-gradient(
              125deg,
              rgba(255, 215, 0, 0.3) 0%,
              rgba(255, 255, 255, 0.6) 25%,
              rgba(255, 223, 0, 0.5) 50%,
              rgba(255, 255, 255, 0.6) 75%,
              rgba(255, 215, 0, 0.3) 100%
            )
          `,
          backgroundSize: '400% 400%',
          animation: 'shimmerBg 5s ease-in-out infinite',
          boxShadow: `
            inset 0 0 30px rgba(255, 215, 0, 0.4),
            inset 0 0 60px rgba(255, 215, 0, 0.2),
            0 0 20px rgba(255, 215, 0, 0.2)
          `,
        };
      case 'rare':
        return {
          background: `
            linear-gradient(
              125deg,
              rgba(147, 51, 234, 0.3) 0%,
              rgba(255, 255, 255, 0.6) 25%,
              rgba(168, 85, 247, 0.5) 50%,
              rgba(255, 255, 255, 0.6) 75%,
              rgba(147, 51, 234, 0.3) 100%
            )
          `,
          backgroundSize: '400% 400%',
          animation: 'shimmerBg 5s ease-in-out infinite',
          boxShadow: `
            inset 0 0 30px rgba(147, 51, 234, 0.4),
            inset 0 0 60px rgba(147, 51, 234, 0.2),
            0 0 20px rgba(147, 51, 234, 0.2)
          `,
        };
      default:
        return {
          background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
          boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
        };
    }
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
      from {
        transform: translateX(-100%) translateY(-100%);
      }
      to {
        transform: translateX(100%) translateY(100%);
      }
    }
  
    @keyframes shimmerBg {
      0% { background-position: 0% 0%; }
      25% { background-position: 100% 100%; }
      50% { background-position: 100% 0%; }
      75% { background-position: 0% 100%; }
      100% { background-position: 0% 0%; }
    }
  `;

interface IGatchaCardProps {
  isRandom: boolean;
}

export default function GatchaCard({ isRandom }: IGatchaCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = async () => {
    if (isLoading || isFlipped) return;
    
    try {
      setIsLoading(true);
      const randomPokemon = await getRandomPokemon(isRandom ? 'all' : 'common');
      setPokemon(randomPokemon);
      setIsFlipped(true);
    } catch (error) {
      console.error('Failed to fetch pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = -(x - centerX) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="flex flex-col items-center gap-6 group ">
      <style>{keyframes}</style>
      
      <div 
        ref={cardRef}
        className={`
          w-full max-w-xs overflow-hidden transition-transform duration-=600 ease-out relative p-2 rounded-2xl transform-style-preserve-3d 

          ${isLoading ? 'animate-pulse pointer-events-none' : ''}
        
        `}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        style={{ 
          ...getRarityStyle(pokemon?.rarity || 'common'),
          transformStyle: 'preserve-3d',
        }}
      >
        {!isFlipped ? (
          // 카드 앞면 (무지 파란색)
          <div className="backface-hidden transition-transform duration-200 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 backdrop-blur-sm bg-opacity-80 shadow-inner relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_10%,transparent_20%)] before:bg-[length:10px_10px] flex items-center justify-center min-h-[450px]">
            <span className="text-white text-xl font-bold">포켓몬 카드를 클릭하세요!</span>
          </div>
        ) : (
          // 카드 뒷면 (기존 컨텐츠)
          <>
            <div className='backface-hidden rotate-y-180 transition-transform duration-200' style={{
              ...shineEffect,
              borderRadius: '1rem',
              animation: isHovered ? 'shine 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none', 
            }} />
            
            <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-xl p-4 backdrop-blur-sm bg-opacity-80 shadow-inner relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_10%,transparent_20%)] before:bg-[length:10px_10px]"
                style={{ transform: 'translateZ(20px)' }}>
              
              <div className="text-sm mb-2 font-bold z-10 relative">
                <span className={
                  pokemon?.rarity === 'legendary'
                    ? 'text-amber-500'
                    : pokemon?.rarity === 'rare'
                      ? 'text-purple-500'
                      : 'text-gray-500'
                }>
                  {pokemon?.rarity === 'legendary'
                    ? '전설의 포켓몬'
                    : pokemon?.rarity === 'rare'
                      ? '희귀 포켓몬'
                      : '일반 포켓몬'}
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
              
              <div className="mt-4 border-t border-gray-200 pt-4 z-10 relative">
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
          </>
        )}
      </div>

      {isFlipped && (
        <button
          onClick={() => {
            setIsFlipped(false);
            setPokemon(null);
          }}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          다시 뽑기
        </button>
      )}
    </div>
  );
} 