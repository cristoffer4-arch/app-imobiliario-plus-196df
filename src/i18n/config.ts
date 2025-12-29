// i18n configuration for PT-PT (Portugal) and PT-BR (Brazil)

export type Locale = 'pt-PT' | 'pt-BR';

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const LOCALES: Record<Locale, { name: string; flag: string; currency: string; dateFormat: string }> = {
  'pt-PT': {
    name: 'Português (Portugal)',
    flag: '🇵🇹',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy'
  },
  'pt-BR': {
    name: 'Português (Brasil)',
    flag: '🇧🇷',
    currency: 'BRL',
    dateFormat: 'dd/MM/yyyy'
  }
};

export function getLocaleFromNavigator(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const navigatorLang = navigator.language || (navigator as any).userLanguage;
  
  if (navigatorLang?.startsWith('pt-PT')) return 'pt-PT';
  if (navigatorLang?.startsWith('pt-BR')) return 'pt-BR';
  if (navigatorLang?.startsWith('pt')) return DEFAULT_LOCALE;
  
  return DEFAULT_LOCALE;
}
