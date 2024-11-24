import {Button} from "@/components/ui/button"
import AboutDialog from "@/components/ui/aboutDialog"
import {Linkedin} from 'lucide-react';
import {Github} from 'lucide-react';


export default function Header() {
    return (
        <header className="fixed top-2 w-full">
            <nav className="container mx-auto flex flex-row gap-3 justify-end px-2 ">
                <AboutDialog/>
                <Button variant="outline" size="icon"
                        className="bg-gradient-to-b from-amber-300 to-amber-400 px-5 py-5
                  border-b-4 border-amber-500
                    active:translate-y-0.5
                  transition-all
                  ">
                    <Linkedin className="text-slate-800 hover:text-slate-900"/>
                </Button>


                <Button variant="outline" size="icon"
                        className="bg-gradient-to-b from-amber-300 to-amber-400 px-5 py-5
                  border-b-4 border-amber-500
                  active:translate-y-0.5
                  transition-all ">
                    <Github className="text-slate-800 hover:text-slate-900"/>
                </Button>

            </nav>
        </header>
    )
}


