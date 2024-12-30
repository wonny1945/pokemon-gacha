import { create } from 'zustand';

type Language = 'ko' | 'en';

interface LanguageState {
  language: Language;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ko',
  toggleLanguage: () => set((state) => ({ 
    language: state.language === 'ko' ? 'en' : 'ko' 
  })),
})); 