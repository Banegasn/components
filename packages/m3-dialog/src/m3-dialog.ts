import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { m3DialogStyles } from './m3-dialog.styles.js';

/** The action that initiated a dialog close request. */
export type M3DialogCloseReason =
  'action' | 'escape' | 'programmatic' | 'scrim';

export interface M3DialogCloseDetail {
  reason: M3DialogCloseReason;
}

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let dialogInstanceCount = 0;

function getDeepActiveElement(
  root: Document | ShadowRoot = document,
): Element | null {
  let activeElement = root.activeElement;

  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}

function isFocusable(element: HTMLElement): boolean {
  return (
    !element.matches('[disabled], [inert], [aria-hidden="true"]') &&
    element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility !== 'hidden'
  );
}

/**
 * Material Design 3 modal dialog.
 *
 * `m3-dialog` is deliberately a self-contained modal primitive. It does not
 * require a framework dialog service: opening it establishes focus and page
 * containment, and closing it restores the previous focus when possible.
 *
 * @fires dialog-open - Fired after the dialog becomes modal.
 * @fires dialog-request-close - A cancelable close request. Detail contains a close reason.
 * @fires dialog-close - Fired after the dialog closes. Detail contains a close reason.
 *
 * @slot - Dialog body content.
 * @slot icon - An optional icon above the headline.
 * @slot actions - Dialog actions.
 */
@customElement('m3-dialog')
export class M3Dialog extends LitElement {
  static styles = m3DialogStyles;

  private static readonly openDialogs: M3Dialog[] = [];
  private static readonly inertStates = new Map<HTMLElement, boolean>();
  private static pageStyleSnapshot:
    { bodyOverflow: string; documentOverflow: string } | undefined;
  private static bodyObserver: MutationObserver | undefined;

  /** Whether the dialog is open. Prefer show(), close(), or requestClose() for lifecycle events. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Text used for the generated dialog heading and accessible name. */
  @property({ type: String }) headline = '';

  /** Whether a scrim click requests close. */
  @property({ type: Boolean, attribute: 'close-on-scrim' }) closeOnScrim = true;

  /** Whether Escape requests close. */
  @property({ type: Boolean, attribute: 'close-on-escape' }) closeOnEscape =
    true;

  /** An external element ID that labels the dialog, overriding its headline. */
  @property({ type: String, attribute: 'aria-labelledby' }) ariaLabelledBy:
    string | null = null;

  /** An external element ID that describes the dialog, overriding its body content. */
  @property({ type: String, attribute: 'aria-describedby' }) ariaDescribedBy:
    string | null = null;

  @state() private hasDescription = false;

  private readonly instanceId = ++dialogInstanceCount;
  private readonly headlineId = `m3-dialog-headline-${this.instanceId}`;
  private readonly descriptionId = `m3-dialog-description-${this.instanceId}`;
  private opener: HTMLElement | null = null;
  private closeReason: M3DialogCloseReason = 'programmatic';
  private modalActivationComplete = Promise.resolve();
  private nativeActivationFrame: number | undefined;
  private nativeActivationEpoch = 0;
  private resolveModalActivation: (() => void) | undefined;

  connectedCallback() {
    super.connectedCallback();

    if (this.open) {
      this.activate();
      if (this.dialogElement) {
        this.scheduleNativeModalActivation();
      }
    }
  }

  disconnectedCallback() {
    this.deactivate(false);
    super.disconnectedCallback();
  }

