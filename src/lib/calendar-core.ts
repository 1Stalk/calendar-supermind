/**
 * КАЛЕНДАРНЫЙ СВЕРХМОЗГ — МАТЕМАТИЧЕСКОЕ ЯДРО ВЫЧИСЛЕНИЙ
 * Методика счёта дат без сложной арифметики:
 * Оцифровка 1..6, 0 (Воскресенье)
 * Сброс семёрок (mod 7)
 * Опорные ориентиры года: 0, 28, 56, 84
 * Коды веков: обратный отсчёт (6, 4, 2, 0)
 * Високосный фильтр: только Янв (-1) и Фев (-1)
 */

export interface MonthInfo {
  name: string;
  code: number;
  leapCode: number;
  story: string;
}

export const MONTH_DATA: MonthInfo[] = [
  { name: 'Январь', code: 0, leapCode: 6, story: 'Начало года, чистый лист, старт с нуля.' },
  { name: 'Февраль', code: 3, leapCode: 2, story: '3 согласных в начале («Фев»), самое короткое трио.' },
  { name: 'Март', code: 3, leapCode: 3, story: '3-й месяц года, весенний старт.' },
  { name: 'Апрель', code: 6, leapCode: 6, story: '«Апрель — шестёрка и капель» (рифма на «-ль»).' },
  { name: 'Май', code: 1, leapCode: 1, story: '1 Мая! Праздник, один флаг в руке.' },
  { name: 'Июнь', code: 4, leapCode: 4, story: 'В слове «И-Ю-Н-Ь» ровно 4 буквы.' },
  { name: 'Июль', code: 6, leapCode: 6, story: 'На «-ль», как апрель. Макушка лета, жара на все 6 баллов.' },
  { name: 'Август', code: 2, leapCode: 2, story: 'У заглавной буквы «А» 2 ноги. Арбуз режем на 2 части.' },
  { name: 'Сентябрь', code: 5, leapCode: 5, story: '1 Сентября! Школьники идут за пятёрками.' },
  { name: 'Октябрь', code: 0, leapCode: 0, story: 'Первая буква — круглая «О», как 0.' },
  { name: 'Ноябрь', code: 3, leapCode: 3, story: 'В слове «Но-я-брь» ровно 3 слога.' },
  { name: 'Декабрь', code: 5, leapCode: 5, story: '5-конечная звезда на новогодней ёлке! Финал на пятёрку.' },
];

export const WEEKDAY_NAMES: Record<number, string> = {
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
  0: 'Воскресенье'
};

export const WEEKDAY_SHORT_NAMES: Record<number, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  0: 'Вс'
};

export const CENTURY_CODES: Record<number, { code: number; desc: string }> = {
  16: { code: 6, desc: '1600-е годы' },
  17: { code: 4, desc: '1700-е годы' },
  18: { code: 2, desc: '1800-е годы' },
  19: { code: 0, desc: '1900-е годы' },
  20: { code: 6, desc: '2000-е годы' },
  21: { code: 4, desc: '2100-е годы' },
  22: { code: 2, desc: '2200-е годы' },
  23: { code: 0, desc: '2300-е годы' },
};

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getCenturyCode(year: number): number {
  const century = Math.floor(year / 100);
  return [6, 4, 2, 0][((century - 16) % 4 + 4) % 4];
}

export interface YearCodeInfo {
  yy: number;
  baseAnchor: number;
  rem: number;
  leapsInRem: number;
  remMod7: number;
  yearCode: number;
}

export function getYearCode(year: number): YearCodeInfo {
  const yy = year % 100;
  let rem = yy;
  let baseAnchor = 0;
  if (yy >= 84) { rem = yy - 84; baseAnchor = 84; }
  else if (yy >= 56) { rem = yy - 56; baseAnchor = 56; }
  else if (yy >= 28) { rem = yy - 28; baseAnchor = 28; }

  const leapsInRem = Math.floor(rem / 4);
  const remMod7 = rem % 7;
  const yearCode = (rem + leapsInRem) % 7;

  return {
    yy,
    baseAnchor,
    rem,
    leapsInRem,
    remMod7,
    yearCode
  };
}

export interface FullDateCalculation {
  year: number;
  monthIndex: number;
  monthName: string;
  day: number;
  isLeap: boolean;
  dMod: number;
  mCode: number;
  cCode: number;
  yInfo: YearCodeInfo;
  step1Day: number;
  step2Month: number;
  step3Century: number;
  weekdayCode: number;
  weekdayName: string;
}

export function calculateFullDate(year: number, monthIndex: number, day: number): FullDateCalculation {
  const leap = isLeapYear(year);
  const mInfo = MONTH_DATA[monthIndex];
  const mCode = leap ? mInfo.leapCode : mInfo.code;
  const cCode = getCenturyCode(year);
  const yInfo = getYearCode(year);
  const dMod = day % 7;

  // Потоковое сложение без чисел больше 6
  const step1Day = dMod;
  const step2Month = (step1Day + mCode) % 7;
  const step3Century = (step2Month + cCode) % 7;
  const step4Final = (step3Century + yInfo.yearCode) % 7;

  return {
    year,
    monthIndex,
    monthName: mInfo.name,
    day,
    isLeap: leap,
    dMod,
    mCode,
    cCode,
    yInfo,
    step1Day,
    step2Month,
    step3Century,
    weekdayCode: step4Final,
    weekdayName: WEEKDAY_NAMES[step4Final]
  };
}

export function formatMonthGenitive(monthName: string): string {
  const map: Record<string, string> = {
    'Январь': 'января',
    'Февраль': 'февраля',
    'Март': 'марта',
    'Апрель': 'апреля',
    'Май': 'мая',
    'Июнь': 'июня',
    'Июль': 'июля',
    'Август': 'августа',
    'Сентябрь': 'сентября',
    'Октябрь': 'октября',
    'Ноябрь': 'ноября',
    'Декабрь': 'декабря'
  };
  return map[monthName] || monthName;
}
