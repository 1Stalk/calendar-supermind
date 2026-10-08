/**
 * КАЛЕНДАРНЫЙ СВЕРХМОЗГ — КЛИЕНТСКИЙ КОНТРОЛЛЕР ПРИЛОЖЕНИЯ
 * Управляет состоянием симулятора, 5 тренировочными режимами,
 * шпаргалкой, звуками, интернационализацией (RU / EN) и сохранением.
 */

import {
  isLeapYear,
  getYearCode,
  calculateFullDate,
  type FullDateCalculation,
  type YearCodeInfo
} from '../lib/calendar-core';

import {
  type Lang,
  getDictionary,
  formatDateForDisplay
} from '../lib/i18n';

import { sound } from '../lib/audio';
import { StorageManager, type StatsData } from '../lib/storage';

// =============================================================================
// МЕНЕДЖЕР СТАТИСТИКИ UI
// =============================================================================
class StatsUI {
  private elStreak = document.getElementById('stat-streak');
  private elBestStreak = document.getElementById('stat-best-streak');
  private elTotalSolved = document.getElementById('stat-total-solved');
  private elBestTime = document.getElementById('stat-best-time');
  private currentLang: Lang = 'ru';

  constructor() {
    this.render(StorageManager.getStats());
  }

  public updateLanguage(lang: Lang) {
    this.currentLang = lang;
    this.render(StorageManager.getStats());
  }

  public render(data: StatsData) {
    const dict = getDictionary(this.currentLang);
    if (this.elStreak) this.elStreak.textContent = data.streak.toString();
    if (this.elBestStreak) this.elBestStreak.textContent = data.bestStreak.toString();
    if (this.elTotalSolved) this.elTotalSolved.textContent = data.totalSolved.toString();
    if (this.elBestTime) {
      this.elBestTime.textContent = data.bestTime > 0 ? `${data.bestTime.toFixed(2)} ${dict.timeUnit}` : '--:--';
    }
  }

  public recordSuccess(elapsedSec: number): boolean {
    const { isNewRecord, stats } = StorageManager.addSuccess(elapsedSec);
    this.render(stats);
    return isNewRecord;
  }

  public recordFail() {
    const stats = StorageManager.addFail();
    this.render(stats);
  }
}

// =============================================================================
// МОДУЛЬ 0: СВЕРХСИМУЛЯТОР (ГЛАВНЫЙ ТРЕНАЖЁР)
// =============================================================================
class SimulatorApp {
  private currentDate: FullDateCalculation | null = null;
  private timerStartTime: number = 0;
  private timerInterval: number | null = null;
  private answered: boolean = false;
  private currentLang: Lang = 'ru';
  private lastAnswerStatus: 'correct' | 'wrong' | null = null;
  private lastAnswerElapsed: number = 0;
  private lastAnswerCode: number = 0;

  private elTitle = document.getElementById('sim-date-title')!;
  private elSub = document.getElementById('sim-date-sub')!;
  private elLeap = document.getElementById('sim-leap-indicator')!;
  private elTimerVal = document.getElementById('sim-timer-val')!;
  private elFeedback = document.getElementById('sim-feedback')!;
  private elStatus = document.getElementById('feedback-status')!;
  private elMsg = document.getElementById('feedback-msg')!;
  private elBreakdown = document.getElementById('breakdown-card')!;
  private elBreakdownSteps = document.getElementById('breakdown-steps-container')!;
  private diffSelect = document.getElementById('sim-difficulty-select') as HTMLSelectElement;

  constructor(private statsUI: StatsUI) {
    this.initEvents();
    this.loadNewDate();
  }

  public updateLanguage(lang: Lang) {
    this.currentLang = lang;
    const dict = getDictionary(lang);

    // Обновление подписей на цифровой клавиатуре
    document.querySelectorAll('#sim-weekday-buttons .keypad-btn').forEach(btn => {
      const dayCode = parseInt(btn.getAttribute('data-day') || '0', 10);
      const nameEl = btn.querySelector('.key-name');
      if (nameEl) {
        nameEl.textContent = dict.weekdays[dayCode];
      }
    });

    // Обновление отображаемой даты и разбора шагов
    if (this.currentDate) {
      this.renderDateDisplay();
      this.renderBreakdown();
    }

    // Обновление фидбека если он открыт
    if (this.answered && this.currentDate && this.lastAnswerStatus) {
      this.renderFeedbackText(this.lastAnswerStatus, this.lastAnswerElapsed, this.lastAnswerCode);
    }
  }

