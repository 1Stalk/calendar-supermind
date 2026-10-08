import type { Lang, I18nDictionary, MonthTranslation } from './types';
import { ruDictionary } from './locales/ru';
import { enDictionary } from './locales/en';
import { formatTemplate } from './format';

export * from './types';
export * from './format';

export const DICTIONARY: Record<Lang, I18nDictionary> = {
  ru: ruDictionary,
  en: enDictionary
};

export function getDictionary(lang: Lang): I18nDictionary {
  return DICTIONARY[lang] || DICTIONARY.ru;
}

export function formatMonthNameForDisplay(monthIndex: number, lang: Lang): string {
  const dict = getDictionary(lang);
  return dict.months[monthIndex]?.name ?? '';
}

export function formatDateForDisplay(day: number, monthIndex: number, year: number, lang: Lang): string {
  const dict = getDictionary(lang);
  const monthName = dict.months[monthIndex]?.name ?? '';

  if (lang === 'en') {
    return `${monthName} ${day}, ${year}`;
  }

  // Для русского языка — родительный падеж
  const ruGenitiveMap: Readonly<Record<number, string>> = {
    0: 'января',
    1: 'февраля',
    2: 'марта',
    3: 'апреля',
    4: 'мая',
    5: 'июня',
    6: 'июля',
    7: 'августа',
    8: 'сентября',
    9: 'октября',
    10: 'ноября',
    11: 'декабря'
  };

  const genitiveMonth = ruGenitiveMap[monthIndex] || monthName;
  return `${day} ${genitiveMonth} ${year}`;
}