  render() {
    const labelledBy =
      this.ariaLabelledBy?.trim() ||
      (this.headline ? this.headlineId : undefined);
    const describedBy =
      this.ariaDescribedBy?.trim() ||
      (this.hasDescription ? this.descriptionId : undefined);

    return html`
      <dialog
        class="dialog"
        role="dialog"
        tabindex="-1"
        aria-modal=${this.open ? 'true' : nothing}
        aria-hidden=${this.open ? nothing : 'true'}
        aria-labelledby=${labelledBy ?? nothing}
        aria-describedby=${describedBy ?? nothing}
        @cancel=${this.handleNativeCancel}
        @click=${this.handleDialogClick}
      >
        <div class="icon-slot"><slot name="icon"></slot></div>
        ${this.headline ? html`<h2 class="headline" id=${this.headlineId}>${this.headline}</h2>` : nothing}
        <div class="content" id=${this.descriptionId}>
          <slot @slotchange=${this.handleContentSlotChange}></slot>
        </div>
        <div class="actions"><slot name="actions"></slot></div>
      </dialog>
    `;
  }

  updated(changedProperties: Map<string, unknown>) {
    if (!changedProperties.has('open')) {
      return;
    }

    if (this.open) {
      this.activate();
      this.scheduleNativeModalActivation();
    } else if (changedProperties.get('open') === true) {
      this.deactivate();
    }
  }

  protected firstUpdated() {
    if (this.open) {
      this.activate();
      this.scheduleNativeModalActivation();
    }
  }

  /** Opens the dialog and returns after it has entered the native modal state. */
  async show(): Promise<void> {
    this.open = true;
    await this.whenOpened();
  }

  /** Waits until a rendered open dialog has entered the native modal state. */
  async whenOpened(): Promise<void> {
    await this.updateComplete;
    await this.modalActivationComplete;
  }

  /**
   * Requests a close. Consumers can prevent `dialog-request-close` to keep
   * the dialog open. Use `close('action')` for a button that completed an
   * action; action buttons are otherwise ordinary slotted controls.
   */
  close(reason: M3DialogCloseReason = 'programmatic'): boolean {
    return this.requestClose(reason);
  }

  /** Dispatches the cancelable close request and closes when it is accepted. */
  requestClose(reason: M3DialogCloseReason): boolean {
    if (!this.open) {
      return false;
    }

    const accepted = this.dispatchEvent(
      new CustomEvent<M3DialogCloseDetail>('dialog-request-close', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { reason },
      }),
    );

    if (!accepted) {
      return false;
    }

