import type { Lang } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { sound } from '../../lib/audio';
import { StorageManager } from '../../lib/storage';
import { getElement } from '../common/dom-utils';

export function setupHintToggle(
  btnId: string,
  targetElementIds: string[],
  storageKey: string,
  getLang: () => Lang
): (() => void) | undefined {
  const btn = getElement(btnId);
  if (!btn) return undefined;

  const hintText = btn.querySelector<HTMLElement>('.hint-text');
  let isHidden = StorageManager.getHintHidden(storageKey);

  function update(): void {
    const dict = getDictionary(getLang());
    targetElementIds.forEach(id => {
      const el = getElement(id);
      if (el) {
        if (isHidden) {
          el.classList.add('hidden-hint');
        } else {
          el.classList.remove('hidden-hint');
        }
      }
    });
    if (hintText) {
      hintText.textContent = isHidden ? dict.hintShow : dict.hintHide;
    }
  }

  update();

  btn.addEventListener('click', () => {
    sound.playClick();
    isHidden = !isHidden;
    StorageManager.setHintHidden(storageKey, isHidden);
    update();
  });

  return update;
}
