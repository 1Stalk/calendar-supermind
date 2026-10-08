import type { Lang } from '../../../lib/i18n';
import { getDictionary, formatTemplate } from '../../../lib/i18n';
import { sound } from '../../../lib/audio';
import { BaseDrill } from '../../common/base-drill';
import { getRequiredElement } from '../../common/dom-utils';

export class Level1DrillController extends BaseDrill {
  private elPrompt = getRequiredElement('l1-prompt-display');
  private elGrid = getRequiredElement('l1-buttons-grid');
  private elFeedback = getRequiredElement('l1-feedback');
  private currentQuestion: { code: number } | null = null;

  constructor() {
    super();
    this.initButtons();
    this.next();
  }

  public updateLanguage(lang: Lang): void {
    this.currentLang = lang;
    this.initButtons();
    if (this.currentQuestion) {
      const dict = getDictionary(this.currentLang);
      this.elPrompt.textContent = dict.weekdays[this.currentQuestion.code];
    }
  }

  private initButtons(): void {
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

  public next(): void {
    this.clearPendingTimer();
    const code = Math.floor(Math.random() * 7);
    this.currentQuestion = { code };
    const dict = getDictionary(this.currentLang);
    this.elPrompt.textContent = dict.weekdays[code];
    this.setFeedback(this.elFeedback, null, '');
    this.resetButtonHighlights(this.elGrid, '.l1-btn');
  }

  private check(selectedCode: number, btn: HTMLElement): void {
    if (!this.currentQuestion) return;
    const dict = getDictionary(this.currentLang);
    const expectedCode = this.currentQuestion.code;
    const expectedName = dict.weekdays[expectedCode];

    if (selectedCode === expectedCode) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.setFeedback(this.elFeedback, 'correct', dict.l1FeedbackCorrect);
      this.scheduleNext(() => this.next(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      const msg = formatTemplate(dict.l1FeedbackWrong, {
        name: expectedName,
        code: expectedCode
      });
      this.setFeedback(this.elFeedback, 'wrong', msg);
    }
  }
}
