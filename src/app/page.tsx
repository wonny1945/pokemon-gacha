'use client'
import Scene from '/src/components/3dObject/Scene'
import PokemonTitle from '@/components/ui/pokemonTitle'
import StartButton from '@/components/ui/startButton'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-full items-center justify-center md:pt-0">
      <PokemonTitle/>
      <Scene/>
      <StartButton/>
    </main>
  )
}