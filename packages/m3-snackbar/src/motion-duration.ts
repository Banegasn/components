/**
 * Runtime cleanup reads the same computed custom property used by CSS. This
 * keeps consumer token overrides and reduced-motion media rules in sync with
 * JavaScript lifetimes instead of duplicating a millisecond constant.
 */
export function motionDuration(element: Element, property: string): number {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 0;
  }

  const value = getComputedStyle(element).getPropertyValue(property).trim().split(',')[0] ?? '';
  const match = /^(?<value>[0-9.]+)(?<unit>ms|s)$/.exec(value);
  if (!match?.groups) return 0;

  const amount = Number(match.groups.value);
  return match.groups.unit === 's' ? amount * 1_000 : amount;
}