  private initEvents() {
    const btnNext = document.getElementById('btn-next-sim-date');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        sound.playClick();
        this.loadNewDate();
      });
    }

    const btnToggleBreakdown = document.getElementById('btn-toggle-breakdown');
    if (btnToggleBreakdown) {
      btnToggleBreakdown.addEventListener('click', () => {
        sound.playClick();
        this.toggleBreakdown();
      });
    }

    if (this.diffSelect) {
      this.diffSelect.addEventListener('change', () => {
        sound.playClick();
        this.loadNewDate();
      });
    }

    document.querySelectorAll('#sim-weekday-buttons .keypad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedCode = parseInt(btn.getAttribute('data-day') || '0', 10);
        this.submitAnswer(selectedCode, btn as HTMLElement);
      });
    });

    // Горячие клавиши для клавиатуры
    window.addEventListener('keydown', (e) => {
      const activeTab = document.querySelector('.tab-panel.active');
      if (!activeTab || activeTab.id !== 'tab-full-sim') return;

      if (e.key >= '1' && e.key <= '7') {
        const code = e.key === '7' ? 0 : parseInt(e.key, 10);
        const btn = document.getElementById(`btn-day-${code}`);
        if (btn && !this.answered) this.submitAnswer(code, btn);
      } else if (e.key === '0') {
        const btn = document.getElementById('btn-day-0');
        if (btn && !this.answered) this.submitAnswer(0, btn);
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (this.answered) {
          e.preventDefault();
          this.loadNewDate();
        }
      } else if (e.key.toLowerCase() === 'h' || e.key.toLowerCase() === 'р') {
        this.toggleBreakdown();
      }
    });
  }

  private generateRandomDate(): FullDateCalculation {
    const diff = this.diffSelect ? this.diffSelect.value : 'modern';
    let year: number;
    let mIndex: number;
    let day: number;

    if (diff === 'leap_focus') {
      const leapYears = [
        1904, 1908, 1912, 1916, 1920, 1924, 1928, 1932, 1936, 1940, 1944, 1948,
        1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996,
        2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032, 1804, 1896, 1600
      ];
      year = leapYears[Math.floor(Math.random() * leapYears.length)];
      mIndex = Math.random() < 0.5 ? 0 : 1;
      const maxDays = mIndex === 0 ? 31 : 29;
      day = 1 + Math.floor(Math.random() * maxDays);
      return calculateFullDate(year, mIndex, day);
    }

    if (diff === 'current_decade') {
      year = 2020 + Math.floor(Math.random() * 10);
    } else if (diff === 'modern') {
      year = 1900 + Math.floor(Math.random() * 200);
    } else {
      year = 1600 + Math.floor(Math.random() * 800);
    }

    mIndex = Math.floor(Math.random() * 12);
    let maxDays = 31;
    if ([3, 5, 8, 10].includes(mIndex)) {
      maxDays = 30;
    } else if (mIndex === 1) {
      maxDays = isLeapYear(year) ? 29 : 28;
    }
    day = 1 + Math.floor(Math.random() * maxDays);

    return calculateFullDate(year, mIndex, day);
  }

  private renderDateDisplay() {
    if (!this.currentDate) return;
    const dict = getDictionary(this.currentLang);
    const d = this.currentDate;

    this.elTitle.textContent = formatDateForDisplay(d.day, d.monthIndex, d.year, this.currentLang);
    const centurySuffix = this.currentLang === 'en' ? 's' : '-е годы';
    this.elSub.textContent = `${dict.simCalendarSub} • ${Math.floor(d.year / 100) * 100}${centurySuffix}`;

    if (d.isLeap) {
      const isJanFeb = [0, 1].includes(d.monthIndex);
      this.elLeap.textContent = isJanFeb ? dict.simLeapBadgeJanFeb : dict.simLeapBadge;
      this.elLeap.style.display = 'inline-block';
    } else {
      this.elLeap.style.display = 'none';
    }
  }

  public loadNewDate() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.answered = false;
    this.lastAnswerStatus = null;

    // Сброс подсветки кнопок
    document.querySelectorAll('#sim-weekday-buttons .keypad-btn').forEach(b => {
      b.classList.remove('correct', 'wrong');
    });

    if (this.elFeedback) this.elFeedback.style.display = 'none';
    if (this.elBreakdown) this.elBreakdown.style.display = 'none';

    this.currentDate = this.generateRandomDate();
    this.renderDateDisplay();
    this.renderBreakdown();

    // Запуск таймера
    this.timerStartTime = performance.now();
    this.elTimerVal.textContent = '0.00';
    this.timerInterval = window.setInterval(() => {
      const elapsed = (performance.now() - this.timerStartTime) / 1000;
      this.elTimerVal.textContent = elapsed.toFixed(2);
    }, 40);
  }

  private renderFeedbackText(status: 'correct' | 'wrong', elapsedSec: number, selectedCode: number) {
    if (!this.currentDate) return;
    const dict = getDictionary(this.currentLang);
    const correctCode = this.currentDate.weekdayCode;
    const correctWeekdayName = dict.weekdays[correctCode];

    if (status === 'correct') {
      this.elFeedback.className = 'feedback-card success';
      this.elStatus.textContent = dict.simSuccessTitle.replace('{time}', elapsedSec.toFixed(2));
      this.elMsg.textContent = dict.simSuccessBody.replace('{weekday}', correctWeekdayName);
    } else {
      this.elFeedback.className = 'feedback-card error';
      this.elStatus.textContent = dict.simFailTitle;

      const isJanFeb = (this.currentDate.monthIndex === 0 || this.currentDate.monthIndex === 1);
      const nonLeapExpected = (correctCode + 1) % 7;

      if (this.currentDate.isLeap && isJanFeb && selectedCode === nonLeapExpected) {
        this.elMsg.innerHTML = dict.simFailLeapTrapBody
          .replace('{year}', this.currentDate.year.toString())
          .replace('{weekday}', correctWeekdayName)
          .replace('{code}', correctCode.toString());
      } else {
        this.elMsg.innerHTML = dict.simFailNormalBody
          .replace('{weekday}', correctWeekdayName)
          .replace('{code}', correctCode.toString());
      }
    }
  }

  private submitAnswer(selectedCode: number, clickedBtn: HTMLElement) {
    if (this.answered || !this.currentDate) return;
    this.answered = true;

    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const elapsedSec = (performance.now() - this.timerStartTime) / 1000;
    const correctCode = this.currentDate.weekdayCode;
    const correctBtn = document.getElementById(`btn-day-${correctCode}`);

    this.lastAnswerElapsed = elapsedSec;
    this.lastAnswerCode = selectedCode;
    this.elFeedback.style.display = 'block';

    if (selectedCode === correctCode) {
      this.lastAnswerStatus = 'correct';
      clickedBtn.classList.add('correct');
      const isRecord = this.statsUI.recordSuccess(elapsedSec);

      if (isRecord) {
        sound.playRecord();
        const dict = getDictionary(this.currentLang);
        this.elStatus.textContent = dict.simRecordTitle.replace('{time}', elapsedSec.toFixed(2));
        this.elMsg.textContent = dict.simSuccessBody.replace('{weekday}', dict.weekdays[correctCode]);
        this.elFeedback.className = 'feedback-card success';
      } else {
        sound.playSuccess();
        this.renderFeedbackText('correct', elapsedSec, selectedCode);
      }
    } else {
      this.lastAnswerStatus = 'wrong';
      clickedBtn.classList.add('wrong');
      if (correctBtn) correctBtn.classList.add('correct');
      sound.playError();
      this.statsUI.recordFail();

      this.renderFeedbackText('wrong', elapsedSec, selectedCode);
      this.elBreakdown.style.display = 'block';
    }
  }

  private toggleBreakdown() {
    if (!this.elBreakdown) return;
    this.elBreakdown.style.display = this.elBreakdown.style.display === 'none' ? 'block' : 'none';
  }

  private renderBreakdown() {
    if (!this.currentDate) return;
    const dict = getDictionary(this.currentLang);
    const d = this.currentDate;
    const y = d.yInfo;
    const localizedMonthName = dict.months[d.monthIndex].name;
    const localizedWeekday = dict.weekdays[d.weekdayCode];

    const yyStr = y.yy < 10 ? `0${y.yy}` : y.yy.toString();
    const anchorText = y.baseAnchor > 0
      ? dict.simStep4CalcAnchor.replace('{yy}', y.yy.toString()).replace('{anchor}', y.baseAnchor.toString()).replace('{rem}', y.rem.toString())
      : '';
    const foursText = dict.simStep4CalcFours.replace('{rem}', y.rem.toString()).replace('{leaps}', y.leapsInRem.toString());

    this.elBreakdownSteps.innerHTML = `
      <div class="b-step">
        <div class="b-num">1</div>
        <div class="b-content">
          <div class="b-title">${dict.simStep1Title.replace('{day}', d.day.toString())}</div>
          <span class="b-calc">${d.day} mod 7</span>
          <span class="b-result">→ ${d.dMod}</span>
        </div>
      </div>
      <div class="b-step">
        <div class="b-num">2</div>
        <div class="b-content">
          <div class="b-title">${dict.simStep2Title.replace('{monthName}', localizedMonthName)} ${d.isLeap && [0, 1].includes(d.monthIndex) ? dict.simStep2LeapTag : ''}</div>
          <span class="b-calc">${dict.simStep2Calc.replace('{mCode}', d.mCode.toString()).replace('{dMod}', d.dMod.toString())}</span>
          <span class="b-result">→ ${d.step2Month}</span>
        </div>
      </div>
      <div class="b-step">
        <div class="b-num">3</div>
        <div class="b-content">
          <div class="b-title">${dict.simStep3Title.replace('{century}', Math.floor(d.year / 100).toString())}</div>
          <span class="b-calc">${dict.simStep3Calc.replace('{cCode}', d.cCode.toString()).replace('{step2}', d.step2Month.toString())}</span>
          <span class="b-result">→ ${d.step3Century}</span>
        </div>
      </div>
      <div class="b-step">
        <div class="b-num">4</div>
        <div class="b-content">
          <div class="b-title">${dict.simStep4Title.replace('{yy}', yyStr).replace('{year}', d.year.toString())}</div>
          <span class="b-calc">${anchorText}${foursText}</span>
          <span class="b-result">→ ${y.yearCode}</span>
        </div>
      </div>
      <div class="b-step final">
        <div class="b-num">5</div>
        <div class="b-content">
          <div class="b-title">${dict.simStep5Title}</div>
          <span class="b-calc">(${d.step3Century} + ${y.yearCode}) mod 7 = ${d.weekdayCode}</span>
          <span class="b-result">${localizedWeekday}</span>
        </div>
      </div>
    `;
  }
}

