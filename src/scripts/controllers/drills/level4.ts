import type { Lang } from '../../../lib/i18n';
import { getDictionary, formatTemplate } from '../../../lib/i18n';
import { isLeapYear, getYearCode, type YearCodeInfo } from '../../../lib/calendar-core';
import { sound } from '../../../lib/audio';
import { BaseDrill } from '../../common/base-drill';
import { getRequiredElement, getElement } from '../../common/dom-utils';

export class Level4DrillController extends BaseDrill {
  private elPrompt = getRequiredElement('l4-prompt-display');
  private elGuide = getRequiredElement('l4-guide-steps');
  private elGrid = getRequiredElement('l4-buttons-grid');
  private elFeedback = getRequiredElement('l4-feedback');
  private currentYear: number = 0;
  private yearInfo: YearCodeInfo | null = null;

  private elCodeView = getRequiredElement('l4-code-view');
  private elLeapView = getRequiredElement('l4-leap-view');
  private elLeapPrompt = getRequiredElement('l4-leap-prompt-display');
  private elLeapFeedback = getRequiredElement('l4-leap-feedback');
  private currentLeapYear: number = 0;
  private leapTimerId: number | null = null;

  constructor() {
    super();
    this.initSubTabs();
    this.initButtons();
    this.initLeapButtons();
    this.next();
    this.nextLeap();
  }

  public updateLanguage(lang: Lang): void {
    this.currentLang = lang;
    this.renderYearPrompt();
    if (this.currentLeapYear) {
      this.elLeapPrompt.textContent = this.currentLang === 'en'
        ? `Year ${this.currentLeapYear}`
        : `${this.currentLeapYear} год`;
    }
  }

  private initSubTabs(): void {
    const btnCode = getElement('btn-subtab-l4-code');
    const btnLeap = getElement('btn-subtab-l4-leap');

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

  private initButtons(): void {
    this.elGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-digit-option';
      btn.textContent = i.toString();
      btn.addEventListener('click', () => this.check(i, btn));
      this.elGrid.appendChild(btn);
    }
  }

  private initLeapButtons(): void {
    const btnYes = getElement('btn-l4-leap-yes');
    const btnNo = getElement('btn-l4-leap-no');

    if (btnYes && btnNo) {
      btnYes.addEventListener('click', () => this.checkLeap(true));
      btnNo.addEventListener('click', () => this.checkLeap(false));
    }
  }

  private renderYearPrompt(): void {
    if (!this.yearInfo) return;
    const dict = getDictionary(this.currentLang);
    const yyStr = this.currentYear < 10 ? `0${this.currentYear}` : this.currentYear.toString();
    this.elPrompt.textContent = formatTemplate(dict.l4YearLabel, { yy: yyStr });

    const y = this.yearInfo;
    const remText = formatTemplate(dict.l4RemLabel, { yy: y.yy, anchor: y.baseAnchor });
    this.elGuide.innerHTML = `
      ${dict.l4AnchorLabel}<strong>${y.baseAnchor}</strong> | 
      ${remText}<strong>${y.rem}</strong> | 
      ${dict.l4LeapsInRemLabel}<strong>${y.leapsInRem}</strong>
    `;
  }

  public next(): void {
    this.clearPendingTimer();
    this.currentYear = Math.floor(Math.random() * 100);
    this.yearInfo = getYearCode(this.currentYear);
    this.renderYearPrompt();

    this.setFeedback(this.elFeedback, null, '');
    this.resetButtonHighlights(this.elGrid, '.btn-digit-option');
  }

  private check(selectedCode: number, btn: HTMLElement): void {
    if (!this.yearInfo) return;
    const dict = getDictionary(this.currentLang);

    if (selectedCode === this.yearInfo.yearCode) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.setFeedback(this.elFeedback, 'correct', dict.l4FeedbackCorrectCode);
      this.scheduleNext(() => this.next(), 650);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      const msg = formatTemplate(dict.l4FeedbackWrongCode, {
        year: this.currentYear,
        code: this.yearInfo.yearCode,
        rem: this.yearInfo.rem,
        leaps: this.yearInfo.leapsInRem
      });
      this.setFeedback(this.elFeedback, 'wrong', msg);
    }
  }

  public nextLeap(): void {
    if (this.leapTimerId !== null) {
      clearTimeout(this.leapTimerId);
      this.leapTimerId = null;
    }

    const pickCentury = Math.random() < 0.2;
    if (pickCentury) {
      const centuries = [1600, 1700, 1800, 1900, 2000, 2100];
      this.currentLeapYear = centuries[Math.floor(Math.random() * centuries.length)];
    } else {
      this.currentLeapYear = 1900 + Math.floor(Math.random() * 140);
    }

    this.elLeapPrompt.textContent = this.currentLang === 'en'
      ? `Year ${this.currentLeapYear}`
      : `${this.currentLeapYear} год`;
    this.setFeedback(this.elLeapFeedback, null, '');
  }

  private checkLeap(userAnswer: boolean): void {
    const dict = getDictionary(this.currentLang);
    const actuallyLeap = isLeapYear(this.currentLeapYear);
    const tens = Math.floor((this.currentLeapYear % 100) / 10);
    const lastDigit = this.currentLeapYear % 10;
    const isCentury = this.currentLeapYear % 100 === 0;

    let explanation = '';
    if (isCentury) {
      explanation = actuallyLeap
        ? formatTemplate(dict.l4CenturyDiv400Leap, { year: this.currentLeapYear })
        : formatTemplate(dict.l4CenturyDiv400Common, { year: this.currentLeapYear });
    } else if (tens % 2 === 0) {
      explanation = actuallyLeap
        ? formatTemplate(dict.l4EvenTensLeap, { tens, last: lastDigit })
        : formatTemplate(dict.l4EvenTensCommon, { tens, last: lastDigit });
    } else {
      explanation = actuallyLeap
        ? formatTemplate(dict.l4OddTensLeap, { tens, last: lastDigit })
        : formatTemplate(dict.l4OddTensCommon, { tens, last: lastDigit });
    }

    if (userAnswer === actuallyLeap) {
      sound.playSuccess();
      this.setFeedback(this.elLeapFeedback, 'correct', `${dict.btnCorrect} ${explanation}`);
      if (this.leapTimerId !== null) clearTimeout(this.leapTimerId);
      this.leapTimerId = window.setTimeout(() => {
        this.leapTimerId = null;
        this.nextLeap();
      }, 950);
    } else {
      sound.playError();
      this.setFeedback(this.elLeapFeedback, 'wrong', `${dict.btnWrong} ${explanation}`);
    }
  }

  public override destroy(): void {
    super.destroy();
    if (this.leapTimerId !== null) {
      clearTimeout(this.leapTimerId);
      this.leapTimerId = null;
    }
  }
}
