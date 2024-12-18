'use client'
import React from 'react';
import PokemonCardIntro from '@/components/ui/PokemonCardIntro';
import IntroTitle from '@/components/ui/IntroTitle';
import StartButton from '@/components/ui/startButton'


export default function IntroPage() {
  return (
    <main className="flex flex-col w-full min-h-screen items-center pt-0 md:pt-10 gap-10">
       <div className="mt-5">
        <IntroTitle />
       </div>
      <PokemonCardIntro />
      <StartButton />
    </main>
  )
}