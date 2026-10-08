/**
 * КАЛЕНДАРНЫЙ СВЕРХМОЗГ — КЛИЕНТСКИЙ КООРДИНАТОР ПРИЛОЖЕНИЯ
 * 
 * Точка входа для сборщика скриптов.
 * Инициализирует модульные контроллеры, управляет языком,
 * звуком и глобальными директивами локализации.
 */

import { type Lang, getDictionary } from '../lib/i18n';
import { sound } from '../lib/audio';
import { StorageManager } from '../lib/storage';

import { StatsUIController } from './controllers/stats';
import { SimulatorController } from './controllers/simulator';
import { NavigationController } from './controllers/navigation';
import { CheatSheetController } from './controllers/cheat-sheet';
import { setupHintToggle } from './controllers/hints';

import { Level1DrillController } from './controllers/drills/level1';
import { Level2DrillController } from './controllers/drills/level2';
import { Level3DrillController } from './controllers/drills/level3';
import { Level4DrillController } from './controllers/drills/level4';
import { Level5DrillController } from './controllers/drills/level5';
import { getElement } from './common/dom-utils';

function initApp(): void {
  let currentLang: Lang = StorageManager.getLanguage();

  // Инициализация контроллеров
  new NavigationController();
  const statsUI = new StatsUIController();
  const simController = new SimulatorController(statsUI);
  const l1Drill = new Level1DrillController();
  const l2Drill = new Level2DrillController();
  const l3Drill = new Level3DrillController();
  const l4Drill = new Level4DrillController();
  const l5Drill = new Level5DrillController();
  const cheatSheetCtrl = new CheatSheetController();

  // Настройка переключателей подсказок
  const hintUpdates: Array<() => void> = [];

  const updateL2Hint = setupHintToggle(
    'btn-toggle-l2-hints',
    ['l2-header-desc'],
    'cal_hide_l2',
    () => currentLang
  );
  if (updateL2Hint) hintUpdates.push(updateL2Hint);

  const updateL4Hint = setupHintToggle(
    'btn-toggle-l4-hints',
    ['l4-header-desc', 'l4-guide-steps', 'l4-leap-rule-reminder'],
    'cal_hide_l4',
    () => currentLang
  );
  if (updateL4Hint) hintUpdates.push(updateL4Hint);

  const updateL5Hint = setupHintToggle(
    'btn-toggle-l5-hints',
    ['l5-header-desc'],
    'cal_hide_l5',
    () => currentLang
  );
  if (updateL5Hint) hintUpdates.push(updateL5Hint);

  function applyLanguage(lang: Lang): void {
    currentLang = lang;
    StorageManager.setLanguage(lang);
    document.documentElement.lang = lang;

    document.title = lang === 'en'
      ? 'Calendar Supermind | Mental Date Calculation Trainer'
      : 'Календарный Сверхмозг | Тренажёр счёта дат в уме';

    const dict = getDictionary(lang);

    // 1. Обновление всех статических текстов с атрибутом data-i18n
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n') as keyof typeof dict;
      if (key && dict[key] !== undefined) {
        el.textContent = dict[key] as string;
      }
    });

    // 2. Обновление title атрибутов
    document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title') as keyof typeof dict;
      if (key && dict[key] !== undefined) {
        el.setAttribute('title', dict[key] as string);
      }
    });

    // 3. Обновление aria-label атрибутов
    document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria') as keyof typeof dict;
      if (key && dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key] as string);
      }
    });

    // 4. Обновление бейджа на кнопке глобуса
    const langIndicator = getElement('lang-indicator');
    if (langIndicator) {
      langIndicator.textContent = lang.toUpperCase();
    }
    const btnLang = getElement('btn-lang-toggle');
    if (btnLang) {
      btnLang.setAttribute('title', dict.langBtnTitle);
      btnLang.setAttribute('aria-label', dict.langBtnAria);
    }

    // 5. Обновление контроллеров
    statsUI.updateLanguage(lang);
    simController.updateLanguage(lang);
    l1Drill.updateLanguage(lang);
    l2Drill.updateLanguage(lang);
    l3Drill.updateLanguage(lang);
    l4Drill.updateLanguage(lang);
    l5Drill.updateLanguage(lang);
    cheatSheetCtrl.render(lang);

    // Обновление состояния кнопок подсказок
    hintUpdates.forEach(fn => fn());
  }

  // Обработчик кнопки глобуса
  const btnLangToggle = getElement('btn-lang-toggle');
  if (btnLangToggle) {
    btnLangToggle.addEventListener('click', () => {
      sound.playClick();
      const nextLang: Lang = currentLang === 'ru' ? 'en' : 'ru';
      applyLanguage(nextLang);
    });
  }

  // Переключатель звука
  const btnSound = getElement('btn-sound-toggle');
  const iconSoundOn = getElement('icon-sound-on');
  const iconSoundOff = getElement('icon-sound-off');

  function updateSoundIcon(enabled: boolean): void {
    if (iconSoundOn && iconSoundOff) {
      iconSoundOn.style.display = enabled ? 'block' : 'none';
      iconSoundOff.style.display = enabled ? 'none' : 'block';
    }
  }

  if (btnSound) {
    updateSoundIcon(sound.isEnabled());
    btnSound.addEventListener('click', () => {
      const nowEnabled = sound.toggle();
      updateSoundIcon(nowEnabled);
    });
  }

  // Применяем сохранённый язык при старте
  applyLanguage(currentLang);
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
