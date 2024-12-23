'use client'
import {Button} from "@/components/ui/button";
import {Bangers} from 'next/font/google'
import Link from 'next/link'

const bangers = Bangers({
    subsets: ['latin'],
    weight: '400'
})

interface StartButtonProps {
    text: string;
    href?: string;
    id?: string;
}

export default function StartButton({ text, href, id }: StartButtonProps) {
    const button = (
        <Button
            variant="outline"
            className={`
                ${bangers.className}
                bg-gradient-to-b from-amber-300 to-amber-400 
                px-10 py-5 text-2xl rounded-lg 
                border-b-4 border-amber-500 
                transition-all duration-1
                animate-bounce 
            `}>
            {text}
        </Button>
    );

    return (
        <div {...(id && { id })}>
            {href ? (
                <Link href={href}>{button}</Link>
            ) : (
                button
            )}
        </div>
    );
}