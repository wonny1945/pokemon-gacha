'use client'
import React, { useEffect, useState, useRef } from 'react';
import { getRandomPokemon } from '@/api/pokemonApi';
import Image from 'next/image';

export type PokemonRarity = 'legendary' | 'rare' | 'common' | 'all';

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

interface Pokemon {
  imageUrl: string;
  koreanName: string;
  types: string[];
  description: string;
  rarity: PokemonRarity;
}

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

  return type === 'card' 
    ? {
        ...baseStyle,
        boxShadow: `0 0 35px ${gradient.shadow}`,
        ...(effectiveRarity === 'rare' && {
          border: '4px solid rgba(255, 215, 0, 0.5)',
        }),
      }
    : {
        ...baseStyle,
        boxShadow: `inset 0 0 30px ${gradient.shadow}, 0 0 20px ${gradient.shadow}`,
      };
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

export default function PokemonCard() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const tutorialSteps = [
    {
      target: "legendary-btn",
      content: "✨ 와우! 전설의 포켓몬을 발견할 기회예요! (10%의 확률로 황금빛 카드가 등장합니다)",
      highlight: "from-amber-300"
    },
    {
      target: "rare-btn", 
      content: "🌟 희귀한 포켓몬과의 운명적인 만남! (20%의 확률로 신비로운 보라빛 카드가 나타납니다)",
      highlight: "from-purple-400"
    },
    {
      target: "common-btn",
      content: "🎯 평범해 보여도 특별한 인연이 될 수 있어요! (70%의 확률로 기본 카드가 등장합니다)",
      highlight: "from-gray-400"
    },
    {
      target: "pokemon-card",
      content: "🃏 카드를 자유롭게 움직여 포켓몬과 교감해보세요!",
      highlight: "from-blue-400"
    },
    {
      target: "start-btn",
      content: "🎮 준비가 되었다면 Let's Go 버튼을 눌러 게임을 시작해보세요!",
      highlight: "from-green-400"
    }
  ];

  const TutorialOverlay = () => {
    if (!showTutorial) return null;

    const currentStep = tutorialSteps[tutorialStep];
    const targetElement = document.getElementById(currentStep.target);
    const targetRect = targetElement?.getBoundingClientRect();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* 하이라이트 영역 */}
        {targetRect && (
          <div 
            className="absolute"
            style={{
              top: targetRect.top - 10,
              left: targetRect.left - 10,
              width: targetRect.width + 20,
              height: targetRect.height + 20,
              border: '2px solid white',
              borderRadius: '8px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              zIndex: 51
            }}
          />
        )}

        {/* 튜토리얼 메시지 */}
        <div 
          className="fixed bg-white rounded-lg p-4 max-w-xs w-full mx-4"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 52
          }}
        >
          <p className="text-gray-800 mb-4">{currentStep.content}</p>
          <div className="flex justify-between">
            <button
              onClick={() => setShowTutorial(false)}
              className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg"
            >
              건너뛰기
            </button>
            <button
              onClick={() => {
                if (tutorialStep < tutorialSteps.length - 1) {
                  setTutorialStep(prev => prev + 1);
                } else {
                  setShowTutorial(false);
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {tutorialStep === tutorialSteps.length - 1 ? '완료' : '다음'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    loadRandomPokemon();
  }, []);

  const loadRandomPokemon = async () => {
    try {
      setIsLoading(true);
      const data = await getRandomPokemon();
      setPokemon(data);
    } catch (error) {
      console.error('failed to load pokemon:', error);
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  const loadPokemon = async (rarity: PokemonRarity = 'all') => {
    try {
      setIsLoading(true);
      const data = await getRandomPokemon(rarity);
      setPokemon(data);
    } catch (error) {
      console.error('Failed to load pokemon:', error);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent">
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border-2 border-red-200">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-600 font-medium text-lg">failed to load pokemon</p>
        <p className="text-red-400 text-sm mt-2">Try again or send feedback to admin</p>
      </div>
    );
  }

  return (
    <>
      <TutorialOverlay />
      <style>{keyframes}</style>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2 mb-4">
            <button 
              id="legendary-btn"
              onClick={() => loadPokemon('legendary')}
              className={`
                bg-gradient-to-b from-amber-300 to-amber-400 
                px-4 py-2 text-amber-800 text-lg font-bold rounded-lg 
                border-b-4 border-amber-500 
                transition-all duration-100
                hover:bg-amber-500
                active:transform active:translate-y-1 
                active:border-b-2 active:shadow-inner
              `}
            >
              전설의 포켓몬
            </button>
            <button 
              id="rare-btn"
              onClick={() => loadPokemon('rare')}
              className={`
                bg-gradient-to-b from-purple-400 to-purple-500
                px-4 py-2 text-purple-800 text-lg font-bold rounded-lg 
                border-b-4 border-purple-600
                transition-all duration-100
                hover:bg-purple-600
                active:transform active:translate-y-1 
                active:border-b-2 active:shadow-inner
              `}
            >
              레어 포켓몬
            </button>
            <button 
              id="common-btn"
              onClick={() => loadPokemon('common')}
              className={`
                bg-gradient-to-b from-gray-400 to-gray-500
                px-4 py-2 text-gray-900 text-lg font-bold rounded-lg 
                border-b-4 border-gray-600
                transition-all duration-100
                hover:bg-gray-600
                active:transform active:translate-y-1 
                active:border-b-2 active:shadow-inner
              `}
            >
              일반 포켓몬
            </button>
          </div>
        </div>

        <div 
          ref={cardRef}
          id="pokemon-card"
          className="w-full max-w-xs relative rounded-2xl min-h-[450px]"
          style={{ 
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out',
            willChange: 'transform'
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
        >
          <div 
            className="w-full max-w-xs overflow-hidden transition-transform duration-200 ease-out relative p-0 rounded-2xl"
            style={{
              transformStyle: 'preserve-3d',
              ...getRarityStyle(pokemon?.rarity || 'common', 'card')
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
                  {pokemon?.rarity === 'legendary' ? '전설의 포켓몬' :
                   pokemon?.rarity === 'rare' ? '희귀 포켓몬' : 
                   '일반 포켓몬'}
                </span>
              </div>

              <div 
                className="mb-4 p-4 rounded-xl border border-gray-200 overflow-hidden relative z-10"
                style={{
                  ...getRarityStyle(pokemon?.rarity || 'common', 'container'),
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
    </>
  );
} 