// =============================================================================
// МОДУЛЬ 1: ДНИ И ЦИФРЫ (1=ПН ... 0=ВС)
// =============================================================================
class Level1Drill {
  private elPrompt = document.getElementById('l1-prompt-display')!;
  private elGrid = document.getElementById('l1-buttons-grid')!;
  private elFeedback = document.getElementById('l1-feedback')!;
  private currentQuestion: { code: number } | null = null;
  private currentLang: Lang = 'ru';

  constructor() {
    this.initButtons();
    this.next();
  }

  public updateLanguage(lang: Lang) {
    this.currentLang = lang;
    this.initButtons();
    if (this.currentQuestion) {
      const dict = getDictionary(this.currentLang);
      this.elPrompt.textContent = dict.weekdays[this.currentQuestion.code];
    }
  }

  private initButtons() {
    this.elGrid.innerHTML = '';
    const dict = getDictionary(this.currentLang);
    const daysOrder = [1, 2, 3, 4, 5, 6, 0];
    daysOrder.forEach(code => {
      const btn = document.createElement('button');
      btn.className = 'l1-btn';
      btn.innerHTML = `
        <span class="btn-num mono-nums">${code}</span>
        <span class="btn-day-label">${dict.weekdaysShort[code]}</span>
      `;
      btn.addEventListener('click', () => this.check(code, btn));
      this.elGrid.appendChild(btn);
    });
  }

