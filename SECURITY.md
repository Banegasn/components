# Security policy

## Supported versions

Security fixes target the latest released version of each public
`@banegasn/m3-*` package. Older versions may require upgrading to receive a
fix. The private `@banegasn/svelte-components` workspace is not a supported
published package.

## Report a vulnerability

Do not disclose a suspected vulnerability in a public issue, discussion, or
pull request. Submit it privately through the repository's
[GitHub security advisory form](https://github.com/Banegasn/components/security/advisories/new).

Include, when available:

- the affected package and version;
- impact and realistic attack scenario;
- reproduction steps or a minimal proof of concept;
- affected browsers or frameworks;
- any known mitigation; and
- whether the report or related details have been shared elsewhere.

The maintainer will assess reports on a best-effort basis, coordinate follow-up
through the private advisory, and credit reporters who want attribution. Please
do not test against systems or data you do not own or have permission to use.

For non-security defects, use the public bug report form.

## Dependency maintenance

Production dependencies are checked with:

```bash
pnpm audit:prod
```

The command fails for moderate, high, or critical advisories. Dependabot checks
npm dependencies and GitHub Actions weekly, grouping compatible minor and patch
updates.

## Svelte package decision

`packages/svelte-components` remains private but is still built in the workspace,
so its runtime dependency remains part of the production audit. It is retained and
upgraded to the supported Svelte 5 line rather than archived. Its package tooling
supports Svelte 5, and the package build verifies compatibility.

There are currently no accepted production advisories. If an advisory cannot be
patched immediately, this file must record its exposure, compensating controls,
owner, and review date; the audit threshold must not be weakened silently.
