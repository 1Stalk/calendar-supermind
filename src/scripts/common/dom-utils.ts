/**
 * Типобезопасные утилиты для доступа к DOM элементам.
 */

/**
 * Получает элемент по идентификатору или выбрасывает понятную ошибку,
 * если элемент отсутствует в DOM (вместо падений от неявных !-ассертов).
 */
export function getRequiredElement<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`[DOM Error] Обязательный элемент с ID "${id}" не найден в разметке.`);
  }
  return element as T;
}

/**
 * Безопасное получение опционального элемента.
 */
export function getElement<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}
