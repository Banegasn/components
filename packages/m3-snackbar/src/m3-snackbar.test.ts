import { html, fixture, expect } from '@open-wc/testing';
import { describe, it, vi } from 'vitest';
import './m3-snackbar.js';
import type { M3Snackbar } from './m3-snackbar.js';

async function settleSlotChange(el: M3Snackbar) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
}

async function finishExit(el: M3Snackbar) {
  await el.updateComplete;
  const snackbar = el.shadowRoot!.querySelector('.snackbar')!;
  snackbar.dispatchEvent(
    new AnimationEvent('animationend', {
      animationName: 'snackbar-exit',
      bubbles: true,
    }),
  );
  await el.updateComplete;
}

describe('M3Snackbar', () => {
  it('is hidden by default', async () => {
    const el = await fixture<M3Snackbar>(html`<m3-snackbar></m3-snackbar>`);
    expect(el.shadowRoot!.querySelector('.snackbar')).to.not.exist;
  });

  it('renders when open', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open>Message</m3-snackbar>`,
    );
    const snackbar = el.shadowRoot!.querySelector('.snackbar');
    expect(snackbar).to.exist;
    expect(snackbar!.getAttribute('role')).to.equal('status');
  });

  it('displays message property', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open message="Hello"></m3-snackbar>`,
    );
    const msg = el.shadowRoot!.querySelector('.message');
    expect(msg!.textContent!.trim()).to.equal('Hello');
  });

  it('supports action slot', async () => {
    const el = await fixture<M3Snackbar>(html`
      <m3-snackbar open>
        Message
        <button slot="action">Undo</button>
      </m3-snackbar>
    `);
    const action = el.shadowRoot!.querySelector('.action');
    expect(action).to.exist;
    await settleSlotChange(el);
    expect(action!.hasAttribute('hidden')).to.be.false;
  });

  it('keeps an initially absent action region collapsed', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open>Message</m3-snackbar>`,
    );
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to
      .be.true;
  });

  it('reacts to action add, remove, reassignment, and reconnect', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open duration="0">Message</m3-snackbar>`,
    );
    const action = document.createElement('button');
    action.slot = 'action';
    action.textContent = 'Undo';

    el.append(action);
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to
      .be.false;

    action.slot = '';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to
      .be.true;

    el.remove();
    document.body.append(el);
    action.slot = 'action';
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to
      .be.false;

    action.remove();
    await settleSlotChange(el);
    expect(el.shadowRoot!.querySelector('.action')!.hasAttribute('hidden')).to
      .be.true;
    el.remove();
  });

  it('dispatches one programmatic dismissal after the exit animation ends', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open duration="0" style="--_animation-duration: 1s"
        >Test</m3-snackbar
      >`,
    );
    const reasons: string[] = [];
    el.addEventListener('snackbar-dismiss', (event) => {
      reasons.push((event as CustomEvent<{ reason: string }>).detail.reason);
    });
    el.dismiss();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(reasons).to.deep.equal([]);
    await finishExit(el);
    expect(el.open).to.be.false;
    expect(reasons).to.deep.equal(['programmatic']);
  });

  it('finishes immediately when reduced motion is requested', async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: true }),
    });

    try {
      const el = await fixture<M3Snackbar>(
        html`<m3-snackbar open duration="0">Test</m3-snackbar>`,
      );
      el.dismiss();
      await el.updateComplete;
      expect(el.open).to.be.false;
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('uses animation completion rather than a guessed CSS duration for teardown', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open duration="0" style="--_animation-duration: 1s"
        >Test</m3-snackbar
      >`,
    );
    el.dismiss();
    await el.updateComplete;
    expect(el.open).to.be.true;
    await finishExit(el);
    expect(el.open).to.be.false;
  });

  it('dispatches snackbar-action on action click', async () => {
    const el = await fixture<M3Snackbar>(html`
      <m3-snackbar open duration="0" style="--_animation-duration: 1s">
        Deleted
        <button slot="action">Undo</button>
      </m3-snackbar>
    `);
    let actionFired = false;
    let dismissReason: string | undefined;
    el.addEventListener('snackbar-action', () => {
      actionFired = true;
    });
    el.addEventListener('snackbar-dismiss', (event) => {
      dismissReason = (event as CustomEvent<{ reason: string }>).detail.reason;
    });
    const actionSlot = el.shadowRoot!.querySelector('.action')!;
    actionSlot.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await finishExit(el);
    expect(actionFired).to.be.true;
    expect(dismissReason).to.equal('action');
  });

  it('keeps a snackbar open when show() reopens it during exit', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open duration="0" style="--_animation-duration: 1s"
        >Test</m3-snackbar
      >`,
    );
    let dismisses = 0;
    el.addEventListener('snackbar-dismiss', () => {
      dismisses += 1;
    });

    el.dismiss();
    await el.updateComplete;
    const exitingSnackbar = el.shadowRoot!.querySelector('.snackbar')!;
    el.show();
    await el.updateComplete;
    exitingSnackbar.dispatchEvent(
      new AnimationEvent('animationend', {
        animationName: 'snackbar-exit',
        bubbles: true,
      }),
    );
    await el.updateComplete;

    expect(el.open).to.be.true;
    expect(
      el.shadowRoot!.querySelector('.snackbar')!.classList.contains('leaving'),
    ).to.be.false;
    expect(dismisses).to.equal(0);
  });

  it('restarts auto-dismiss from a duration change', async () => {
    vi.useFakeTimers();
    try {
      const el = await fixture<M3Snackbar>(
        html`<m3-snackbar open duration="100" style="--_animation-duration: 1s"
          >Test</m3-snackbar
        >`,
      );
      await vi.advanceTimersByTimeAsync(99);
      expect(
        el
          .shadowRoot!.querySelector('.snackbar')!
          .classList.contains('leaving'),
      ).to.be.false;

      el.duration = 200;
      await el.updateComplete;
      await vi.advanceTimersByTimeAsync(199);
      expect(
        el
          .shadowRoot!.querySelector('.snackbar')!
          .classList.contains('leaving'),
      ).to.be.false;

      await vi.advanceTimersByTimeAsync(1);
      await el.updateComplete;
      expect(
        el
          .shadowRoot!.querySelector('.snackbar')!
          .classList.contains('leaving'),
      ).to.be.true;
      await finishExit(el);
      expect(el.open).to.be.false;
    } finally {
      vi.useRealTimers();
    }
  });

  it('reports timeout and replacement exactly once per lifecycle', async () => {
    vi.useFakeTimers();
    try {
      const el = await fixture<M3Snackbar>(
        html`<m3-snackbar open duration="100" style="--_animation-duration: 1s"
          >Test</m3-snackbar
        >`,
      );
      const reasons: string[] = [];
      el.addEventListener('snackbar-dismiss', (event) => {
        reasons.push((event as CustomEvent<{ reason: string }>).detail.reason);
      });

      el.show();
      expect(reasons).to.deep.equal(['replacement']);
      await vi.advanceTimersByTimeAsync(100);
      await el.updateComplete;
      await finishExit(el);
      expect(reasons).to.deep.equal(['replacement', 'timeout']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancels auto-dismiss and exit listeners on disconnect', async () => {
    vi.useFakeTimers();
    try {
      const el = await fixture<M3Snackbar>(
        html`<m3-snackbar open duration="100" style="--_animation-duration: 1s"
          >Test</m3-snackbar
        >`,
      );
      let dismisses = 0;
      el.addEventListener('snackbar-dismiss', () => {
        dismisses += 1;
      });
      el.dismiss();
      await el.updateComplete;
      const exitingSnackbar = el.shadowRoot!.querySelector('.snackbar')!;
      el.remove();
      exitingSnackbar.dispatchEvent(
        new AnimationEvent('animationend', {
          animationName: 'snackbar-exit',
          bubbles: true,
        }),
      );
      await vi.advanceTimersByTimeAsync(100);

      expect(el.open).to.be.true;
      expect(dismisses).to.equal(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('supports two-line mode', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open lines="2">Long message</m3-snackbar>`,
    );
    expect(el.getAttribute('lines')).to.equal('2');
  });

  it('supports show() method', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar>Message</m3-snackbar>`,
    );
    el.show();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector('.snackbar')).to.exist;
  });

  it('is accessible when open', async () => {
    const el = await fixture<M3Snackbar>(
      html`<m3-snackbar open duration="0">Accessible message</m3-snackbar>`,
    );
    await expect(el).to.be.accessible();
  });
});
