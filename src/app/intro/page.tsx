'use client'
import React from 'react';
import PokemonCardIntro from '@/components/ui/pokemonCardIntro';
import AnimatedTitle from '@/components/ui/AnimatedTitle';
import StartButton from '@/components/ui/startButton'


export default function IntroPage() {
  return (
    <main className="flex flex-col w-full min-h-screen items-center pt-0 md:pt-10 gap-10">
       <div className="mt-5">
        <AnimatedTitle 
          mainText="Draw cards" 
          subText="Find legendary Pokemon"
          mainTextSize="text-7xl md:text-8xl"
          subTextSize="text-4xl md:text-6xl"
        />
       </div>
      <PokemonCardIntro />
      <StartButton id="start-btn" text="Let's Go" href="/gatchagame"/>
    </main>
  )
}