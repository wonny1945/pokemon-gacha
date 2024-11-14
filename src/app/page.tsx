'use client'
import Scene from '@/components/ 3dObject/Scene'
import PokemonTitle from '@/components/ui/pokemonTitle';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"


export default function Home() {
  return (
      <main className="flex flex-col h-screen w-full items-center justify-center ">
         <PokemonTitle/>
          <Scene/>
      </main>
  )
}