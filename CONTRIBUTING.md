# Contributing

Thank you for improving Material 3 Expressive Components. This guide is the
contribution contract for people and autonomous agents.

## Before you start

Use an existing issue or open one with the appropriate issue form. Changes
should have a bounded scope, explicit acceptance criteria, and known
dependencies before implementation begins. Security reports must follow
[SECURITY.md](SECURITY.md), not a public issue.

Autonomous work must also follow [.github/AGENT_WORKFLOW.md](.github/AGENT_WORKFLOW.md).
An issue is available to an agent only when it has the `agent-ready` label and
does not have the `blocked` label.

## Repository layout

- `packages/m3-*`: independently versioned Lit custom-element packages.
- `packages/svelte-components`: an internal Svelte workspace; it is currently
  private and is not part of the public release queue.
- `apps/angular-app`: documentation and integration demo.
- `scripts`: publishing, screenshots, and repository verification utilities.
- `.github/workflows`: deployment and release automation.

Keep component behavior, package README examples, and the Angular demo aligned.
Avoid unrelated cleanup in a focused pull request.

## Set up the repository

Requirements are Node.js 24.18.x and pnpm 11. The pinned pnpm version is
11.12.0.

```bash
git clone https://github.com/Banegasn/components.git
cd components
npm install --global corepack@0.35.0
corepack enable
corepack install --global pnpm@11.12.0
pnpm install --frozen-lockfile
```

pnpm 11 runs dependency build scripts only for the reviewed packages listed in
`pnpm-workspace.yaml`. If an upgrade introduces a new build script, review that
package before adding it to `allowBuilds`; do not bypass the policy globally.

Run the demo during development with:

```bash
pnpm --filter @apps/angular-app dev
```

Run a single package in watch mode with, for example:

```bash
pnpm --filter @banegasn/m3-button dev
```

## Make a change

1. Create a branch from the latest `main`.
2. Make the smallest change that satisfies the linked issue.
3. Add or update tests for behavior changes.
4. Update package documentation and demo examples when a public API changes.
5. Check keyboard, screen-reader, reduced-motion, RTL, and high-contrast impact
   where relevant.
6. Run the verification appropriate to the affected workspaces.
7. Open a pull request using the repository template and include `Closes #N`.

### Adding or changing a component

- Preserve framework-agnostic custom-element behavior.
- Treat attributes, properties, methods, events, slots, CSS custom properties,
  and CSS parts as public API.
- Use kebab-case `m3-*` custom-element names and avoid silently changing an
  existing tag or event.
- Extend the package's existing test approach. Packages with a `test` script
  use Web Test Runner; not every package has tests yet.
- Show the supported states in `apps/angular-app` and keep the package README
  accurate.

## Verify your change

For repository-wide changes, run:

```bash
pnpm build
pnpm lint
pnpm test
pnpm verify:package-licenses
```

Turbo runs only scripts that exist in each workspace, so a successful root
`lint` or `test` does not imply that every package has a linter or test suite.
Call out affected packages without coverage in the pull request.

For a focused component change, use filters to shorten the feedback loop:

```bash
pnpm --filter @banegasn/m3-button build
pnpm --filter @banegasn/m3-button test
```

If the demo changes, also run:

```bash
pnpm --filter @apps/angular-app build
```

Visual changes should include before/after screenshots. Interaction changes
should include the tested browser, input methods, and assistive-technology
checks. If a command cannot be run, explain why and what evidence substitutes
for it; do not mark it as completed.

## Versioning and release boundaries

Use semantic-versioning impact in the pull request:

- **patch**: compatible bug, accessibility, documentation, or styling fix.
- **minor**: backward-compatible public capability.
- **major**: removal, rename, changed default, or incompatible behavior in a
  public API.
- **none**: repository-only work that does not change a published package.

Contributors and implementation agents must not bump versions, publish
packages, create releases, or push release tags unless a maintainer explicitly
scopes that work in the issue. Maintainers own release credentials and the
final release decision.

## Definition of done

A change is ready for review when:

- the linked issue's acceptance criteria are satisfied;
- relevant build, lint, test, packaging, and manual checks are reported;
- tests cover changed behavior, or the coverage gap is explicit;
- documentation, examples, accessibility, and semver impact are assessed;
- generated files and unrelated changes are absent; and
- the pull request is reviewable as one coherent change.

All changes require review. Ownership and fallback review rules are documented
in [.github/CODEOWNERS](.github/CODEOWNERS) and
[.github/AGENT_WORKFLOW.md](.github/AGENT_WORKFLOW.md).
