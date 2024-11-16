'use client'
import Scene from '@/components/ 3dObject/Scene'
import PokemonTitle from '@/components/ui/pokemonTitle';
import StartButton from "@/components/ui/startButton";



export default function Home() {
  return (
      <main className="flex flex-col h-screen w-full items-center justify-center ">
         <PokemonTitle/>
          <Scene/>
          <StartButton/>
      </main>
  )
}