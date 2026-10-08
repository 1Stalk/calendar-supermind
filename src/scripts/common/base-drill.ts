import type { Lang } from '../../lib/i18n';

/**
 * Базовый класс для тренировочных режимов (Level 1..5).
 * Изолирует работу с таймерами переключения, очистку состояний кнопок
 * и стандартизированный вывод сообщений обратной связи.
 */
export abstract class BaseDrill {
  protected currentLang: Lang = 'ru';
  private pendingTimerId: number | null = null;

  /**
   * Безопасно планирует переход к следующему вопросу,
   * гарантируя отмену предыдущего незавершённого таймера (защита от race conditions).
   */
  protected scheduleNext(callback: () => void, delayMs: number): void {
    this.clearPendingTimer();
    this.pendingTimerId = window.setTimeout(() => {
      this.pendingTimerId = null;
      callback();
    }, delayMs);
  }

  /**
   * Сбрасывает активный отложенный таймер.
   */
  public clearPendingTimer(): void {
    if (this.pendingTimerId !== null) {
      clearTimeout(this.pendingTimerId);
      this.pendingTimerId = null;
    }
  }

  /**
   * Сбрасывает классы подсветки (correct / wrong) для кнопок внутри контейнера.
   */
  protected resetButtonHighlights(container: HTMLElement, selector: string = 'button'): void {
    container.querySelectorAll<HTMLElement>(selector).forEach(btn => {
      btn.classList.remove('correct', 'wrong');
    });
  }

  /**
   * Выводит сообщение в блок обратной связи с нужным статусом.
   */
  protected setFeedback(element: HTMLElement, status: 'correct' | 'wrong' | null, text: string): void {
    element.textContent = text;
    element.className = status ? `feedback-box ${status}` : 'feedback-box';
  }

  /**
   * Обновление языка интерфейса.
   */
  public abstract updateLanguage(lang: Lang): void;

  /**
   * Очистка ресурсов при необходимости.
   */
  public destroy(): void {
    this.clearPendingTimer();
  }
}
