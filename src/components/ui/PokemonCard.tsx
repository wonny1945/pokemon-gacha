'use client'
import React, { useState } from 'react';
import Image from 'next/image';

export default function PokemonCard() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-48 h-72 md:w-64 md:h-96 rounded-xl overflow-hidden shadow-xl transition-transform duration-300 ease-out"
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 opacity-75" />
      <Image
        src=""
        alt="Pokemon Card"
        layout="fill"
        objectFit="cover"
        className="transform transition-transform duration-300 ease-out hover:scale-110"
      />
      <div className="absolute inset-0 bg-white opacity-20 pointer-events-none" />
    </div>
  );
} 