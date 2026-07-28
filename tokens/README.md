# Shared token contract

`tokens.json` is the only hand-edited source for shared design tokens. Run
`pnpm tokens:generate` after changing it. The generated light, dark, and
high-contrast stylesheets in `tokens/generated` are committed so applications
can consume them without running repository tooling.

## Naming tiers

- `--md-ref-*` contains raw reference palette values. Components should not
  consume these directly.
- `--md-sys-*` contains semantic color, typography, shape, elevation, state,
  and motion roles. Applications normally customize this tier.
- `--md-comp-*` contains component-specific decisions composed from system
  roles. This is the fine-grained component override tier.

Names use lowercase kebab case and identify the tier, domain, role, and state
from broadest to narrowest. Every source usage must be declared in
`tokens.json`.

## Consumption and precedence

Import all three generated files once at application scope, in this order:

```css
@import "./tokens/generated/light.css";
@import "./tokens/generated/dark.css";
@import "./tokens/generated/high-contrast.css";
```

Light is the default. Set `theme="dark"` or `theme="high-contrast"` on the
document root to activate another generated role set.

Component styles use this precedence:

1. a canonical `--md-comp-*` override;
2. a semantic `--md-sys-*` role where the component has one; and
3. the component's literal default.

The final literal is required. It keeps every published component usable when
no theme stylesheet is loaded and prevents token adoption from changing its
standalone default appearance.

Component values that vary by a component attribute are declared and consumed
in that component's executable stylesheet rather than emitted at `:root`.
This keeps an override live without flattening size or shape variants into a
single application-wide default.

The divider is a small canonical component-token example:

```css
--_color: var(
  --md-comp-divider-color,
  var(--md-sys-color-outline-variant, #cac4d0)
);
```

## Canonical API

The token contract contains only the three naming tiers above. Historical
`--md-<component>-*` properties are not aliases and are not supported. Add a
new public component decision as `--md-comp-<component>-<role>`, declare it in
`tokens.json`, consume it in the owning stylesheet, and add computed-style or
screenshot evidence before changing a default.

## Motion contract

Motion is a system role, not a component-local magic number. The public API
includes the Material duration scale (`short1` through `short4`, `medium1`
through `medium4`, `long1` through `long4`, and `extra-long1` through
`extra-long4`), standard/emphasized entry and exit curves, and two CSS
spring-emulation curves. Components use `--md-sys-motion-*` directly; they do
not create component aliases for generic interaction timing.

Use motion only to clarify a state change, hierarchy, or spatial relationship:

- short durations for press, selection, and state-layer feedback;
- medium durations for dialog, menu, tooltip, and snackbar visibility;
- long durations for staged entrances or intentional container transforms;
- linear timing only for continuous progress; and
- `spring-fast` only on composited transforms where a compact spatial cue is
  helpful. `spring-bouncy` is opt-in and must not be used for essential state.

Every generated theme contains a `prefers-reduced-motion: reduce` override
that collapses duration roles to `1ms`. The final state remains visible rather
than being hidden or delayed. Continuous indicators have component-specific
alternatives: loading rings freeze, indeterminate progress shows a centred
partial bar, pulses stop at full opacity, and interaction ripples are omitted.
Consumers should continue to announce progress/status with semantic text or
ARIA live regions; motion never carries essential information by itself.

### CSS and JavaScript synchronization

JavaScript must not duplicate a timeout for a CSS transition or animation.
Components that remove temporary DOM state (snackbar exit and radio ripple)
read their rendered `--_*-duration` custom property with `getComputedStyle()`;
that property resolves from the public motion token. The Angular dialog service
uses the same pattern. A consumer override, generated reduced-motion rule, or
demo verification mode therefore changes both the CSS duration and JavaScript
lifetime together. For non-motion interaction thresholds (for example, a
long-press gesture), document the intentional literal with
`motion-literal-exempt` so validation does not mistake it for animation time.

## Validation workflow

```bash
pnpm tokens:generate   # update generated CSS
pnpm tokens:check      # prove generated files are clean and names are known
```

`pnpm build` runs `tokens:check` first. Generation is deterministic: a second
generation must produce no diff.
