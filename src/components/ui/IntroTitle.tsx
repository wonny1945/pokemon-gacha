'use client'

import {Bangers} from 'next/font/google'
import {useEffect, useRef} from 'react'

const bangers = Bangers({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})

export default function IntroTitle() {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        const updateSvgSize = () => {
            if (svgRef.current) {
                const container = svgRef.current.parentElement
                if (container) {
                    svgRef.current.setAttribute('width', `${container.clientWidth}`)
                    svgRef.current.setAttribute('height', `${container.clientHeight}`)
                }
            }
        }

        updateSvgSize()
        window.addEventListener('resize', updateSvgSize)

        return () => {
            window.removeEventListener('resize', updateSvgSize)
        }
    }, [])

    return (
        <div className={`${bangers.className} relative text-center`}>
            <svg ref={svgRef} className="absolute inset-0 z-[-1] pointer-events-none" aria-hidden="true">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

            </svg>
            <h1 className="relative z-10">
                <span className="block text-7xl md:text-8xl text-yellow-400 [text-shadow:_5px_5px_0_#3B82F6,_10px_10px_0_#1D4ED8] transform hover:scale-105 transition-transform">
                Draw cards 
                </span>
                <span className="block text-4xl md:text-6xl text-red-500 mt-3 [text-shadow:_4px_4px_0_#3B82F6,_8px_8px_0_#1D4ED8] transform hover:scale-105 transition-transform">
                    Find legendary Pokemon
                </span>
            </h1>
        </div>
    )
}