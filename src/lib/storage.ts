/**
 * МЕНЕДЖЕР СТАТИСТИКИ И НАСТРОЕК (LocalStorage)
 */

export interface StatsData {
  streak: number;
  bestStreak: number;
  totalSolved: number;
  bestTime: number; // секунды, 0 если нет рекорда
}

export class StorageManager {
  private static KEY_STREAK = 'cal_streak';
  private static KEY_BEST_STREAK = 'cal_best_streak';
  private static KEY_TOTAL_SOLVED = 'cal_total_solved';
  private static KEY_BEST_TIME = 'cal_best_time';

  public static getStats(): StatsData {
    if (typeof window === 'undefined') {
      return { streak: 0, bestStreak: 0, totalSolved: 0, bestTime: 0 };
    }
    return {
      streak: parseInt(localStorage.getItem(this.KEY_STREAK) || '0', 10),
      bestStreak: parseInt(localStorage.getItem(this.KEY_BEST_STREAK) || '0', 10),
      totalSolved: parseInt(localStorage.getItem(this.KEY_TOTAL_SOLVED) || '0', 10),
      bestTime: parseFloat(localStorage.getItem(this.KEY_BEST_TIME) || '0'),
    };
  }

  public static addSuccess(elapsedSec: number): { isNewRecord: boolean; stats: StatsData } {
    const stats = this.getStats();
    stats.streak += 1;
    stats.totalSolved += 1;

    if (stats.streak > stats.bestStreak) {
      stats.bestStreak = stats.streak;
    }

    let isNewRecord = false;
    if (stats.bestTime === 0 || elapsedSec < stats.bestTime) {
      stats.bestTime = elapsedSec;
      isNewRecord = true;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.KEY_STREAK, stats.streak.toString());
      localStorage.setItem(this.KEY_BEST_STREAK, stats.bestStreak.toString());
      localStorage.setItem(this.KEY_TOTAL_SOLVED, stats.totalSolved.toString());
      localStorage.setItem(this.KEY_BEST_TIME, stats.bestTime.toString());
    }

    return { isNewRecord, stats };
  }

  public static addFail(): StatsData {
    const stats = this.getStats();
    stats.streak = 0;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.KEY_STREAK, '0');
    }
    return stats;
  }

  // Настройки видимости подсказок
  public static getHintHidden(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(key) === 'true';
  }

  public static setHintHidden(key: string, hidden: boolean) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, hidden ? 'true' : 'false');
  }

  // Настройка языка интерфейса
  private static KEY_LANG = 'cal_lang';

  public static getLanguage(): 'ru' | 'en' {
    if (typeof window === 'undefined') return 'ru';
    const saved = localStorage.getItem(this.KEY_LANG);
    return (saved === 'en' || saved === 'ru') ? saved : 'ru';
  }

  public static setLanguage(lang: 'ru' | 'en') {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.KEY_LANG, lang);
  }
}
