/**
 * Wait for Lit to finish its update, then let the browser apply the rendered
 * DOM. Browser suites use this instead of arbitrary timer delays.
 */
export async function settleLitElement(element: {
  updateComplete: Promise<unknown>;
}) {
  await element.updateComplete;
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await element.updateComplete;
}

/**
 * Collect typed custom events and make listener teardown explicit in tests.
 * The component contracts can therefore assert both event payloads and the
 * cleanup that keeps a detached fixture from retaining test listeners.
 */
export function captureCustomEvents<Detail>(target: EventTarget, type: string) {
  const events: CustomEvent<Detail>[] = [];
  const listener = (event: Event) => events.push(event as CustomEvent<Detail>);
  target.addEventListener(type, listener);

  return {
    events,
    dispose: () => target.removeEventListener(type, listener),
  };
}
