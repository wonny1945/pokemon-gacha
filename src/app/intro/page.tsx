'use client'
import React from 'react';
import PokemonCard from '@/components/ui/PokemonCard';
import IntroTitle from '@/components/ui/IntroTitle';
import StartButton from '@/components/ui/startButton'


export default function IntroPage() {
  return (
    <main className="flex flex-col w-full min-h-screen items-center pt-10 md:pt-40 gap-10">
      <IntroTitle />
      <PokemonCard />
      <StartButton />
    </main>
  )
}