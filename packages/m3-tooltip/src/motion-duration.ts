/** Reads the computed motion role so interaction delay honors consumer token overrides. */
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