  public next() {
    const code = Math.floor(Math.random() * 7);
    this.currentQuestion = { code };
    const dict = getDictionary(this.currentLang);
    this.elPrompt.textContent = dict.weekdays[code];
    this.elFeedback.textContent = '';
    this.elFeedback.className = 'feedback-box';
    document.querySelectorAll('#l1-buttons-grid .l1-btn').forEach(b => b.classList.remove('correct', 'wrong'));
  }

  private check(selectedCode: number, btn: HTMLElement) {
    if (!this.currentQuestion) return;
    const dict = getDictionary(this.currentLang);
    const expectedCode = this.currentQuestion.code;
    const expectedName = dict.weekdays[expectedCode];

    if (selectedCode === expectedCode) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.elFeedback.className = 'feedback-box correct';
      this.elFeedback.textContent = dict.l1FeedbackCorrect;
      setTimeout(() => this.next(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      this.elFeedback.className = 'feedback-box wrong';
      this.elFeedback.textContent = dict.l1FeedbackWrong.replace('{name}', expectedName).replace('{code}', expectedCode.toString());
    }
  }
}

// =============================================================================
// МОДУЛЬ 2: СБРОС СЕМЁРОК (MODULO 7)
// =============================================================================
class Level2Drill {
  private elPrompt = document.getElementById('l2-prompt-display')!;
  private elGrid = document.getElementById('l2-buttons-grid')!;
  private elFeedback = document.getElementById('l2-feedback')!;
  private currentNum: number = 0;
  private currentLang: Lang = 'ru';

  constructor() {
    this.initButtons();
    this.next();
  }

  public updateLanguage(lang: Lang) {
    this.currentLang = lang;
  }

  private initButtons() {
    this.elGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-digit-option';
      btn.textContent = i.toString();
      btn.addEventListener('click', () => this.check(i, btn));
      this.elGrid.appendChild(btn);
    }
  }

  public next() {
    this.currentNum = 1 + Math.floor(Math.random() * 31);
    this.elPrompt.textContent = this.currentNum.toString();
    this.elFeedback.textContent = '';
    this.elFeedback.className = 'feedback-box';
    document.querySelectorAll('#l2-buttons-grid .btn-digit-option').forEach(b => b.classList.remove('correct', 'wrong'));
  }

  private check(selectedRem: number, btn: HTMLElement) {
    const expected = this.currentNum % 7;
    const dict = getDictionary(this.currentLang);

    if (selectedRem === expected) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.elFeedback.className = 'feedback-box correct';
      this.elFeedback.textContent = dict.l2FeedbackCorrect;
      setTimeout(() => this.next(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      const expl = this.currentNum < 7
        ? dict.l2FeedbackWrongSmall.replace('{num}', this.currentNum.toString())
        : dict.l2FeedbackWrongAnchor.replace('{num}', this.currentNum.toString()).replace('{expected}', expected.toString());
      this.elFeedback.className = 'feedback-box wrong';
      this.elFeedback.textContent = `${dict.btnWrong} (${expl})`;
    }
  }
}

// =============================================================================
// МОДУЛЬ 3: МНЕМОНИКА МЕСЯЦЕВ
// =============================================================================
class Level3Drill {
  private elCardsView = document.getElementById('l3-cards-view')!;
  private elQuizView = document.getElementById('l3-quiz-view')!;
  private elPrompt = document.getElementById('l3-prompt-display')!;
  private elHint = document.getElementById('l3-mnemonic-hint')!;
  private elGrid = document.getElementById('l3-buttons-grid')!;
  private elFeedback = document.getElementById('l3-feedback')!;
  private currentQuizMonth: { name: string; code: number; story: string } | null = null;
  private currentLang: Lang = 'ru';

  constructor() {
    this.renderCards();
    this.initQuizButtons();
    this.initSubTabs();
  }

  public updateLanguage(lang: Lang) {
    this.currentLang = lang;
    this.renderCards();
    if (this.currentQuizMonth) {
      this.nextQuiz();
    }
  }

