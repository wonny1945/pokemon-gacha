'use client'
import React from 'react';
import AnimatedTitle from '@/components/ui/AnimatedTitle';
import GatchaCard from '@/components/ui/GatchaCard';

export default function Page() {
  return (
    <main className="flex flex-col w-full min-h-screen items-center pt-0 md:pt-10 gap-10">
      <div className="mt-5">
        <AnimatedTitle 
          mainText="Test Your Luck!" 
          subText="Draw Your Destiny Card"
          mainTextSize="text-7xl md:text-8xl"
          subTextSize="text-4xl md:text-6xl"
        />
      </div>
      
      {/* 중앙 콘텐츠 영역 */}
      <div className="w-full max-w-4xl px-4">
        <GatchaCard isRandom={true} />
      </div>
      
      {/* 하단 콘텐츠 영역 */}
    </main>
  )
}