# Publishing components

Package versions must be committed to `main` through a pull request before
publishing. The branch is protected and rejects a version commit pushed directly
from a release job.

## Prepare versions

In GitHub Actions, run **Prepare Package Versions** on `main`. Choose `patch`,
`minor`, or `major` and optionally enter one full package name, such as
`@banegasn/m3-navigation-rail`. Leaving the name blank bumps every public
package. The workflow creates a branch and shows a link to open a pull request.
Merge that pull request after its `quality` check passes.

To prepare the same changes locally, run one of:

```bash
pnpm version:patch
node scripts/bump-package-versions.mjs patch @banegasn/m3-navigation-rail
```

The bump script updates package versions, exact workspace references, and
`pnpm-lock.yaml` together. Commit those files in a pull request.

## Publish from GitHub Actions

Run **Publish Packages** on `main` after the version pull request merges. Enter
the full `package_name` for a single package:

```bash
gh workflow run publish.yml --ref main -f package_name=@banegasn/m3-navigation-rail
```

The workflow runs quality checks and a build, then publishes missing versions
to npm and GitHub Packages. It skips versions that are already published.
Leaving `package_name` blank checks every public package. Publishing to an
existing GitHub package requires this repository's Actions token to have write
access to that package.

The npm step uses the repository's `NPM_TOKEN` secret. The GitHub Packages step
uses `GITHUB_TOKEN` with `packages: write` permission. A `403
permission_denied: write_package` error means the repository needs write access
to that GitHub package.

## Verify a release

```bash
npm view @banegasn/m3-navigation-rail@3.2.5 version --registry https://registry.npmjs.org
npm view @banegasn/m3-navigation-rail@3.2.5 version --registry https://npm.pkg.github.com
```

Versions cannot be overwritten. Bump the version again for the next release.
