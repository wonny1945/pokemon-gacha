'use client'
import Scene from '@/components/3dObject/Scene'
import PokemonTitle from '@/components/ui/pokemonTitle'
import StartButton from '@/components/ui/startButton'

export default function Home() {
  return (
    <main className="flex flex-col w-full h-screen items-center md:pt-0">
      <div className="mt-5">
        <PokemonTitle />
      </div>
      <Scene/>
      <StartButton/>
    </main>
  )
}