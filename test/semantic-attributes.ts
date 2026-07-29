import { expect } from '@open-wc/testing';

/**
 * Browser-test convention for optional semantics: verify that a component
 * leaves absent attributes out of its rendered DOM, then run axe against the
 * same element so a visible/slotted label remains a usable accessible name.
 */
export async function expectVisibleNameWithoutOptionalAttributes(
  element: HTMLElement,
  attributes: string[],
): Promise<void> {
  for (const attribute of attributes) {
    expect(element.hasAttribute(attribute), `${attribute} should be absent`).to
      .be.false;
  }

  await expect(element).to.be.accessible();
}
