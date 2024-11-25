import {Button} from "@/components/ui/button"
import AboutDialog from "@/components/ui/aboutDialog"
import {Linkedin} from 'lucide-react';
import {Github} from 'lucide-react';


export default function Header() {
    const socialLinks = [
        {
            icon: Linkedin,
            href: "https://www.linkedin.com/in/%EC%A4%80%EC%9D%BC-%EC%9B%90-58975525b/",
            ariaLabel: "LinkedIn 프로필"
        },
        {
            icon: Github,
            href: "https://github.com/wonny1945",
            ariaLabel: "Github 프로필"
        }
    ];

    return (
        <header className="fixed top-2 w-full">
            <nav className="container mx-auto flex flex-row gap-3 justify-end px-2">
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
            </nav>
        </header>
    );
}


