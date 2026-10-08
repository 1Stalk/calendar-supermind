import type { Lang } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { sound } from '../../lib/audio';
import { getElement } from '../common/dom-utils';

export class CheatSheetController {
  private elModal = getElement('modal-cheat-sheet');
  private btnOpen = getElement('btn-cheat-sheet');
  private btnClose = getElement('btn-close-cheat-sheet');

  private elMonthsTable = getElement('cheat-months-table');
  private elYearExample = getElement('cheat-year-example');
  private elLeapNote = getElement('cheat-leap-note');
  private elLeapRules = getElement('cheat-leap-rules');
  private elDaysChips = getElement('cheat-days-chips');

  constructor() {
    this.initEvents();
  }

  private initEvents(): void {
    if (!this.elModal) return;

    if (this.btnOpen) {
      this.btnOpen.addEventListener('click', () => {
        sound.playClick();
        this.open();
      });
    }

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => {
        sound.playClick();
        this.close();
      });
    }

    this.elModal.addEventListener('click', (e) => {
      if (e.target === this.elModal) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elModal && this.elModal.style.display !== 'none') {
        this.close();
      }
    });
  }

  public open(): void {
    if (this.elModal) {
      this.elModal.style.display = 'flex';
    }
  }

  public close(): void {
    if (this.elModal) {
      this.elModal.style.display = 'none';
    }
  }

  public render(lang: Lang): void {
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
