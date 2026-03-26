#!/usr/bin/env bash

# Usage: bash scripts/publish-unpublished.sh [npm|github] [--force]
# Before running use npm login to be able to publish to the target registry

set -uo pipefail

REGISTRY=""
ACCESS=""
FORCE=false

for arg in "$@"; do
  case "$arg" in
    npm)    REGISTRY="https://registry.npmjs.org"; ACCESS="--access public" ;;
    github) REGISTRY="https://npm.pkg.github.com"; ACCESS="" ;;
    --force) FORCE=true ;;
    *) echo "Unknown argument: $arg. Use 'npm' or 'github', optionally with --force"; exit 1 ;;
  esac
done

if [[ -z "$REGISTRY" ]]; then
  echo "Select registry:"
  echo "  1) GitHub Packages (https://npm.pkg.github.com)"
  echo "  2) npm (https://registry.npmjs.org)"
  read -rp "Choice [1/2]: " choice
  case "$choice" in
    2) REGISTRY="https://registry.npmjs.org"; ACCESS="--access public" ;;
    *) REGISTRY="https://npm.pkg.github.com"; ACCESS="" ;;
  esac
fi

echo "Using registry: $REGISTRY"
$FORCE && echo "Force mode: skipping published check"

PACKAGES_DIR="packages"
to_publish=()

for pkg_dir in "$PACKAGES_DIR"/*/; do
  pkg_json="$pkg_dir/package.json"
  [[ -f "$pkg_json" ]] || continue

  name=$(node -p "require('./$pkg_json').name")
  version=$(node -p "require('./$pkg_json').version")
  private=$(node -p "require('./$pkg_json').private ?? false")

  [[ "$private" == "true" ]] && continue

  if $FORCE; then
    echo "QUEUED (force):       ${name}@${version}"
    to_publish+=("$name")
  elif npm view "${name}@${version}" version --registry "$REGISTRY" &>/dev/null; then
    echo "SKIP (published):     ${name}@${version}"
  else
    echo "QUEUED (unpublished): ${name}@${version}"
    to_publish+=("$name")
  fi
done

if [[ ${#to_publish[@]} -eq 0 ]]; then
  echo -e "\nAll packages are already published."
  exit 0
fi

echo -e "\nPublishing ${#to_publish[@]} package(s)..."

failed=()

for name in "${to_publish[@]}"; do
  echo -e "\n→ Publishing $name"
  pkg_dir=$(grep -rl "\"name\": \"$name\"" packages/*/package.json | head -1)

  if [[ -n "$pkg_dir" && "$REGISTRY" == "https://registry.npmjs.org" ]]; then
    sed -i "s|https://npm.pkg.github.com|https://registry.npmjs.org|g" "$pkg_dir"
    pnpm --filter "$name" publish --no-git-checks --registry "$REGISTRY" $ACCESS || { echo "FAILED: $name"; failed+=("$name"); }
    sed -i "s|https://registry.npmjs.org|https://npm.pkg.github.com|g" "$pkg_dir"
  else
    pnpm --filter "$name" publish --no-git-checks --registry "$REGISTRY" $ACCESS || { echo "FAILED: $name"; failed+=("$name"); }
  fi
done

if [[ ${#failed[@]} -gt 0 ]]; then
  echo -e "\nFailed to publish ${#failed[@]} package(s):"
  for name in "${failed[@]}"; do echo "  - $name"; done
  exit 1
fi

echo -e "\nDone."
