'use client'
import Scene from '@/components/ 3dObject/Scene'
import PokemonTitle from '@/components/ui/pokemonTitle';
import {Button} from "@/components/ui/button";
import { Bangers } from 'next/font/google'


const bangers = Bangers({
 subsets: ['latin'],
 weight: '400'
})


export default function Home() {
  return (
      <main className="flex flex-col h-screen w-full items-center justify-center ">
         <PokemonTitle/>
          <Scene/>
          <Button variant={"outline"} className={`${bangers.className} bg-gradient-to-b from-amber-300 to-amber-400 px-10 py-5 text-xl rounded-lg border-b-4 border-amber-500 active:border-b-0 active:translate-y-1 transform transition-all`}>Let&apos;s Go</Button>
      </main>
  )
}