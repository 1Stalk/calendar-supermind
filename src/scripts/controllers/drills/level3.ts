import type { Lang } from '../../../lib/i18n';
import { getDictionary, formatTemplate } from '../../../lib/i18n';
import { sound } from '../../../lib/audio';
import { BaseDrill } from '../../common/base-drill';
import { getRequiredElement, getElement } from '../../common/dom-utils';

export class Level3DrillController extends BaseDrill {
  private elCardsView = getRequiredElement('l3-cards-view');
  private elQuizView = getRequiredElement('l3-quiz-view');
  private elPrompt = getRequiredElement('l3-prompt-display');
  private elHint = getRequiredElement('l3-mnemonic-hint');
  private elGrid = getRequiredElement('l3-buttons-grid');
  private elFeedback = getRequiredElement('l3-feedback');
  private currentQuizMonth: { name: string; code: number; story: string } | null = null;

  constructor() {
    super();
    this.renderCards();
    this.initQuizButtons();
    this.initSubTabs();
  }

  public updateLanguage(lang: Lang): void {
    this.currentLang = lang;
    this.renderCards();
    if (this.currentQuizMonth) {
      this.nextQuiz();
    }
  }

  private renderCards(): void {
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

  private initQuizButtons(): void {
    this.elGrid.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-digit-option';
      btn.textContent = i.toString();
      btn.addEventListener('click', () => this.check(i, btn));
      this.elGrid.appendChild(btn);
    }
  }

  private initSubTabs(): void {
    const btnCards = getElement('btn-subtab-cards');
    const btnQuiz = getElement('btn-subtab-quiz');

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

  public nextQuiz(): void {
    this.clearPendingTimer();
    const dict = getDictionary(this.currentLang);
    const leapToggle = getElement<HTMLInputElement>('l3-leap-toggle');
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
    this.setFeedback(this.elFeedback, null, '');
    this.resetButtonHighlights(this.elGrid, '.btn-digit-option');
  }

  private check(selectedCode: number, btn: HTMLElement): void {
    if (!this.currentQuizMonth) return;
    const dict = getDictionary(this.currentLang);

    if (selectedCode === this.currentQuizMonth.code) {
      btn.classList.add('correct');
      sound.playSuccess();
      this.setFeedback(this.elFeedback, 'correct', dict.l3FeedbackCorrect);
      this.scheduleNext(() => this.nextQuiz(), 600);
    } else {
      btn.classList.add('wrong');
      sound.playError();
      this.elHint.style.display = 'block';
      const msg = formatTemplate(dict.l3FeedbackWrong, {
        name: this.currentQuizMonth.name,
        code: this.currentQuizMonth.code
      });
      this.setFeedback(this.elFeedback, 'wrong', msg);
    }
  }
}