    this.closeReason = reason;
    this.open = false;
    return true;
  }

  private activate() {
    if (M3Dialog.openDialogs.includes(this)) {
      return;
    }

    const activeElement = getDeepActiveElement();
    this.opener =
      activeElement instanceof HTMLElement && !this.contains(activeElement)
        ? activeElement
        : null;
    M3Dialog.openDialogs.push(this);

    M3Dialog.updatePageContainment();
  }

  private scheduleNativeModalActivation() {
    if (this.nativeActivationFrame !== undefined) {
      return;
    }

    const activationEpoch = this.nativeActivationEpoch;
    this.modalActivationComplete = new Promise((resolve) => {
      this.resolveModalActivation = resolve;
      this.nativeActivationFrame = requestAnimationFrame(() => {
        this.nativeActivationFrame = undefined;
        const resolveActivation = this.resolveModalActivation;
        this.resolveModalActivation = undefined;

        if (
          activationEpoch === this.nativeActivationEpoch &&
          this.isConnected &&
          this.open &&
          M3Dialog.openDialogs.includes(this) &&
          this.showNativeModal()
        ) {
          this.dispatchEvent(
            new CustomEvent('dialog-open', {
              bubbles: true,
              composed: true,
              detail: { opener: this.opener },
            }),
          );
        }

        resolveActivation?.();

        requestAnimationFrame(() => {
          if (
            activationEpoch === this.nativeActivationEpoch &&
            this.open &&
            this.dialogElement?.open &&
            M3Dialog.topDialog === this
          ) {
            this.focusInitial();
          }
        });
      });
    });
  }

  private deactivate(restoreFocus = true) {
    this.cancelNativeModalActivation();
    const dialogIndex = M3Dialog.openDialogs.indexOf(this);

    if (dialogIndex === -1) {
      return;
    }

    M3Dialog.openDialogs.splice(dialogIndex, 1);
    this.closeNativeModal();
    M3Dialog.updatePageContainment();

    const reason = this.closeReason;
    this.closeReason = 'programmatic';
    this.dispatchEvent(
      new CustomEvent<M3DialogCloseDetail>('dialog-close', {
        bubbles: true,
        composed: true,
        detail: { reason },
      }),
    );

    if (restoreFocus) {
      this.restoreFocus();
    }
  }

  private handleNativeCancel(event: Event) {
    event.preventDefault();

    if (this.closeOnEscape && M3Dialog.topDialog === this) {
      this.requestClose('escape');
    }
  }

  private handleDialogClick(event: MouseEvent) {
    if (
      event.target === event.currentTarget &&
      this.closeOnScrim &&
      M3Dialog.topDialog === this
    ) {
      this.requestClose('scrim');
    }
  }

  private handleContentSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasDescription = slot
      .assignedNodes({ flatten: true })
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
      );
  }

  private focusInitial() {
    const focusableElements = this.getFocusableElements();
    const autofocusElement = focusableElements.find((element) =>
      element.hasAttribute('autofocus'),
    );
    (autofocusElement ?? focusableElements[0] ?? this.dialogElement)?.focus({
      preventScroll: true,
    });
  }

  private restoreFocus() {
    if (!this.opener?.isConnected) {
      return;
    }

    const activeDialog = M3Dialog.topDialog;
    if (activeDialog && !activeDialog.contains(this.opener)) {
      activeDialog.focusInitial();
      return;
    }

    this.opener.focus({ preventScroll: true });
  }

  private get dialogElement(): HTMLDialogElement | null {
    return this.shadowRoot?.querySelector<HTMLDialogElement>('.dialog') ?? null;
  }

  /**
   * The native modal dialog top layer is ordered by showModal() calls, not DOM
   * order or ancestor stacking contexts. Calling it from the modal stack makes
   * the most recently opened component the visual and pointer-event topmost.
   * It runs after containment has restored the active dialog from inertness.
   */
  private showNativeModal(): boolean {
    const dialog = this.dialogElement;
    if (dialog && !dialog.open) {
      dialog.showModal();
      return true;
    }

    return false;
  }

  private closeNativeModal() {
    const dialog = this.dialogElement;
    if (dialog?.open) {
      dialog.close();
    }
  }

  private cancelNativeModalActivation() {
    this.nativeActivationEpoch += 1;
    if (this.nativeActivationFrame !== undefined) {
      cancelAnimationFrame(this.nativeActivationFrame);
      this.nativeActivationFrame = undefined;
    }
    this.resolveModalActivation?.();
    this.resolveModalActivation = undefined;
    this.modalActivationComplete = Promise.resolve();
  }

  /** Finds focusable descendants across the light DOM and open component shadows. */
  private getFocusableElements(): HTMLElement[] {
    const focusableElements: HTMLElement[] = [];
    const visited = new Set<Element>();

    const visit = (root: ParentNode) => {
      for (const element of Array.from(root.children)) {
        if (
          visited.has(element) ||
          (element instanceof M3Dialog && element !== this)
        ) {
          continue;
        }

        visited.add(element);
        if (
          element instanceof HTMLElement &&
          element.matches(focusableSelector) &&
          isFocusable(element)
        ) {
          focusableElements.push(element);
        }

        visit(element);
        if (element.shadowRoot) {
          visit(element.shadowRoot);
        }
      }
    };

    visit(this);
    return focusableElements;
  }

  private containsComposedTarget(event: FocusEvent): boolean {
    return event.composedPath().includes(this);
  }

  private handleTabKey(event: KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      this.dialogElement?.focus({ preventScroll: true });
      return;
    }

    const activeElement = getDeepActiveElement();
    const activeIndex = activeElement
      ? focusableElements.indexOf(activeElement as HTMLElement)
      : -1;
    const nextElement = event.shiftKey
      ? focusableElements.at(-1)!
      : focusableElements[0];

    if (
      activeIndex === -1 ||
      (event.shiftKey && activeIndex === 0) ||
      (!event.shiftKey && activeIndex === focusableElements.length - 1)
    ) {
      event.preventDefault();
      nextElement.focus({ preventScroll: true });
    }
  }

  private static get topDialog(): M3Dialog | undefined {
    return M3Dialog.openDialogs.at(-1);
  }

  private static updatePageContainment() {
    const topDialog = M3Dialog.topDialog;

    if (!topDialog) {
      for (const [element, wasInert] of M3Dialog.inertStates) {
        element.inert = wasInert;
      }
      M3Dialog.inertStates.clear();
      M3Dialog.bodyObserver?.disconnect();
      M3Dialog.bodyObserver = undefined;

      if (M3Dialog.pageStyleSnapshot) {
        document.body.style.overflow = M3Dialog.pageStyleSnapshot.bodyOverflow;
        document.documentElement.style.overflow =
          M3Dialog.pageStyleSnapshot.documentOverflow;
        M3Dialog.pageStyleSnapshot = undefined;
      }

      document.removeEventListener(
        'keydown',
        M3Dialog.handleDocumentKeyDown,
        true,
      );
      document.removeEventListener(
        'focusin',
        M3Dialog.handleDocumentFocusIn,
        true,
      );
      return;
    }

    if (!M3Dialog.pageStyleSnapshot) {
      M3Dialog.pageStyleSnapshot = {
        bodyOverflow: document.body.style.overflow,
        documentOverflow: document.documentElement.style.overflow,
      };
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.addEventListener(
        'keydown',
        M3Dialog.handleDocumentKeyDown,
        true,
      );
      document.addEventListener(
        'focusin',
        M3Dialog.handleDocumentFocusIn,
        true,
      );
      M3Dialog.bodyObserver = new MutationObserver(() =>
        M3Dialog.updatePageContainment(),
      );
      M3Dialog.bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    const inertTargets = M3Dialog.getInertTargets(topDialog);
    for (const [element, wasInert] of M3Dialog.inertStates) {
      if (!inertTargets.has(element)) {
        element.inert = wasInert;
      }
    }

    for (const element of inertTargets) {
      if (!M3Dialog.inertStates.has(element)) {
        M3Dialog.inertStates.set(element, element.inert);
      }
      element.inert = true;
    }
  }

  /**
   * Inert every sibling branch on the route from the active dialog to body.
   * This works both for a body-level dialog and for a dialog rendered inside a
   * framework application root without making an ancestor of the dialog inert.
   */
  private static getInertTargets(topDialog: M3Dialog): Set<HTMLElement> {
    const targets = new Set<HTMLElement>();
    let branch: HTMLElement = topDialog;

    while (branch !== document.body) {
      const parent = branch.parentElement;
      if (parent instanceof HTMLElement) {
        for (const sibling of Array.from(parent.children) as HTMLElement[]) {
          if (sibling !== branch) {
            targets.add(sibling);
          }
        }

        branch = parent;
        continue;
      }

      const root = branch.getRootNode();
      if (
        !(root instanceof ShadowRoot) ||
        !(root.host instanceof HTMLElement)
      ) {
        break;
      }

      for (const sibling of Array.from(root.children) as HTMLElement[]) {
        if (sibling !== branch) {
          targets.add(sibling);
        }
      }

      branch = root.host;
    }

    return targets;
  }

  private static handleDocumentKeyDown(event: KeyboardEvent) {
    const topDialog = M3Dialog.topDialog;
    if (!topDialog) {
      return;
    }

    if (event.key === 'Escape' && topDialog.closeOnEscape) {
      event.preventDefault();
      topDialog.requestClose('escape');
    } else if (event.key === 'Tab') {
      topDialog.handleTabKey(event);
    }
  }

  private static handleDocumentFocusIn(event: FocusEvent) {
    const topDialog = M3Dialog.topDialog;
    if (topDialog && !topDialog.containsComposedTarget(event)) {
      topDialog.focusInitial();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm3-dialog': M3Dialog;
  }
}