  private renderCards() {
    this.elCardsView.innerHTML = '';
    const dict = getDictionary(this.currentLang);

    dict.months.forEach(m => {
      const card = document.createElement('div');
      card.className = 'm-card';
      const leapStr = m.leapCode !== m.code ? `<div class="m-leap">${dict.l3LeapTag} ${m.leapCode}</div>` : '';
      card.innerHTML = `
        <div class="m-top">
          <span class="m-name">${m.name}</span>
          <span class="m-code-badge mono-nums">${m.code}</span>
        </div>
        <p class="m-story">${m.story}</p>
        ${leapStr}
      `;
      this.elCardsView.appendChild(card);
    });
  }

  private initQuizButtons() {
    this.elGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-digit-option';
      btn.textContent = i.toString();
      btn.addEventListener('click', () => this.check(i, btn));
      this.elGrid.appendChild(btn);
    }
  }

  private initSubTabs() {
    const btnCards = document.getElementById('btn-subtab-cards');
    const btnQuiz = document.getElementById('btn-subtab-quiz');

    if (btnCards && btnQuiz) {
      btnCards.addEventListener('click', () => {
        sound.playClick();
        btnCards.classList.add('active');
        btnQuiz.classList.remove('active');
        this.elCardsView.style.display = 'grid';
        this.elQuizView.style.display = 'none';
      });

      btnQuiz.addEventListener('click', () => {
        sound.playClick();
        btnQuiz.classList.add('active');
        btnCards.classList.remove('active');
        this.elCardsView.style.display = 'none';
        this.elQuizView.style.display = 'block';
        this.nextQuiz();
      });
    }
  }

  public nextQuiz() {
    const dict = getDictionary(this.currentLang);
    const leapToggle = document.getElementById('l3-leap-toggle') as HTMLInputElement | null;
    const includeLeap = leapToggle ? leapToggle.checked : true;

    if (includeLeap && Math.random() < 0.28) {
      const isJan = Math.random() < 0.5;
      if (isJan) {
        this.currentQuizMonth = {
          name: dict.l3JanLeapName,
          code: 6,
          story: dict.l3JanLeapStory
        };
      } else {
        this.currentQuizMonth = {
          name: dict.l3FebLeapName,
          code: 2,
          story: dict.l3FebLeapStory
        };
      }
    } else {
      this.currentQuizMonth = dict.months[Math.floor(Math.random() * 12)];
    }

    this.elPrompt.textContent = this.currentQuizMonth.name;
    this.elHint.textContent = `${dict.l3HintPrefix}${this.currentQuizMonth.story}`;
    this.elHint.style.display = 'none';
    this.elFeedback.textContent = '';
    this.elFeedback.className = 'feedback-box';
    document.querySelectorAll('#l3-buttons-grid .btn-digit-option').forEach(b => b.classList.remove('correct', 'wrong'));
  }

  private check(selectedCode: number, btn: HTMLElement) {
    if (!this.currentQuizMonth) return;
    const dict = getDictionary(this.currentLang);

    if (selectedCode === this.currentQuizMonth.code) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.elFeedback.className = 'feedback-box correct';
      this.elFeedback.textContent = dict.l3FeedbackCorrect;
      setTimeout(() => this.nextQuiz(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      this.elHint.style.display = 'block';
      this.elFeedback.className = 'feedback-box wrong';
      this.elFeedback.textContent = dict.l3FeedbackWrong.replace('{name}', this.currentQuizMonth.name).replace('{code}', this.currentQuizMonth.code.toString());
    }
  }
}

// =============================================================================
// МОДУЛЬ 4: ОПОРНЫЕ 28 ЛЕТ И ВИСОКОСНОСТЬ
// =============================================================================
class Level4Drill {
  private elPrompt = document.getElementById('l4-prompt-display')!;
  private elGuide = document.getElementById('l4-guide-steps')!;
  private elGrid = document.getElementById('l4-buttons-grid')!;
  private elFeedback = document.getElementById('l4-feedback')!;
  private currentYear: number = 0;
  private yearInfo: YearCodeInfo | null = null;
  private currentLang: Lang = 'ru';

  private elCodeView = document.getElementById('l4-code-view')!;
  private elLeapView = document.getElementById('l4-leap-view')!;
  private elLeapPrompt = document.getElementById('l4-leap-prompt-display')!;
  private elLeapFeedback = document.getElementById('l4-leap-feedback')!;
  private currentLeapYear: number = 0;

  constructor() {
    this.initSubTabs();
    this.initButtons();
    this.initLeapButtons();
    this.next();
    this.nextLeap();
  }

  public updateLanguage(lang: Lang) {
    this.currentLang = lang;
    this.renderYearPrompt();
    if (this.currentLeapYear) {
      const dict = getDictionary(this.currentLang);
      this.elLeapPrompt.textContent = this.currentLang === 'en' ? `Year ${this.currentLeapYear}` : `${this.currentLeapYear} год`;
    }
  }

  private initSubTabs() {
    const btnCode = document.getElementById('btn-subtab-l4-code');
    const btnLeap = document.getElementById('btn-subtab-l4-leap');

    if (btnCode && btnLeap) {
      btnCode.addEventListener('click', () => {
        sound.playClick();
        btnCode.classList.add('active');
        btnLeap.classList.remove('active');
        this.elCodeView.style.display = 'block';
        this.elLeapView.style.display = 'none';
      });

      btnLeap.addEventListener('click', () => {
        sound.playClick();
        btnLeap.classList.add('active');
        btnCode.classList.remove('active');
        this.elCodeView.style.display = 'none';
        this.elLeapView.style.display = 'block';
        this.nextLeap();
      });
    }
  }

