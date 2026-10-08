/**
 * МЕНЕДЖЕР СТАТИСТИКИ И НАСТРОЕК (LocalStorage)
 * Предоставляет безопасный доступ к локальному хранилищу с защитой
 * от исключений в приватном режиме (Private Browsing / QuotaExceeded).
 */

export interface StatsData {
  streak: number;
  bestStreak: number;
  totalSolved: number;
  bestTime: number; // секунды, 0 если нет рекорда
}

const STORAGE_KEYS = {
  STREAK: 'cal_streak',
  BEST_STREAK: 'cal_best_streak',
  TOTAL_SOLVED: 'cal_total_solved',
  BEST_TIME: 'cal_best_time',
  LANG: 'cal_lang'
} as const;

function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Игнорируем в случае блокировки cookie или переполнения квоты
  }
}

export class StorageManager {
  public static getStats(): StatsData {
    return {
      streak: parseInt(safeGetItem(STORAGE_KEYS.STREAK) || '0', 10),
      bestStreak: parseInt(safeGetItem(STORAGE_KEYS.BEST_STREAK) || '0', 10),
      totalSolved: parseInt(safeGetItem(STORAGE_KEYS.TOTAL_SOLVED) || '0', 10),
      bestTime: parseFloat(safeGetItem(STORAGE_KEYS.BEST_TIME) || '0'),
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

    safeSetItem(STORAGE_KEYS.STREAK, stats.streak.toString());
    safeSetItem(STORAGE_KEYS.BEST_STREAK, stats.bestStreak.toString());
    safeSetItem(STORAGE_KEYS.TOTAL_SOLVED, stats.totalSolved.toString());
    safeSetItem(STORAGE_KEYS.BEST_TIME, stats.bestTime.toString());

    return { isNewRecord, stats };
  }

  public static addFail(): StatsData {
    const stats = this.getStats();
    stats.streak = 0;
    safeSetItem(STORAGE_KEYS.STREAK, '0');
    return stats;
  }

  // Настройки видимости подсказок
  public static getHintHidden(key: string): boolean {
    return safeGetItem(key) === 'true';
  }

  public static setHintHidden(key: string, hidden: boolean): void {
    safeSetItem(key, hidden ? 'true' : 'false');
  }

  // Настройка языка интерфейса
  public static getLanguage(): 'ru' | 'en' {
    const saved = safeGetItem(STORAGE_KEYS.LANG);
    return (saved === 'en' || saved === 'ru') ? saved : 'ru';
  }

  public static setLanguage(lang: 'ru' | 'en'): void {
    safeSetItem(STORAGE_KEYS.LANG, lang);
  }
}
