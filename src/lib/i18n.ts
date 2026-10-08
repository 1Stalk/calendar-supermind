/**
 * КАЛЕНДАРНЫЙ СВЕРХМОЗГ — МОДУЛЬ ИНТЕРНАЦИОНАЛИЗАЦИИ (i18n)
 * Полная поддержка русского и английского языков:
 * терминология, мнемоники месяцев, форматирование дат,
 * пошаговый конвейер и шпаргалка мастера дат.
 */

export type Lang = 'ru' | 'en';

export interface MonthTranslation {
  name: string;
  code: number;
  leapCode: number;
  story: string;
}

export interface I18nDictionary {
  // Общие элементы шапки и бренда
  brandTitle: string;
  brandSub: string;
  cheatSheetBtnTitle: string;
  cheatSheetBtnAria: string;
  soundBtnTitle: string;
  soundBtnAria: string;
  langBtnTitle: string;
  langBtnAria: string;

  // Статбар
  statStreak: string;
  statRecord: string;
  statSolved: string;
  statSpeed: string;
  timeUnit: string;

  // Навигация табов
  tabFinal: string;
  tabL1: string;
  tabL2: string;
  tabL3: string;
  tabL4: string;
  tabL5: string;

  // Общие кнопки
  btnHint: string;
  hintHide: string;
  hintShow: string;
  btnCorrect: string;
  btnWrong: string;

  // Главный симулятор (Финал)
  simDiffCurrentDecade: string;
  simDiffModern: string;
  simDiffHistory: string;
  simDiffLeapFocus: string;
  simCalendarSub: string;
  simLeapBadge: string;
  simLeapBadgeJanFeb: string;
  simBtnBreakdown: string;
  simBtnNextDate: string;
  simRecordTitle: string;
  simSuccessTitle: string;
  simSuccessBody: string;
  simFailTitle: string;
  simFailNormalBody: string;
  simFailLeapTrapBody: string;
  simBreakdownHeader: string;
  simStep1Title: string;
  simStep2Title: string;
  simStep2LeapTag: string;
  simStep2Calc: string;
  simStep3Title: string;
  simStep3Calc: string;
  simStep4Title: string;
  simStep4CalcAnchor: string;
  simStep4CalcFours: string;
  simStep5Title: string;

  // Дни недели
  weekdays: Record<number, string>;
  weekdaysShort: Record<number, string>;

  // Месяцы с мнемониками
  months: MonthTranslation[];

  // Уровень 1
  l1Title: string;
  l1Desc: string;
  l1PromptLabel: string;
  l1FeedbackCorrect: string;
  l1FeedbackWrong: string;

  // Уровень 2
  l2Title: string;
  l2Desc: string;
  l2PromptLabel: string;
  l2FeedbackCorrect: string;
  l2FeedbackWrongSmall: string;
  l2FeedbackWrongAnchor: string;

  // Уровень 3
  l3Title: string;
  l3Desc: string;
  l3RhythmicTitle: string;
  l3TabCards: string;
  l3TabQuiz: string;
  l3LeapToggle: string;
  l3PromptLabel: string;
  l3HintPrefix: string;
  l3FeedbackCorrect: string;
  l3FeedbackWrong: string;
  l3JanLeapName: string;
  l3JanLeapStory: string;
  l3FebLeapName: string;
  l3FebLeapStory: string;
  l3LeapTag: string;

  // Уровень 4
  l4Title: string;
  l4Desc: string;
  l4TabCode: string;
  l4TabLeap: string;
  l4CodePromptLabel: string;
  l4YearLabel: string;
  l4AnchorLabel: string;
  l4RemLabel: string;
  l4LeapsInRemLabel: string;
  l4FeedbackCorrectCode: string;
  l4FeedbackWrongCode: string;
  l4LeapPromptLabel: string;
  l4LeapRuleReminder: string;
  l4BtnLeap: string;
  l4BtnCommon: string;
  l4CenturyDiv400Leap: string;
  l4CenturyDiv400Common: string;
  l4EvenTensLeap: string;
  l4EvenTensCommon: string;
  l4OddTensLeap: string;
  l4OddTensCommon: string;

