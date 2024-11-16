import {Button} from "@/components/ui/button"
import { BookText } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Github } from 'lucide-react';


export default function Header() {
    return (
        <header className="fixed top-0 w-full">
            <nav className="container mx-auto flex flex-row gap-2 py-2 px-2 justify-end ">
                <Button variant="outline" size="icon"
                        className="bg-gradient-to-b from-amber-300 to-amber-400 px-4 py-4
                  border-b-4 border-amber-500
                  active:translate-y-0.5
                  transition-all ">
                    <BookText className="text-slate-800 hover:text-slate-900"/>
                </Button>

                   <Button variant="outline" size="icon"
                        className="bg-gradient-to-b from-amber-300 to-amber-400 px-4 py-4
                  border-b-4 border-amber-500
                  active:translate-y-0.5
                  transition-all ">
                    <Linkedin className="text-slate-800 hover:text-slate-900"/>
                </Button>



                <Button variant="outline" size="icon"
                        className="bg-gradient-to-b from-amber-300 to-amber-400 px-4 py-4
                  border-b-4 border-amber-500
                  active:translate-y-0.5
                  transition-all ">
                    <Github className="text-slate-800 hover:text-slate-900"/>
                </Button>

            </nav>
        </header>
    )
}