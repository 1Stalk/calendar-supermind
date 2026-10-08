/**
 * Безопасная интерполяция именованных параметров в шаблонных строках.
 * Пример: formatTemplate("Год: '{yy} ({year})", { yy: '97', year: 1997 }) -> "Год: '97 (1997)"
 */
export function formatTemplate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      return String(params[key]);
    }
    return match;
  });
}