  // Уровень 5
  l5Title: string;
  l5Desc: string;
  l5PromptLabel: string;
  l5CenturyYears: string;
  l5FeedbackCorrect: string;
  l5FeedbackWrong: string;

  // Шпаргалка
  cheatTitle: string;
  cheatCloseAria: string;
  cheatSec1Title: string;
  cheatSec1Formula: string;
  cheatSec1NoteLabel: string;
  cheatSec1NoteText: string;
  cheatSec2Title: string;
  cheatSec3Title: string;
  cheatSec4Title: string;
  cheatSec4Text: string;
  cheatSec4Example: string;
  cheatSec5Title: string;
  cheatSec5Decade2000: string;
  cheatSec5Decade1900: string;
  cheatSec5Decade1800: string;
  cheatSec5Decade1700: string;
  cheatSec6Title: string;
  cheatSec6Note: string;
  cheatSec6RuleEven: string;
  cheatSec6RuleOdd: string;
  cheatSec6RuleCenturies: string;
}

export const DICTIONARY: Record<Lang, I18nDictionary> = {
  ru: {
    brandTitle: 'Календарный Сверхмозг',
    brandSub: 'Счёт дат в уме без калькулятора',
    cheatSheetBtnTitle: 'Шпаргалка',
    cheatSheetBtnAria: 'Открыть шпаргалку',
    soundBtnTitle: 'Звук',
    soundBtnAria: 'Переключить звук',
    langBtnTitle: 'Сменить язык (RU / EN)',
    langBtnAria: 'Переключить язык',

    statStreak: 'Серия',
    statRecord: 'Рекорд',
    statSolved: 'Решено',
    statSpeed: 'Скорость',
    timeUnit: 'с',

    tabFinal: 'Финал',
    tabL1: '1. Дни',
    tabL2: '2. Mod 7',
    tabL3: '3. Месяцы',
    tabL4: '4. Год',
    tabL5: '5. Века',

    btnHint: 'Подсказка',
    hintHide: 'Скрыть',
    hintShow: 'Показать',
    btnCorrect: 'Верно!',
    btnWrong: 'Ошибка!',

    simDiffCurrentDecade: '2020–2029 (Десятилетие)',
    simDiffModern: '1900–2099 (XX и XXI века)',
    simDiffHistory: '1600–2399 (Вся история)',
    simDiffLeapFocus: 'Ловушка 4%: Високосные Янв/Фев',
    simCalendarSub: 'Григорианский календарь',
    simLeapBadge: 'Високосный год',
    simLeapBadgeJanFeb: 'Високосный (Янв/Фев: -1 день)',
    simBtnBreakdown: 'Разбор шагов',
    simBtnNextDate: 'Следующая дата',
    simRecordTitle: 'Новый рекорд скорости: {time} с!',
    simSuccessTitle: 'Точно в цель! ({time} с)',
    simSuccessBody: '{weekday} — верный день недели.',
    simFailTitle: 'Не совпало!',
    simFailNormalBody: 'Правильный день: <strong>{weekday}</strong> (код {code}). Ниже приведён пошаговый разбор конвейера.',
    simFailLeapTrapBody: '<strong>Ловушка високосного года!</strong><br>Вы посчитали верно для обычного года, но {year} год — <strong>високосный</strong>!<br>Для Января и Февраля високосного года вычитаем 1 (Янв = 6, Фев = 2).<br>Верный день: <strong>{weekday}</strong> (код {code}).',
    simBreakdownHeader: 'Пошаговый конвейер расчёта:',
    simStep1Title: 'Число дня: {day}',
    simStep2Title: 'Месяц: {monthName}',
    simStep2LeapTag: '(високосный)',
    simStep2Calc: 'Код месяца: {mCode} | В памяти: ({dMod} + {mCode}) mod 7',
    simStep3Title: 'Век: {century}00-е годы',
    simStep3Calc: 'Код века: {cCode} | В памяти: ({step2} + {cCode}) mod 7',
    simStep4Title: 'Год: \'{yy} ({year} г.)',
    simStep4CalcAnchor: '{yy} - {anchor} = {rem} | ',
    simStep4CalcFours: 'четвёрок в {rem}: {leaps} | ({rem} + {leaps}) mod 7',
    simStep5Title: 'Финальный итог:',

    weekdays: {
      1: 'Понедельник',
      2: 'Вторник',
      3: 'Среда',
      4: 'Четверг',
      5: 'Пятница',
      6: 'Суббота',
      0: 'Воскресенье'
    },
    weekdaysShort: {
      1: 'Пн',
      2: 'Вт',
      3: 'Ср',
      4: 'Чт',
      5: 'Пт',
      6: 'Сб',
      0: 'Вс'
    },

    months: [
      { name: 'Январь', code: 0, leapCode: 6, story: 'Начало года, чистый лист, старт с нуля.' },
      { name: 'Февраль', code: 3, leapCode: 2, story: '3 согласных в начале («Фев»), самое короткое трио.' },
      { name: 'Март', code: 3, leapCode: 3, story: '3-й месяц года, весенний старт на 3.' },
      { name: 'Апрель', code: 6, leapCode: 6, story: '«Апрель — шестёрка и капель» (рифма на «-ль»).' },
      { name: 'Май', code: 1, leapCode: 1, story: '1 Мая! Праздник, один флаг в руке.' },
      { name: 'Июнь', code: 4, leapCode: 4, story: 'В слове «И-Ю-Н-Ь» ровно 4 буквы.' },
      { name: 'Июль', code: 6, leapCode: 6, story: 'На «-ль», как апрель. Макушка лета, жара на 6 баллов.' },
      { name: 'Август', code: 2, leapCode: 2, story: 'У заглавной буквы «А» 2 ноги. Арбуз режем на 2 части.' },
      { name: 'Сентябрь', code: 5, leapCode: 5, story: '1 Сентября! Школьники идут за пятёрками.' },
      { name: 'Октябрь', code: 0, leapCode: 0, story: 'Первая буква — круглая «О», как 0.' },
      { name: 'Ноябрь', code: 3, leapCode: 3, story: 'В слове «Но-я-брь» ровно 3 слога.' },
      { name: 'Декабрь', code: 5, leapCode: 5, story: '5-конечная звезда на новогодней ёлке! Финал на пятёрку.' },
    ],

    l1Title: 'Уровень 1: Дни и цифры',
    l1Desc: 'Мгновенный автоматизм: 1 = Пн ... 6 = Сб, 0 = Вс.',
    l1PromptLabel: 'Назовите цифру для дня:',
    l1FeedbackCorrect: 'Верно!',
    l1FeedbackWrong: 'Ошибка: {name} = {code}',

    l2Title: 'Уровень 2: Сброс семёрок',
    l2Desc: 'Вычитайте якорные воскресенья: 7, 14, 21, 28.',
    l2PromptLabel: 'Число месяца:',
    l2FeedbackCorrect: 'Точно!',
    l2FeedbackWrongSmall: 'число меньше 7, ответ — само число {num}',
    l2FeedbackWrongAnchor: 'вычитаем ближайший ориентир: {num} → {expected}',

    l3Title: 'Уровень 3: Мнемоника 12 месяцев',
    l3Desc: 'Коды месяцев через ассоциации и блиц-проверка.',
    l3RhythmicTitle: 'Ритмический ключ: 033 · 614 · 625 · 035',
    l3TabCards: 'Карточки',
    l3TabQuiz: 'Блиц-тест',
    l3LeapToggle: 'Учитывать високосные Янв/Фев',
    l3PromptLabel: 'Код месяца:',
    l3HintPrefix: 'Подсказка: ',
    l3FeedbackCorrect: 'Верно!',
    l3FeedbackWrong: 'Код: {name} → {code}',
    l3JanLeapName: 'Январь (високосный год)',
    l3JanLeapStory: 'В високосный год Январь = 6 (0 - 1 = 6)',
    l3FebLeapName: 'Февраль (високосный год)',
    l3FebLeapStory: 'В високосный год Февраль = 2 (3 - 1 = 2)',
    l3LeapTag: 'Висок:',

    l4Title: 'Уровень 4: Год и Високосность',
    l4Desc: 'Ориентиры: 28, 56, 84 дают 0 сдвига!',
    l4TabCode: 'Код года (00–99)',
    l4TabLeap: 'Тест високосности',
    l4CodePromptLabel: 'Год:',
    l4YearLabel: '\'{yy} год',
    l4AnchorLabel: 'Ориентир: ',
    l4RemLabel: 'Остаток: {yy} - {anchor} = ',
    l4LeapsInRemLabel: 'Четвёрок в остатке: ',
    l4FeedbackCorrectCode: 'Верно! Код года рассчитан точно.',
    l4FeedbackWrongCode: 'Ошибка: код \'{year} равен {code} ({rem} + {leaps} mod 7)',
    l4LeapPromptLabel: 'Является ли год високосным?',
    l4LeapRuleReminder: 'Чётный десяток → 0, 4, 8 | Нечётный → 2, 6 | Века: делятся на 400',
    l4BtnLeap: 'Високосный',
    l4BtnCommon: 'Обычный',
    l4CenturyDiv400Leap: '{year} делится на 400 → високосный',
    l4CenturyDiv400Common: '{year} не делится на 400 → обычный',
    l4EvenTensLeap: 'Десятки {tens} (чётные), последняя {last} → 0, 4 или 8 (високосный)',
    l4EvenTensCommon: 'Десятки {tens} (чётные), последняя {last} → не 0, 4, 8 (обычный)',
    l4OddTensLeap: 'Десятки {tens} (нечётные), последняя {last} → 2 или 6 (високосный)',
    l4OddTensCommon: 'Десятки {tens} (нечётные), последняя {last} → не 2 и не 6 (обычный)',

    l5Title: 'Уровень 5: Коды веков',
    l5Desc: '2000-е = 6 | 1900-е = 0 | 1800-е = 2 | 1700-е = 4',
    l5PromptLabel: 'Столетие:',
    l5CenturyYears: '{century}00-е годы',
    l5FeedbackCorrect: 'Верно!',
    l5FeedbackWrong: 'Ошибка: код {century}00-х равен {expected} (обратный отсчёт: 6, 4, 2, 0)',

    cheatTitle: 'Шпаргалка мастера дат',
    cheatCloseAria: 'Закрыть шпаргалку',
    cheatSec1Title: '1. Главная формула',
    cheatSec1Formula: 'День = (Число + Месяц + Век + Год) mod 7',
    cheatSec1NoteLabel: 'Правило сброса:',
    cheatSec1NoteText: 'как только сумма достигает ≥ 7, сразу сбрасывайте 7!',
    cheatSec2Title: '2. Оцифровка дней недели',
    cheatSec3Title: '3. Мнемонические коды месяцев',
    cheatSec4Title: '4. Код года: опорные 28, 56, 84',
    cheatSec4Text: 'Вычтите ориентир → прибавьте четвёрки в остатке → сбросьте семёрки.',
    cheatSec4Example: 'Пример 1897 г.: 97 - 84 = 13. Четвёрок: 3.<br />13 mod 7 = 6. Итог: (6 + 3) mod 7 = <strong>2</strong>!',
    cheatSec5Title: '5. Коды веков: обратный отсчёт',
    cheatSec5Decade2000: '2000-е: 6 (-1)',
    cheatSec5Decade1900: '1900-е: 0',
    cheatSec5Decade1800: '1800-е: 2',
    cheatSec5Decade1700: '1700-е: 4',
    cheatSec6Title: '6. Високосные годы (Ловушка 4% дат)',
    cheatSec6Note: 'Поправка нужна <strong>ТОЛЬКО для Января и Февраля</strong> (отнимите 1). Для остальных 10 месяцев високосность не важна!',
    cheatSec6RuleEven: '• <strong>Чётный десяток</strong>: конец на <strong>0, 4, 8</strong>',
    cheatSec6RuleOdd: '• <strong>Нечётный десяток</strong>: конец на <strong>2, 6</strong>',
    cheatSec6RuleCenturies: '• <strong>Века</strong>: 1600, 2000 — да; 1800, 1900 — нет'
  },

  en: {
    brandTitle: 'Calendar Supermind',
    brandSub: 'Mental date calculation without a calculator',
    cheatSheetBtnTitle: 'Cheat Sheet',
    cheatSheetBtnAria: 'Open cheat sheet',
    soundBtnTitle: 'Sound',
    soundBtnAria: 'Toggle sound',
    langBtnTitle: 'Switch language (EN / RU)',
    langBtnAria: 'Toggle language',

    statStreak: 'Streak',
    statRecord: 'Record',
    statSolved: 'Solved',
    statSpeed: 'Speed',
    timeUnit: 's',

    tabFinal: 'Final',
    tabL1: '1. Days',
    tabL2: '2. Mod 7',
    tabL3: '3. Months',
    tabL4: '4. Year',
    tabL5: '5. Centuries',

    btnHint: 'Hint',
    hintHide: 'Hide',
    hintShow: 'Show',
    btnCorrect: 'Correct!',
    btnWrong: 'Mistake!',

    simDiffCurrentDecade: '2020–2029 (Decade)',
    simDiffModern: '1900–2099 (20th & 21st Cent.)',
    simDiffHistory: '1600–2399 (All History)',
    simDiffLeapFocus: '4% Trap: Leap Jan / Feb',
    simCalendarSub: 'Gregorian Calendar',
    simLeapBadge: 'Leap Year',
    simLeapBadgeJanFeb: 'Leap Year (Jan/Feb: -1 day)',
    simBtnBreakdown: 'Breakdown',
    simBtnNextDate: 'Next Date',
    simRecordTitle: 'New speed record: {time} s!',
    simSuccessTitle: 'Bullseye! ({time} s)',
    simSuccessBody: '{weekday} is the correct day of the week.',
    simFailTitle: 'Not quite!',
    simFailNormalBody: 'Correct day: <strong>{weekday}</strong> (code {code}). Step-by-step pipeline below.',
    simFailLeapTrapBody: '<strong>Leap Year Trap!</strong><br>You calculated correctly for a regular year, but {year} is a <strong>leap year</strong>!<br>For January and February in a leap year, subtract 1 (Jan = 6, Feb = 2).<br>Correct day: <strong>{weekday}</strong> (code {code}).',
    simBreakdownHeader: 'Step-by-step calculation pipeline:',
    simStep1Title: 'Day of month: {day}',
    simStep2Title: 'Month: {monthName}',
    simStep2LeapTag: '(leap)',
    simStep2Calc: 'Month code: {mCode} | In memory: ({dMod} + {mCode}) mod 7',
    simStep3Title: 'Century: {century}00s',
    simStep3Calc: 'Century code: {cCode} | In memory: ({step2} + {cCode}) mod 7',
    simStep4Title: 'Year: \'{yy} ({year})',
    simStep4CalcAnchor: '{yy} - {anchor} = {rem} | ',
    simStep4CalcFours: 'fours in {rem}: {leaps} | ({rem} + {leaps}) mod 7',
    simStep5Title: 'Final result:',

    weekdays: {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
      0: 'Sunday'
    },
    weekdaysShort: {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
      0: 'Sun'
    },

    months: [
      { name: 'January', code: 0, leapCode: 6, story: 'Jan-Zero! Fresh start of the year, starts from 0.' },
      { name: 'February', code: 3, leapCode: 2, story: '3 letters in "F-E-B", the freezing winter trio.' },
      { name: 'March', code: 3, leapCode: 3, story: '3rd month of the year: "March 1-2-3 into spring!"' },
      { name: 'April', code: 6, leapCode: 6, story: '6 letters in S-P-R-I-N-G / April Fools FOOLED (6).' },
      { name: 'May', code: 1, leapCode: 1, story: 'May Day! May 1st, #1 worker, 1st bloom of spring.' },
      { name: 'June', code: 4, leapCode: 4, story: 'Exactly 4 letters in "J-U-N-E".' },
      { name: 'July', code: 6, leapCode: 6, story: 'Peak of summer heat: 6 letters in S-U-M-M-E-R.' },
      { name: 'August', code: 2, leapCode: 2, story: 'Capital "A" stands on 2 legs. Cut a melon in 2.' },
      { name: 'September', code: 5, leapCode: 5, story: 'Back to school: 5 school days & High-Fives!' },
      { name: 'October', code: 0, leapCode: 0, story: 'Big round "O" looks like a 0 (Oct-O-ber).' },
      { name: 'November', code: 3, leapCode: 3, story: '3 syllables: No-vem-ber (and 3 letters in N-O-V).' },
      { name: 'December', code: 5, leapCode: 5, story: '5-pointed star atop the Christmas tree! Year-end High-5.' },
    ],

    l1Title: 'Level 1: Days & Digits',
    l1Desc: 'Instant muscle memory: 1 = Mon ... 6 = Sat, 0 = Sun.',
    l1PromptLabel: 'Name the number for day:',
    l1FeedbackCorrect: 'Correct!',
    l1FeedbackWrong: 'Mistake: {name} = {code}',

    l2Title: 'Level 2: Modulo 7 Reset',
    l2Desc: 'Subtract anchor Sundays: 7, 14, 21, 28.',
    l2PromptLabel: 'Day of month:',
    l2FeedbackCorrect: 'Exact!',
    l2FeedbackWrongSmall: 'under 7, answer is the number itself {num}',
    l2FeedbackWrongAnchor: 'subtract closest anchor: {num} → {expected}',

    l3Title: 'Level 3: 12 Month Mnemonics',
    l3Desc: 'Month codes via vivid associations & blitz quiz.',
    l3RhythmicTitle: 'Rhythmic Key: 033 · 614 · 625 · 035',
    l3TabCards: 'Cards',
    l3TabQuiz: 'Blitz Quiz',
    l3LeapToggle: 'Include leap Jan / Feb',
    l3PromptLabel: 'Month code:',
    l3HintPrefix: 'Hint: ',
    l3FeedbackCorrect: 'Correct!',
    l3FeedbackWrong: 'Code: {name} → {code}',
    l3JanLeapName: 'January (leap year)',
    l3JanLeapStory: 'In a leap year, January = 6 (0 - 1 = 6)',
    l3FebLeapName: 'February (leap year)',
    l3FebLeapStory: 'In a leap year, February = 2 (3 - 1 = 2)',
    l3LeapTag: 'Leap:',

    l4Title: 'Level 4: Year Code & Leap Years',
    l4Desc: 'Anchors: 28, 56, 84 give 0 shift!',
    l4TabCode: 'Year code (00–99)',
    l4TabLeap: 'Leap year quiz',
    l4CodePromptLabel: 'Year:',
    l4YearLabel: 'Year \'{yy}',
    l4AnchorLabel: 'Anchor: ',
    l4RemLabel: 'Remainder: {yy} - {anchor} = ',
    l4LeapsInRemLabel: 'Fours in remainder: ',
    l4FeedbackCorrectCode: 'Correct! Year code calculated accurately.',
    l4FeedbackWrongCode: 'Mistake: code for \'{year} is {code} ({rem} + {leaps} mod 7)',
    l4LeapPromptLabel: 'Is this a leap year?',
    l4LeapRuleReminder: 'Even tens → 0, 4, 8 | Odd tens → 2, 6 | Centuries: divisible by 400',
    l4BtnLeap: 'Leap Year',
    l4BtnCommon: 'Common Year',
    l4CenturyDiv400Leap: '{year} is divisible by 400 → leap year',
    l4CenturyDiv400Common: '{year} is not divisible by 400 → common year',
    l4EvenTensLeap: 'Tens {tens} (even), last digit {last} → 0, 4, or 8 (leap year)',
    l4EvenTensCommon: 'Tens {tens} (even), last digit {last} → not 0, 4, 8 (common year)',
    l4OddTensLeap: 'Tens {tens} (odd), last digit {last} → 2 or 6 (leap year)',
    l4OddTensCommon: 'Tens {tens} (odd), last digit {last} → not 2 or 6 (common year)',

    l5Title: 'Level 5: Century Codes',
    l5Desc: '2000s = 6 | 1900s = 0 | 1800s = 2 | 1700s = 4',
    l5PromptLabel: 'Century:',
    l5CenturyYears: '{century}00s',
    l5FeedbackCorrect: 'Correct!',
    l5FeedbackWrong: 'Mistake: code for {century}00s is {expected} (countdown: 6, 4, 2, 0)',

    cheatTitle: 'Calendar Master Cheat Sheet',
    cheatCloseAria: 'Close cheat sheet',
    cheatSec1Title: '1. Master Formula',
    cheatSec1Formula: 'Day = (Date + Month + Century + Year) mod 7',
    cheatSec1NoteLabel: 'Reset rule:',
    cheatSec1NoteText: 'as soon as running sum reaches ≥ 7, cast out 7 immediately!',
    cheatSec2Title: '2. Weekday Numbers',
    cheatSec3Title: '3. Month Mnemonic Codes',
    cheatSec4Title: '4. Year Code: Anchors 28, 56, 84',
    cheatSec4Text: 'Subtract anchor → add leap fours in remainder → drop sevens.',
    cheatSec4Example: 'Example 1897: 97 - 84 = 13. Fours: 3.<br />13 mod 7 = 6. Result: (6 + 3) mod 7 = <strong>2</strong>!',
    cheatSec5Title: '5. Century Codes: Countdown',
    cheatSec5Decade2000: '2000s: 6 (-1)',
    cheatSec5Decade1900: '1900s: 0',
    cheatSec5Decade1800: '1800s: 2',
    cheatSec5Decade1700: '1700s: 4',
    cheatSec6Title: '6. Leap Years (The 4% Trap)',
    cheatSec6Note: 'Adjustment is needed <strong>ONLY for January & February</strong> (subtract 1). For the other 10 months, leap status does not matter!',
    cheatSec6RuleEven: '• <strong>Even tens</strong>: ends in <strong>0, 4, 8</strong>',
    cheatSec6RuleOdd: '• <strong>Odd tens</strong>: ends in <strong>2, 6</strong>',
    cheatSec6RuleCenturies: '• <strong>Centuries</strong>: 1600, 2000 — yes; 1800, 1900 — no'
  }
};

export function getDictionary(lang: Lang): I18nDictionary {
  return DICTIONARY[lang] || DICTIONARY.ru;
}

export function formatMonthNameForDisplay(monthIndex: number, lang: Lang): string {
  const dict = getDictionary(lang);
  return dict.months[monthIndex].name;
}

export function formatDateForDisplay(day: number, monthIndex: number, year: number, lang: Lang): string {
  const dict = getDictionary(lang);
  const monthName = dict.months[monthIndex].name;

  if (lang === 'en') {
    return `${monthName} ${day}, ${year}`;
  }

  // Для русского — родительный падеж
  const ruGenitiveMap: Record<number, string> = {
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
  return `${day} ${ruGenitiveMap[monthIndex] || monthName} ${year}`;
}
