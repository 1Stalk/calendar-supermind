import type { Lang } from '../../../lib/i18n';
import { getDictionary, formatTemplate } from '../../../lib/i18n';
import { sound } from '../../../lib/audio';
import { BaseDrill } from '../../common/base-drill';
import { getRequiredElement } from '../../common/dom-utils';

export class Level2DrillController extends BaseDrill {
  private elPrompt = getRequiredElement('l2-prompt-display');
  private elGrid = getRequiredElement('l2-buttons-grid');
  private elFeedback = getRequiredElement('l2-feedback');
  private currentNum: number = 0;

  constructor() {
    super();
    this.initButtons();
    this.next();
  }

  public updateLanguage(lang: Lang): void {
    this.currentLang = lang;
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
    this.currentNum = 1 + Math.floor(Math.random() * 31);
    this.elPrompt.textContent = this.currentNum.toString();
    this.setFeedback(this.elFeedback, null, '');
    this.resetButtonHighlights(this.elGrid, '.btn-digit-option');
  }

  private check(selectedRem: number, btn: HTMLElement): void {
    const expected = this.currentNum % 7;
    const dict = getDictionary(this.currentLang);

    if (selectedRem === expected) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.setFeedback(this.elFeedback, 'correct', dict.l2FeedbackCorrect);
      this.scheduleNext(() => this.next(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      const expl = this.currentNum < 7
        ? formatTemplate(dict.l2FeedbackWrongSmall, { num: this.currentNum })
        : formatTemplate(dict.l2FeedbackWrongAnchor, { num: this.currentNum, expected });

      this.setFeedback(this.elFeedback, 'wrong', `${dict.btnWrong} (${expl})`);
    }
  }
}
