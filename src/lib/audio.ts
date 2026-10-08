/**
 * СИНТЕЗАТОР ЗВУКОВ И ТАКТИЛЬНЫЙ ОТКЛИК (Web Audio API + Navigator Vibrate)
 * Синтезирует звуки в браузере без внешних звуковых файлов.
 */

type WindowWithWebkitAudio = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const SOUND_STORAGE_KEY = 'cal_sound_enabled';

class SoundController {
  private enabled: boolean = true;
  private ctx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SOUND_STORAGE_KEY);
        this.enabled = saved !== null ? saved === 'true' : true;
      } catch {
        this.enabled = true;
      }
    }
  }

  private initCtx(): void {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const win = window as WindowWithWebkitAudio;
      const AudioCtx = win.AudioContext || win.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Игнорируем ошибку resume до пользовательского жеста
      });
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, val ? 'true' : 'false');
      } catch {
        // Игнорируем в случае блокировки storage
      }
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    if (this.enabled) {
      this.playSuccess();
    }
    return this.enabled;
  }

  private vibrate(ms: number | number[]): void {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Игнорируем в браузерах без поддержки или с блокировкой
      }
    }
  }

  public playSuccess(): void {
    this.vibrate(18);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, t); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, t + 0.15); // A5

    osc2.frequency.setValueAtTime(880, t);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, t + 0.2); // D6

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  public playRecord(): void {
    this.vibrate([25, 40, 35]);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    frequencies.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      gain.gain.setValueAtTime(0.14, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.4);
    });
  }

  public playError(): void {
    this.vibrate([40, 30, 40]);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.22);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playClick(): void {
    this.vibrate(8);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.035);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  }
}

export const sound = new SoundController();
