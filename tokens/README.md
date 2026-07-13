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
  roles. This is the preferred fine-grained override tier for new migrations.
- Existing `--md-<component>-*` names are compatibility aliases. They remain
  public until a documented major release removes them.

Names use lowercase kebab case and identify the tier, domain, role, and state
from broadest to narrowest. New source usage must be declared in `tokens.json`
or explicitly reviewed into the legacy inventory.

## Consumption and precedence

Import all three generated files once at application scope, in this order:

```css
@import "./tokens/generated/light.css";
@import "./tokens/generated/dark.css";
@import "./tokens/generated/high-contrast.css";
```

Light is the default. Set `theme="dark"` or `theme="high-contrast"` on the
document root to activate another generated role set.

Migrated component fallback chains use this precedence:

1. a canonical `--md-comp-*` override;
2. an existing compatible public property;
3. a semantic `--md-sys-*` role; and
4. the component's original literal fallback.

The final literal is required. It keeps every published component usable when
no theme stylesheet is loaded and prevents token adoption from changing its
standalone default appearance.

The divider is the intentionally small proof migration:

```css
--_color: var(
  --md-comp-divider-color,
  var(--md-sys-color-outline-variant, #cac4d0)
);
```

## Compatibility and incremental migration

[TOKEN_COMPATIBILITY.md](TOKEN_COMPATIBILITY.md) is generated from the reviewed
legacy inventory. It records current concrete `--md-*` names and their source
locations. Existing names continue to work. Migrate one component family at a
time, introduce a canonical component alias, retain the prior fallback, and
add computed-style or screenshot evidence before changing defaults.

To intentionally accept a previously unknown legacy name:

```bash
pnpm tokens:inventory
```

Review the inventory and compatibility-table diff carefully. Prefer defining a
proper canonical token instead of growing the legacy baseline.

## Validation workflow

```bash
pnpm tokens:generate   # update generated CSS and compatibility documentation
pnpm tokens:check      # prove generated files are clean and names are known
```

`pnpm build` runs `tokens:check` first. Generation is deterministic: a second
generation must produce no diff.
