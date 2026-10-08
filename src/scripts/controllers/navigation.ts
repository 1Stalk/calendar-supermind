import { sound } from '../../lib/audio';

export class NavigationController {
  private navChips = document.querySelectorAll<HTMLElement>('.nav-chip');
  private panels = document.querySelectorAll<HTMLElement>('.tab-panel');

  constructor() {
    this.initEvents();
  }

  private initEvents(): void {
    this.navChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playClick();
        const targetId = chip.getAttribute('data-tab');

        this.navChips.forEach(c => c.classList.remove('active'));
        this.panels.forEach(p => p.classList.remove('active'));

        chip.classList.add('active');
        const targetPanel = targetId ? document.getElementById(targetId) : null;
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }
}
