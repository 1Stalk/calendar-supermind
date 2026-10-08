import type { Lang } from '../../../lib/i18n';
import { getDictionary, formatTemplate } from '../../../lib/i18n';
import { sound } from '../../../lib/audio';
import { BaseDrill } from '../../common/base-drill';
import { getRequiredElement } from '../../common/dom-utils';

export class Level5DrillController extends BaseDrill {
  private elPrompt = getRequiredElement('l5-prompt-display');
  private elGrid = getRequiredElement('l5-buttons-grid');
  private elFeedback = getRequiredElement('l5-feedback');
  private currentCentury: number = 0;

  constructor() {
    super();
    this.initButtons();
    this.next();
  }

  public updateLanguage(lang: Lang): void {
    this.currentLang = lang;
    if (this.currentCentury) {
      const dict = getDictionary(this.currentLang);
      this.elPrompt.textContent = formatTemplate(dict.l5CenturyYears, { century: this.currentCentury });
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

  public next(): void {
    this.clearPendingTimer();
    const dict = getDictionary(this.currentLang);
    const centuries = [16, 17, 18, 19, 20, 21];
    this.currentCentury = centuries[Math.floor(Math.random() * centuries.length)];
    this.elPrompt.textContent = formatTemplate(dict.l5CenturyYears, { century: this.currentCentury });
    this.setFeedback(this.elFeedback, null, '');
    this.resetButtonHighlights(this.elGrid, '.btn-digit-option');
  }

  private check(selectedCode: number, btn: HTMLElement): void {
    const dict = getDictionary(this.currentLang);
    const centuryOffsets: Record<number, number> = { 16: 6, 17: 4, 18: 2, 19: 0, 20: 6, 21: 4 };
    const expected = centuryOffsets[this.currentCentury];

    if (selectedCode === expected) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.setFeedback(this.elFeedback, 'correct', dict.l5FeedbackCorrect);
      this.scheduleNext(() => this.next(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      const msg = formatTemplate(dict.l5FeedbackWrong, {
        century: this.currentCentury,
        expected
      });
      this.setFeedback(this.elFeedback, 'wrong', msg);
    }
  }
}
