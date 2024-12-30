"use client"

import {Button} from "@/components/ui/button"
import AboutDialog from "@/components/ui/aboutDialog"
import {Github, User, Languages} from 'lucide-react';
import {useLanguageStore} from '@/store/languageStore';
import {getPokemonById} from '@/api/pokemonApi';
import {useEffect} from 'react';

export default function Header() {
    const {language, toggleLanguage, currentPokemonId} = useLanguageStore();

    useEffect(() => {
        const reloadCurrentPokemon = async () => {
            if (currentPokemonId) {
                try {
                    await getPokemonById(currentPokemonId, language);
                } catch (error) {
                    console.error('Failed to reload pokemon:', error);
                }
            }
        };

        reloadCurrentPokemon();
    }, [language, currentPokemonId]);

    const socialLinks = [
        {
            icon: User,
            href: "https://bento.me/wonny",
            ariaLabel: "개인 프로필"
        },
        {
            icon: Github,
            href: "https://github.com/wonny1945",
            ariaLabel: "Github 프로필"
        }
    ];

    return (
        <header className="top-2 w-full relative">
            <nav className="container mx-auto flex flex-row justify-end px-4">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleLanguage}
                        className="bg-gradient-to-b from-amber-300 to-amber-400 
                                 border-b-4 border-amber-500
                                 active:translate-y-0.5
                                 transition-all
                                 min-w-[90px]  px-5 py-5
                                 flex items-center justify-center gap-2"
                        aria-label="언어 변경"
                    >
                        <Languages className="text-slate-800 hover:text-slate-900"/>
                        <span className="font-bold">
                            {language.toUpperCase()}
                        </span>
                    </Button>
                    <AboutDialog/>
                    {socialLinks.map((social, index) => {
                        const Icon = social.icon;
                        return (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.ariaLabel}
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="bg-gradient-to-b from-amber-300 to-amber-400 px-5 py-5
                                             border-b-4 border-amber-500
                                             active:translate-y-0.5
                                             transition-all"
                                >
                                    <Icon className="text-slate-800 hover:text-slate-900"/>
                                </Button>
                            </a>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}


