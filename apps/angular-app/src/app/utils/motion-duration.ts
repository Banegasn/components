/**
 * JavaScript teardown reads the rendered CSS token rather than mirroring a
 * duration constant. Theme, consumer, and reduced-motion overrides therefore
 * change the animation and its lifetime together.
 */
export function motionDuration(element: Element, property: string): number {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 0;
  }

  const value = getComputedStyle(element).getPropertyValue(property).trim().split(',')[0] ?? '';
  const match = /^(?<value>[0-9.]+)(?<unit>ms|s)$/.exec(value);
  if (!match?.groups) return 0;

  const amount = Number(match.groups['value']);
  return match.groups['unit'] === 's' ? amount * 1_000 : amount;
}
