/**
 * КАЛЕНДАРНЫЙ СВЕРХМОЗГ — ТИПЫ ИНТЕРНАЦИОНАЛИЗАЦИИ
 */

export type Lang = 'ru' | 'en';

export interface MonthTranslation {
  readonly name: string;
  readonly code: number;
  readonly leapCode: number;
  readonly story: string;
}

export interface I18nDictionary {
  // Общие элементы шапки и бренда
  readonly brandTitle: string;
  readonly brandSub: string;
  readonly cheatSheetBtnTitle: string;
  readonly cheatSheetBtnAria: string;
  readonly soundBtnTitle: string;
  readonly soundBtnAria: string;
  readonly langBtnTitle: string;
  readonly langBtnAria: string;

  // Статбар
  readonly statStreak: string;
  readonly statRecord: string;
  readonly statSolved: string;
  readonly statSpeed: string;
  readonly timeUnit: string;

  // Навигация табов
  readonly tabFinal: string;
  readonly tabL1: string;
  readonly tabL2: string;
  readonly tabL3: string;
  readonly tabL4: string;
  readonly tabL5: string;

  // Общие кнопки
  readonly btnHint: string;
  readonly hintHide: string;
  readonly hintShow: string;
  readonly btnCorrect: string;
  readonly btnWrong: string;

  // Главный симулятор (Финал)
  readonly simDiffCurrentDecade: string;
  readonly simDiffModern: string;
  readonly simDiffHistory: string;
  readonly simDiffLeapFocus: string;
  readonly simCalendarSub: string;
  readonly simLeapBadge: string;
  readonly simLeapBadgeJanFeb: string;
  readonly simBtnBreakdown: string;
  readonly simBtnNextDate: string;
  readonly simRecordTitle: string;
  readonly simSuccessTitle: string;
  readonly simSuccessBody: string;
  readonly simFailTitle: string;
  readonly simFailNormalBody: string;
  readonly simFailLeapTrapBody: string;
  readonly simBreakdownHeader: string;
  readonly simStep1Title: string;
  readonly simStep2Title: string;
  readonly simStep2LeapTag: string;
  readonly simStep2Calc: string;
  readonly simStep3Title: string;
  readonly simStep3Calc: string;
  readonly simStep4Title: string;
  readonly simStep4CalcAnchor: string;
  readonly simStep4CalcFours: string;
  readonly simStep5Title: string;

  // Дни недели
  readonly weekdays: Record<number, string>;
  readonly weekdaysShort: Record<number, string>;

  // Месяцы с мнемониками
  readonly months: ReadonlyArray<MonthTranslation>;

  // Уровень 1
  readonly l1Title: string;
  readonly l1Desc: string;
  readonly l1PromptLabel: string;
  readonly l1FeedbackCorrect: string;
  readonly l1FeedbackWrong: string;

  // Уровень 2
  readonly l2Title: string;
  readonly l2Desc: string;
  readonly l2PromptLabel: string;
  readonly l2FeedbackCorrect: string;
  readonly l2FeedbackWrongSmall: string;
  readonly l2FeedbackWrongAnchor: string;

  // Уровень 3
  readonly l3Title: string;
  readonly l3Desc: string;
  readonly l3RhythmicTitle: string;
  readonly l3TabCards: string;
  readonly l3TabQuiz: string;
  readonly l3LeapToggle: string;
  readonly l3PromptLabel: string;
  readonly l3HintPrefix: string;
  readonly l3FeedbackCorrect: string;
  readonly l3FeedbackWrong: string;
  readonly l3JanLeapName: string;
  readonly l3JanLeapStory: string;
  readonly l3FebLeapName: string;
  readonly l3FebLeapStory: string;
  readonly l3LeapTag: string;

  // Уровень 4
  readonly l4Title: string;
  readonly l4Desc: string;
  readonly l4TabCode: string;
  readonly l4TabLeap: string;
  readonly l4CodePromptLabel: string;
  readonly l4YearLabel: string;
  readonly l4AnchorLabel: string;
  readonly l4RemLabel: string;
  readonly l4LeapsInRemLabel: string;
  readonly l4FeedbackCorrectCode: string;
  readonly l4FeedbackWrongCode: string;
  readonly l4LeapPromptLabel: string;
  readonly l4LeapRuleReminder: string;
  readonly l4BtnLeap: string;
  readonly l4BtnCommon: string;
  readonly l4CenturyDiv400Leap: string;
  readonly l4CenturyDiv400Common: string;
  readonly l4EvenTensLeap: string;
  readonly l4EvenTensCommon: string;
  readonly l4OddTensLeap: string;
  readonly l4OddTensCommon: string;

  // Уровень 5
  readonly l5Title: string;
  readonly l5Desc: string;
  readonly l5PromptLabel: string;
  readonly l5CenturyYears: string;
  readonly l5FeedbackCorrect: string;
  readonly l5FeedbackWrong: string;

  // Шпаргалка
  readonly cheatTitle: string;
  readonly cheatCloseAria: string;
  readonly cheatSec1Title: string;
  readonly cheatSec1Formula: string;
  readonly cheatSec1NoteLabel: string;
  readonly cheatSec1NoteText: string;
  readonly cheatSec2Title: string;
  readonly cheatSec3Title: string;
  readonly cheatSec4Title: string;
  readonly cheatSec4Text: string;
  readonly cheatSec4Example: string;
  readonly cheatSec5Title: string;
  readonly cheatSec5Decade2000: string;
  readonly cheatSec5Decade1900: string;
  readonly cheatSec5Decade1800: string;
  readonly cheatSec5Decade1700: string;
  readonly cheatSec6Title: string;
  readonly cheatSec6Note: string;
  readonly cheatSec6RuleEven: string;
  readonly cheatSec6RuleOdd: string;
  readonly cheatSec6RuleCenturies: string;
}
