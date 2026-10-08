import type { Lang } from '../../lib/i18n';
import { getDictionary, formatTemplate, formatDateForDisplay } from '../../lib/i18n';
import { isLeapYear, calculateFullDate, type FullDateCalculation } from '../../lib/calendar-core';
import { sound } from '../../lib/audio';
import type { StatsUIController } from './stats';
import { getRequiredElement, getElement } from '../common/dom-utils';

export class SimulatorController {
  private currentDate: FullDateCalculation | null = null;
  private timerStartTime: number = 0;
  private timerInterval: number | null = null;
  private answered: boolean = false;
  private currentLang: Lang = 'ru';
  private lastAnswerStatus: 'correct' | 'wrong' | null = null;
  private lastAnswerElapsed: number = 0;
  private lastAnswerCode: number = 0;

  private elTitle = getRequiredElement('sim-date-title');
  private elSub = getRequiredElement('sim-date-sub');
  private elLeap = getRequiredElement('sim-leap-indicator');
  private elTimerVal = getRequiredElement('sim-timer-val');
  private elFeedback = getRequiredElement('sim-feedback');
  private elStatus = getRequiredElement('feedback-status');
  private elMsg = getRequiredElement('feedback-msg');
  private elBreakdown = getRequiredElement('breakdown-card');
  private elBreakdownSteps = getRequiredElement('breakdown-steps-container');
  private diffSelect = getElement<HTMLSelectElement>('sim-difficulty-select');

  constructor(private statsUI: StatsUIController) {
    this.initEvents();
    this.loadNewDate();
  }

  public updateLanguage(lang: Lang): void {
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

  private initEvents(): void {
    const btnNext = getElement('btn-next-sim-date');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        sound.playClick();
        this.loadNewDate();
      });
    }

    const btnToggleBreakdown = getElement('btn-toggle-breakdown');
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

    document.querySelectorAll<HTMLElement>('#sim-weekday-buttons .keypad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedCode = parseInt(btn.getAttribute('data-day') || '0', 10);
        this.submitAnswer(selectedCode, btn);
      });
    });

    // Горячие клавиши для клавиатуры
    window.addEventListener('keydown', (e: KeyboardEvent) => {
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

  private renderDateDisplay(): void {
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

  public loadNewDate(): void {
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

  private renderFeedbackText(status: 'correct' | 'wrong', elapsedSec: number, selectedCode: number): void {
    if (!this.currentDate) return;
    const dict = getDictionary(this.currentLang);
    const correctCode = this.currentDate.weekdayCode;
    const correctWeekdayName = dict.weekdays[correctCode];

    if (status === 'correct') {
      this.elFeedback.className = 'feedback-card success';
      this.elStatus.textContent = formatTemplate(dict.simSuccessTitle, { time: elapsedSec.toFixed(2) });
      this.elMsg.textContent = formatTemplate(dict.simSuccessBody, { weekday: correctWeekdayName });
    } else {
      this.elFeedback.className = 'feedback-card error';
      this.elStatus.textContent = dict.simFailTitle;

      const isJanFeb = (this.currentDate.monthIndex === 0 || this.currentDate.monthIndex === 1);
      const nonLeapExpected = (correctCode + 1) % 7;

      if (this.currentDate.isLeap && isJanFeb && selectedCode === nonLeapExpected) {
        this.elMsg.innerHTML = formatTemplate(dict.simFailLeapTrapBody, {
          year: this.currentDate.year,
          weekday: correctWeekdayName,
          code: correctCode
        });
      } else {
        this.elMsg.innerHTML = formatTemplate(dict.simFailNormalBody, {
          weekday: correctWeekdayName,
          code: correctCode
        });
      }
    }
  }

  private submitAnswer(selectedCode: number, clickedBtn: HTMLElement): void {
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
        this.elStatus.textContent = formatTemplate(dict.simRecordTitle, { time: elapsedSec.toFixed(2) });
        this.elMsg.textContent = formatTemplate(dict.simSuccessBody, { weekday: dict.weekdays[correctCode] });
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

  private toggleBreakdown(): void {
    if (!this.elBreakdown) return;
    this.elBreakdown.style.display = this.elBreakdown.style.display === 'none' ? 'block' : 'none';
  }

  private renderBreakdown(): void {
    if (!this.currentDate) return;
    const dict = getDictionary(this.currentLang);
    const d = this.currentDate;
    const y = d.yInfo;
    const localizedMonthName = dict.months[d.monthIndex].name;
    const localizedWeekday = dict.weekdays[d.weekdayCode];

    const yyStr = y.yy < 10 ? `0${y.yy}` : y.yy.toString();
    const anchorText = y.baseAnchor > 0
      ? formatTemplate(dict.simStep4CalcAnchor, { yy: y.yy, anchor: y.baseAnchor, rem: y.rem })
      : '';
    const foursText = formatTemplate(dict.simStep4CalcFours, { rem: y.rem, leaps: y.leapsInRem });

    const step1Title = formatTemplate(dict.simStep1Title, { day: d.day });
    const step2Title = formatTemplate(dict.simStep2Title, { monthName: localizedMonthName });
    const step2Calc = formatTemplate(dict.simStep2Calc, { mCode: d.mCode, dMod: d.dMod });
    const step3Title = formatTemplate(dict.simStep3Title, { century: Math.floor(d.year / 100) });
    const step3Calc = formatTemplate(dict.simStep3Calc, { cCode: d.cCode, step2: d.step2Month });
    const step4Title = formatTemplate(dict.simStep4Title, { yy: yyStr, year: d.year });

    this.elBreakdownSteps.innerHTML = `
      <div class="b-step">
        <div class="b-num">1</div>
        <div class="b-content">
          <div class="b-title">${step1Title}</div>
          <span class="b-calc">${d.day} mod 7</span>
          <span class="b-result">→ ${d.dMod}</span>
        </div>
      </div>
      <div class="b-step">
        <div class="b-num">2</div>
        <div class="b-content">
          <div class="b-title">${step2Title} ${d.isLeap && [0, 1].includes(d.monthIndex) ? dict.simStep2LeapTag : ''}</div>
          <span class="b-calc">${step2Calc}</span>
          <span class="b-result">→ ${d.step2Month}</span>
        </div>
      </div>
      <div class="b-step">
        <div class="b-num">3</div>
        <div class="b-content">
          <div class="b-title">${step3Title}</div>
          <span class="b-calc">${step3Calc}</span>
          <span class="b-result">→ ${d.step3Century}</span>
        </div>
      </div>
      <div class="b-step">
        <div class="b-num">4</div>
        <div class="b-content">
          <div class="b-title">${step4Title}</div>
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
