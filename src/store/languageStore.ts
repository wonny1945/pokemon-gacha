import { create } from 'zustand';

type Language = 'ko' | 'en';

interface LanguageState {
  language: Language;
  currentPokemonId: number | null;
  toggleLanguage: () => void;
  setCurrentPokemonId: (id: number | null) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ko',
  currentPokemonId: null,
  toggleLanguage: () => set((state) => ({ 
    language: state.language === 'ko' ? 'en' : 'ko' 
  })),
  setCurrentPokemonId: (id) => set({ currentPokemonId: id }),
})); 