  private initButtons() {
    this.elGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-digit-option';
      btn.textContent = i.toString();
      btn.addEventListener('click', () => this.check(i, btn));
      this.elGrid.appendChild(btn);
    }
  }

  private initLeapButtons() {
    const btnYes = document.getElementById('btn-l4-leap-yes');
    const btnNo = document.getElementById('btn-l4-leap-no');

    if (btnYes && btnNo) {
      btnYes.addEventListener('click', () => this.checkLeap(true));
      btnNo.addEventListener('click', () => this.checkLeap(false));
    }
  }

  private renderYearPrompt() {
    if (!this.yearInfo) return;
    const dict = getDictionary(this.currentLang);
    const yyStr = this.currentYear < 10 ? `0${this.currentYear}` : this.currentYear.toString();
    this.elPrompt.textContent = dict.l4YearLabel.replace('{yy}', yyStr);

    const y = this.yearInfo;
    const remText = dict.l4RemLabel.replace('{yy}', y.yy.toString()).replace('{anchor}', y.baseAnchor.toString());
    this.elGuide.innerHTML = `
      ${dict.l4AnchorLabel}<strong>${y.baseAnchor}</strong> | 
      ${remText}<strong>${y.rem}</strong> | 
      ${dict.l4LeapsInRemLabel}<strong>${y.leapsInRem}</strong>
    `;
  }

  public next() {
    this.currentYear = Math.floor(Math.random() * 100);
    this.yearInfo = getYearCode(this.currentYear);
    this.renderYearPrompt();

    this.elFeedback.textContent = '';
    this.elFeedback.className = 'feedback-box';
    document.querySelectorAll('#l4-buttons-grid .btn-digit-option').forEach(b => b.classList.remove('correct', 'wrong'));
  }

  private check(selectedCode: number, btn: HTMLElement) {
    if (!this.yearInfo) return;
    const dict = getDictionary(this.currentLang);

    if (selectedCode === this.yearInfo.yearCode) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.elFeedback.className = 'feedback-box correct';
      this.elFeedback.textContent = dict.l4FeedbackCorrectCode;
      setTimeout(() => this.next(), 650);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      this.elFeedback.className = 'feedback-box wrong';
      this.elFeedback.textContent = dict.l4FeedbackWrongCode
        .replace('{year}', this.currentYear.toString())
        .replace('{code}', this.yearInfo.yearCode.toString())
        .replace('{rem}', this.yearInfo.rem.toString())
        .replace('{leaps}', this.yearInfo.leapsInRem.toString());
    }
  }

  public nextLeap() {
    const pickCentury = Math.random() < 0.2;
    if (pickCentury) {
      const centuries = [1600, 1700, 1800, 1900, 2000, 2100];
      this.currentLeapYear = centuries[Math.floor(Math.random() * centuries.length)];
    } else {
      this.currentLeapYear = 1900 + Math.floor(Math.random() * 140);
    }

    if (this.elLeapPrompt) {
      this.elLeapPrompt.textContent = this.currentLang === 'en' ? `Year ${this.currentLeapYear}` : `${this.currentLeapYear} год`;
      this.elLeapFeedback.textContent = '';
      this.elLeapFeedback.className = 'feedback-box';
    }
  }

  private checkLeap(userAnswer: boolean) {
    const dict = getDictionary(this.currentLang);
    const actuallyLeap = isLeapYear(this.currentLeapYear);
    const tens = Math.floor((this.currentLeapYear % 100) / 10);
    const lastDigit = this.currentLeapYear % 10;
    const isCentury = this.currentLeapYear % 100 === 0;

    let explanation = '';
    if (isCentury) {
      explanation = actuallyLeap
        ? dict.l4CenturyDiv400Leap.replace('{year}', this.currentLeapYear.toString())
        : dict.l4CenturyDiv400Common.replace('{year}', this.currentLeapYear.toString());
    } else if (tens % 2 === 0) {
      explanation = actuallyLeap
        ? dict.l4EvenTensLeap.replace('{tens}', tens.toString()).replace('{last}', lastDigit.toString())
        : dict.l4EvenTensCommon.replace('{tens}', tens.toString()).replace('{last}', lastDigit.toString());
    } else {
      explanation = actuallyLeap
        ? dict.l4OddTensLeap.replace('{tens}', tens.toString()).replace('{last}', lastDigit.toString())
        : dict.l4OddTensCommon.replace('{tens}', tens.toString()).replace('{last}', lastDigit.toString());
    }

    if (userAnswer === actuallyLeap) {
      sound.playSuccess();
      this.elLeapFeedback.className = 'feedback-box correct';
      this.elLeapFeedback.textContent = `${dict.btnCorrect} ${explanation}`;
      setTimeout(() => this.nextLeap(), 950);
    } else {
      sound.playError();
      this.elLeapFeedback.className = 'feedback-box wrong';
      this.elLeapFeedback.textContent = `${dict.btnWrong} ${explanation}`;
    }
  }
}

