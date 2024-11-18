'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {BookText} from 'lucide-react';
import {Press_Start_2P} from 'next/font/google'

const pixelFont = Press_Start_2P({
    weight: '400',
    subsets: ['latin']
})

export default function AboutDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"
                        className="bg-gradient-to-b from-amber-300 to-amber-400 px-5 py-5
                  border-b-4 border-amber-500
                  active:translate-y-0.5
                  transition-all ">
                    <BookText className="text-slate-800 hover:text-slate-900"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="text-sm">
                <DialogHeader>
                    <DialogTitle className={`${pixelFont.className} text-amber-500 font-bold`}>Welcome to Pokemon Card
                        Gacha!</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                    <p className={`${pixelFont.className}`}>
                        Hi there! I&apos;m <span className="text-amber-500 font-bold">Wonny</span>, a pragmatic
                        developer
                        passionate about creating interactive experiences.
                    </p>

                    <p className={`${pixelFont.className}`}>
                        This project, <span className="text-amber-500 font-bold">Pokemon Card Gacha</span>, is a
                        non-commercial educational endeavor built with
                        <span className="text-blue-500"> Next.js framework</span> and the <span
                        className="text-red-500">Pokemon API</span>.
                    </p>

                    <p className={`${pixelFont.className} `}>
                        Inspired by childhood memories of collecting Pokemon cards, I was particularly motivated by
                        discovering modern web technologies that enable creating
                        <span className="text-emerald-500"> interactive 3D card designs</span>.
                    </p>

                    <p className={`${pixelFont.className}`}>
                        To learn more about the developer, please visit my
                        <span className="text-gray-800 font-bold"> GitHub</span> and
                        <span className="text-blue-700 font-bold"> LinkedIn</span> profiles through the buttons in
                        the top right corner.
                    </p>

                    <p className={`${pixelFont.className} text-sm text-gray-600`}>
                        Note: This project is for educational purposes only and is not affiliated with or endorsed
                        by Pokemon Company.
                    </p>
            </DialogContent>

        </Dialog>
    )
}

