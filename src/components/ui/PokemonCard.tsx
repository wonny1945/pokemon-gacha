'use client'
import React, { useEffect, useState, useRef } from 'react';
import { getRandomPokemon } from '@/api/pokemonApi';
import Image from 'next/image';

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
}

export default function PokemonCard() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
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
    <div 
      ref={cardRef}
      className="w-80 bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-200 ease-out"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="p-4 bg-gray-100" style={{ transform: 'translateZ(20px)' }}>
        <Image
          src={pokemon.imageUrl}
          alt={pokemon.koreanName}
          width={300}
          height={300}
          className="w-full h-auto"
        />
      </div>
      
      <div className="p-4" style={{ transform: 'translateZ(30px)' }}>
        <h2 className="text-2xl font-bold mb-2">{pokemon.koreanName}</h2>
        <div className="flex gap-2 mb-3">
          {pokemon.types.map((type: string) => (
            <span
              key={type}
              className={`${typeColors[type] || 'bg-gray-500'} px-3 py-1 rounded-full text-white text-sm`}
            >
              {type}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm">{pokemon.description}</p>
      </div>
      
      <button
        onClick={loadRandomPokemon}
        className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition-colors"
        style={{ transform: 'translateZ(40px)' }}
      >
        다른 포켓몬 보기
      </button>
    </div>
  );
} 