// =============================================================================
// МОДУЛЬ 5: КОДЫ ВЕКОВ
// =============================================================================
class Level5Drill {
  private elPrompt = document.getElementById('l5-prompt-display')!;
  private elGrid = document.getElementById('l5-buttons-grid')!;
  private elFeedback = document.getElementById('l5-feedback')!;
  private currentCentury: number = 0;
  private currentLang: Lang = 'ru';

  constructor() {
    this.initButtons();
    this.next();
  }

  public updateLanguage(lang: Lang) {
    this.currentLang = lang;
    if (this.currentCentury) {
      const dict = getDictionary(this.currentLang);
      this.elPrompt.textContent = dict.l5CenturyYears.replace('{century}', this.currentCentury.toString());
    }
  }

  private initButtons() {
    this.elGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-digit-option';
      btn.textContent = i.toString();
      btn.addEventListener('click', () => this.check(i, btn));
      this.elGrid.appendChild(btn);
    }
  }

  public next() {
    const dict = getDictionary(this.currentLang);
    const centuries = [16, 17, 18, 19, 20, 21];
    this.currentCentury = centuries[Math.floor(Math.random() * centuries.length)];
    this.elPrompt.textContent = dict.l5CenturyYears.replace('{century}', this.currentCentury.toString());
    this.elFeedback.textContent = '';
    this.elFeedback.className = 'feedback-box';
    document.querySelectorAll('#l5-buttons-grid .btn-digit-option').forEach(b => b.classList.remove('correct', 'wrong'));
  }

  private check(selectedCode: number, btn: HTMLElement) {
    const dict = getDictionary(this.currentLang);
    const centuryOffsets: Record<number, number> = { 16: 6, 17: 4, 18: 2, 19: 0, 20: 6, 21: 4 };
    const expected = centuryOffsets[this.currentCentury];

    if (selectedCode === expected) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.elFeedback.className = 'feedback-box correct';
      this.elFeedback.textContent = dict.l5FeedbackCorrect;
      setTimeout(() => this.next(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      this.elFeedback.className = 'feedback-box wrong';
      this.elFeedback.textContent = dict.l5FeedbackWrong
        .replace('{century}', this.currentCentury.toString())
        .replace('{expected}', expected.toString());
    }
  }
}

// =============================================================================
// ШПАРГАЛКА: ДИНАМИЧЕСКИЙ РЕНДЕР МОДАЛЬНОГО ОКНА
// =============================================================================
class CheatSheetController {
  private elMonthsTable = document.getElementById('cheat-months-table');
  private elYearExample = document.getElementById('cheat-year-example');
  private elLeapNote = document.getElementById('cheat-leap-note');
  private elLeapRules = document.getElementById('cheat-leap-rules');
  private elDaysChips = document.getElementById('cheat-days-chips');

  public render(lang: Lang) {
    const dict = getDictionary(lang);

    // 1. Таблица мнемоники месяцев
    if (this.elMonthsTable) {
      this.elMonthsTable.innerHTML = dict.months.map(m => {
        const leapLabel = m.leapCode !== m.code ? ` <small>(${dict.l3LeapTag} ${m.leapCode})</small>` : '';
        return `
          <div class="m-row">
            <span class="m-col-name">${m.name}</span>
            <span class="m-col-code mono-nums">${m.code}${leapLabel}</span>
            <span class="m-col-desc">${m.story}</span>
          </div>
        `;
      }).join('');
    }

    // 2. Дни недели
    if (this.elDaysChips) {
      const daysOrder = [1, 2, 3, 4, 5, 6, 0];
      this.elDaysChips.innerHTML = daysOrder.map(code => `
        <div class="day-chip ${code === 0 ? 'accent' : ''}">
          <strong>${code}</strong> <span>${dict.weekdaysShort[code]}</span>
        </div>
      `).join('');
    }

    // 3. Пример года
    if (this.elYearExample) {
      this.elYearExample.innerHTML = dict.cheatSec4Example;
    }

    // 4. Пояснение високосности и правила
    if (this.elLeapNote) {
      this.elLeapNote.innerHTML = dict.cheatSec6Note;
    }
    if (this.elLeapRules) {
      this.elLeapRules.innerHTML = `
        <div>${dict.cheatSec6RuleEven}</div>
        <div>${dict.cheatSec6RuleOdd}</div>
        <div>${dict.cheatSec6RuleCenturies}</div>
      `;
    }
  }
}

// =============================================================================
// ГЛОБАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ И УПРАВЛЕНИЕ ЯЗЫКОМ
// =============================================================================
function setupHintToggle(btnId: string, targetElementIds: string[], storageKey: string, getLang: () => Lang) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  const hintText = btn.querySelector('.hint-text');
  let isHidden = StorageManager.getHintHidden(storageKey);

  function update() {
    const dict = getDictionary(getLang());
    targetElementIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (isHidden) {
          el.classList.add('hidden-hint');
        } else {
          el.classList.remove('hidden-hint');
        }
      }
    });
    if (hintText) {
      hintText.textContent = isHidden ? dict.hintShow : dict.hintHide;
    }
  }

  update();

  btn.addEventListener('click', () => {
    sound.playClick();
    isHidden = !isHidden;
    StorageManager.setHintHidden(storageKey, isHidden);
    update();
  });

  return update;
}

