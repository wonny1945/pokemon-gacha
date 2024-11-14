'use client'
import Scene from '@/components/ 3dObject/Scene'
import PokemonTitle from '@/components/ui/pokemonTitle';


export default function Home() {
  return (
      <main className="flex flex-col h-screen w-full items-center justify-center ">
         <PokemonTitle/>
          <Scene/>
      </main>
  )
}