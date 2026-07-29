import { expect, fixture, html } from '@open-wc/testing';
import { describe, it } from 'vitest';
import './m3-badge.js';
import type { M3Badge } from './m3-badge.js';

describe('M3Badge semantics', () => {
  it('keeps dot badges out of the accessibility tree', async () => {
    const element = await fixture<M3Badge>(html`<m3-badge></m3-badge>`);
    const badge = element.shadowRoot!.querySelector<HTMLElement>('.badge')!;

    expect(badge.getAttribute('aria-hidden')).to.equal('true');
    expect(badge.hasAttribute('role')).to.be.false;
    expect(badge.hasAttribute('aria-label')).to.be.false;
  });

  it('exposes a named badge as a concise status', async () => {
    const element = await fixture<M3Badge>(
      html`<m3-badge label="3"></m3-badge>`,
    );
    const badge = element.shadowRoot!.querySelector<HTMLElement>('.badge')!;

    expect(badge.getAttribute('role')).to.equal('status');
    expect(badge.getAttribute('aria-label')).to.equal('3 notifications');
    expect(badge.hasAttribute('aria-hidden')).to.be.false;
  });

  it('removes hidden badges from the accessibility tree even when named', async () => {
    const element = await fixture<M3Badge>(
      html`<m3-badge label="3" hidden></m3-badge>`,
    );
    const badge = element.shadowRoot!.querySelector<HTMLElement>('.badge')!;

    expect(badge.getAttribute('aria-hidden')).to.equal('true');
    expect(badge.hasAttribute('role')).to.be.false;
  });
});