function initApp() {
  let currentLang: Lang = StorageManager.getLanguage();

  const statsUI = new StatsUI();
  const simApp = new SimulatorApp(statsUI);
  const l1Drill = new Level1Drill();
  const l2Drill = new Level2Drill();
  const l3Drill = new Level3Drill();
  const l4Drill = new Level4Drill();
  const l5Drill = new Level5Drill();
  const cheatSheetCtrl = new CheatSheetController();

  const hintUpdates: Array<() => void> = [];

  const updateL2Hint = setupHintToggle('btn-toggle-l2-hints', ['l2-header-desc'], 'cal_hide_l2', () => currentLang);
  if (updateL2Hint) hintUpdates.push(updateL2Hint);

  const updateL4Hint = setupHintToggle('btn-toggle-l4-hints', ['l4-header-desc', 'l4-guide-steps', 'l4-leap-rule-reminder'], 'cal_hide_l4', () => currentLang);
  if (updateL4Hint) hintUpdates.push(updateL4Hint);

  const updateL5Hint = setupHintToggle('btn-toggle-l5-hints', ['l5-header-desc'], 'cal_hide_l5', () => currentLang);
  if (updateL5Hint) hintUpdates.push(updateL5Hint);

  function applyLanguage(lang: Lang) {
    currentLang = lang;
    StorageManager.setLanguage(lang);
    document.documentElement.lang = lang;

    if (lang === 'en') {
      document.title = 'Calendar Supermind | Mental Date Calculation Trainer';
    } else {
      document.title = 'Календарный Сверхмозг | Тренажёр счёта дат в уме';
    }

    const dict = getDictionary(lang);

    // 1. Обновление всех статических текстов с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n') as keyof typeof dict;
      if (key && dict[key] !== undefined) {
        el.textContent = dict[key] as string;
      }
    });

    // 2. Обновление title атрибутов
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title') as keyof typeof dict;
      if (key && dict[key] !== undefined) {
        el.setAttribute('title', dict[key] as string);
      }
    });

    // 3. Обновление aria-label атрибутов
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria') as keyof typeof dict;
      if (key && dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key] as string);
      }
    });

    // 4. Обновление бейджа на кнопке глобуса
    const langIndicator = document.getElementById('lang-indicator');
    if (langIndicator) {
      langIndicator.textContent = lang.toUpperCase();
    }
    const btnLang = document.getElementById('btn-lang-toggle');
    if (btnLang) {
      btnLang.setAttribute('title', dict.langBtnTitle);
      btnLang.setAttribute('aria-label', dict.langBtnAria);
    }

    // 5. Обновление контроллеров
    statsUI.updateLanguage(lang);
    simApp.updateLanguage(lang);
    l1Drill.updateLanguage(lang);
    l2Drill.updateLanguage(lang);
    l3Drill.updateLanguage(lang);
    l4Drill.updateLanguage(lang);
    l5Drill.updateLanguage(lang);
    cheatSheetCtrl.render(lang);

    // Обновление состояния кнопок подсказок
    hintUpdates.forEach(fn => fn());
  }

  // Обработчик кнопки глобуса
  const btnLangToggle = document.getElementById('btn-lang-toggle');
  if (btnLangToggle) {
    btnLangToggle.addEventListener('click', () => {
      sound.playClick();
      const nextLang: Lang = currentLang === 'ru' ? 'en' : 'ru';
      applyLanguage(nextLang);
    });
  }

  // Применяем сохранённый язык при старте
  applyLanguage(currentLang);

  // Навигация по табам
  const navChips = document.querySelectorAll('.nav-chip');
  const panels = document.querySelectorAll('.tab-panel');

  navChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sound.playClick();
      const targetId = chip.getAttribute('data-tab');

      navChips.forEach(c => c.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      chip.classList.add('active');
      const targetPanel = targetId ? document.getElementById(targetId) : null;
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Модальное окно шпаргалки
  const modalCheat = document.getElementById('modal-cheat-sheet');
  const btnOpenCheat = document.getElementById('btn-cheat-sheet');
  const btnCloseCheat = document.getElementById('btn-close-cheat-sheet');

  if (modalCheat && btnOpenCheat && btnCloseCheat) {
    btnOpenCheat.addEventListener('click', () => {
      sound.playClick();
      modalCheat.style.display = 'flex';
    });

    btnCloseCheat.addEventListener('click', () => {
      sound.playClick();
      modalCheat.style.display = 'none';
    });

    modalCheat.addEventListener('click', (e) => {
      if (e.target === modalCheat) {
        modalCheat.style.display = 'none';
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalCheat.style.display !== 'none') {
        modalCheat.style.display = 'none';
      }
    });
  }

  // Переключатель звука
  const btnSound = document.getElementById('btn-sound-toggle');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');

  function updateSoundIcon(enabled: boolean) {
    if (iconSoundOn && iconSoundOff) {
      iconSoundOn.style.display = enabled ? 'block' : 'none';
      iconSoundOff.style.display = enabled ? 'none' : 'block';
    }
  }

  if (btnSound) {
    updateSoundIcon(sound.isEnabled());
    btnSound.addEventListener('click', () => {
      const nowEnabled = sound.toggle();
      updateSoundIcon(nowEnabled);
    });
  }
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
