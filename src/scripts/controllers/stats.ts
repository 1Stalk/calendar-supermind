import type { Lang } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { StorageManager, type StatsData } from '../../lib/storage';
import { getElement } from '../common/dom-utils';

export class StatsUIController {
  private elStreak = getElement('stat-streak');
  private elBestStreak = getElement('stat-best-streak');
  private elTotalSolved = getElement('stat-total-solved');
  private elBestTime = getElement('stat-best-time');
  private currentLang: Lang = 'ru';

  constructor() {
    this.render(StorageManager.getStats());
  }

  public updateLanguage(lang: Lang): void {
    this.currentLang = lang;
    this.render(StorageManager.getStats());
  }

  public render(data: StatsData): void {
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

  public recordFail(): void {
    const stats = StorageManager.addFail();
    this.render(stats);
  }
}
