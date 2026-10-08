/**
 * КАЛЕНДАРНЫЙ СВЕРХМОЗГ — МАТЕМАТИЧЕСКОЕ ЯДРО ВЫЧИСЛЕНИЙ
 * 
 * Чистая математическая модель быстрого ментального счёта дат:
 * - Циклический сброс семёрок (modulo 7)
 * - Оцифровка дней недели: 1 (Пн) .. 6 (Сб), 0 (Вс)
 * - Опорные ориентиры века с шагом 28 лет (0, 28, 56, 84)
 * - Обратный 400-летний цикл веков (6, 4, 2, 0)
 * - Фильтр високосности (только Январь и Февраль со сдвигом -1)
 *
 * Ядро полностью абстрагировано от языковых строк и локализации.
 */

export interface MonthCodePair {
  readonly code: number;
  readonly leapCode: number;
}

/**
 * Базовые математические коды 12 месяцев (обычный год и високосный).
 * Ритмический ключ: 033 · 614 · 625 · 035
 */
export const MONTH_BASE_CODES: ReadonlyArray<MonthCodePair> = Object.freeze([
  { code: 0, leapCode: 6 }, // Январь
  { code: 3, leapCode: 2 }, // Февраль
  { code: 3, leapCode: 3 }, // Март
  { code: 6, leapCode: 6 }, // Апрель
  { code: 1, leapCode: 1 }, // Май
  { code: 4, leapCode: 4 }, // Июнь
  { code: 6, leapCode: 6 }, // Июль
  { code: 2, leapCode: 2 }, // Август
  { code: 5, leapCode: 5 }, // Сентябрь
  { code: 0, leapCode: 0 }, // Октябрь
  { code: 3, leapCode: 3 }, // Ноябрь
  { code: 5, leapCode: 5 }, // Декабрь
]);

/**
 * Проверяет, является ли год високосным по григорианскому календарю.
 * Год високосный, если делится на 4 и не делится на 100, либо делится на 400.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Возвращает код столетия по 400-летнему циклу:
 * 1600-е: 6 | 1700-е: 4 | 1800-е: 2 | 1900-е: 0
 * 2000-е: 6 | 2100-е: 4 | 2200-е: 2 | 2300-е: 0
 */
export function getCenturyCode(year: number): number {
  const century = Math.floor(year / 100);
  const cycle = [6, 4, 2, 0];
  const offset = ((century - 16) % 4 + 4) % 4;
  return cycle[offset];
}

/**
 * Детальная информация о расчёте кода последних двух цифр года (YY).
 */
export interface YearCodeInfo {
  readonly yy: number;
  readonly baseAnchor: number;
  readonly rem: number;
  readonly leapsInRem: number;
  readonly remMod7: number;
  readonly yearCode: number;
}

/**
 * Вычисляет код года через 28-летние опорные ориентиры:
 * Ориентиры 28, 56, 84 кратны 28 и дают 0 сдвига дня недели.
 * Остаток rem + количество високосных в остатке (Math.floor(rem / 4)) по mod 7.
 */
export function getYearCode(year: number): YearCodeInfo {
  const yy = year % 100;
  let rem = yy;
  let baseAnchor = 0;

  if (yy >= 84) {
    rem = yy - 84;
    baseAnchor = 84;
  } else if (yy >= 56) {
    rem = yy - 56;
    baseAnchor = 56;
  } else if (yy >= 28) {
    rem = yy - 28;
    baseAnchor = 28;
  }

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

/**
 * Результат полного пошагового конвейера расчёта даты.
 */
export interface FullDateCalculation {
  readonly year: number;
  readonly monthIndex: number;
  readonly day: number;
  readonly isLeap: boolean;
  readonly dMod: number;
  readonly mCode: number;
  readonly cCode: number;
  readonly yInfo: YearCodeInfo;
  readonly step1Day: number;
  readonly step2Month: number;
  readonly step3Century: number;
  readonly weekdayCode: number;
}

/**
 * Выполняет полный пошаговый конвейер расчёта дня недели для даты:
 * Шаг 1: День mod 7
 * Шаг 2: (Шаг 1 + Код месяца) mod 7
 * Шаг 3: (Шаг 2 + Код века) mod 7
 * Шаг 4: (Шаг 3 + Код года) mod 7 = Итоговый код дня (1..6, 0)
 */
export function calculateFullDate(year: number, monthIndex: number, day: number): FullDateCalculation {
  const leap = isLeapYear(year);
  const monthData = MONTH_BASE_CODES[monthIndex];
  const mCode = leap ? monthData.leapCode : monthData.code;
  const cCode = getCenturyCode(year);
  const yInfo = getYearCode(year);
  const dMod = day % 7;

  // Потоковое сложение без промежуточных чисел больше 6
  const step1Day = dMod;
  const step2Month = (step1Day + mCode) % 7;
  const step3Century = (step2Month + cCode) % 7;
  const weekdayCode = (step3Century + yInfo.yearCode) % 7;

  return {
    year,
    monthIndex,
    day,
    isLeap: leap,
    dMod,
    mCode,
    cCode,
    yInfo,
    step1Day,
    step2Month,
    step3Century,
    weekdayCode
  };
}
