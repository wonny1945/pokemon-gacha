'use client'
import Scene from '@/components/3dObject/Scene'
import AnimatedTitle from '@/components/ui/AnimatedTitle'
import StartButton from '@/components/ui/startButton'

export default function Home() {
  return (
    <main className="flex flex-col w-full h-screen items-center md:pt-0">
      <div className="mt-5">
        <AnimatedTitle mainText="Pokemon" subText="Gacha" />
      </div>
      <Scene/>
      <StartButton text="Let's Go" href="/intro"/>
    </main>
  )
}