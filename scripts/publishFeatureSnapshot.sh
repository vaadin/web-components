#!/usr/bin/env bash
set -euo pipefail

# Must run from the repo root: the paths below (lerna.json, scripts/, yarn
# workspaces) are all relative to it.
if [ ! -f lerna.json ] || [ ! -f scripts/updateVersion.js ]; then
  echo "Error: run this script from the repository root (lerna.json not found here)." >&2
  exit 1
fi

# Publishes a feature snapshot of all public packages to npm, Java -SNAPSHOT style.
#
#   version:  <base>-dev.<short-hash>   e.g. 25.3.0-dev.ba0c4c55ea  (immutable, per commit)
#   dist-tag: dev-<feature>             a mutable pointer, always moved to the newest build
#
# The dist-tag is the handle consumers use; it works like -SNAPSHOT (always latest).
# The `dev-` prefix marks it as an unstable, non-release build:
#   npm i @vaadin/date-picker@dev-disable-dates
#
# Re-running on the same commit is safe: `lerna publish from-package` skips any
# package whose version is already on the registry, so it resumes a partial publish.
#
# Usage: FEATURENAME=disable-dates ./scripts/publishFeatureSnapshot.sh
#    or: ./scripts/publishFeatureSnapshot.sh disable-dates

FEATURE="${1:-${FEATURENAME:-}}"
if [ -z "$FEATURE" ]; then
  echo "Usage: $0 <feature-name>   (or set FEATURENAME)" >&2
  exit 1
fi

# dist-tag: feature name normalized to what npm accepts as a tag, with a `dev-`
# prefix so it clearly reads as an unstable build, not a stable release.
NAME=$(echo "$FEATURE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9-]+/-/g; s/^-+//; s/-+$//')
if [ -z "$NAME" ]; then
  echo "Feature name '$FEATURE' has no usable characters" >&2
  exit 1
fi
TAG="dev-${NAME}"

# Base = lerna version without prerelease/build metadata, e.g. 25.3.0-alpha3 -> 25.3.0.
BASE=$(node -pe "require('./lerna.json').version.replace(/[-+].*\$/, '')")
HASH=$(git rev-parse --short HEAD)
VERSION="${BASE}-dev.${HASH}"

echo "Publishing feature snapshot $VERSION (dist-tag: $TAG)"

# 0. Preflight: for a real npmjs publish, fail fast and clearly if we are not
#    authenticated, instead of bumping and building for minutes only to hit a
#    misleading "E404 Not found" from npm (its response for missing/invalid auth).
#    Skipped for DRY_RUN and for a custom registry (e.g. an anonymous Verdaccio).
if [ -z "${DRY_RUN:-}" ] && [ -z "${NPM_REGISTRY:-}" ]; then
  if ! WHOAMI=$(npm whoami 2>/dev/null); then
    echo "Error: not authenticated to npm (npm whoami failed)." >&2
    echo "Provide a token with publish access to the @vaadin scope in ~/.npmrc:" >&2
    echo "  //registry.npmjs.org/:_authToken=<token>" >&2
    echo "Use an automation token if the account enforces 2FA on publish." >&2
    exit 1
  fi
  echo "Authenticated to npm as: $WHOAMI"
fi

# 1. Install with the committed versions so the lockfile stays consistent.
yarn install --frozen-lockfile

# 2. Update the hardcoded default version in packages/component-base/src/define.js.
export npm_config_bump="$VERSION"
node scripts/updateVersion.js

# 3. Bump every package version and their interdependencies in lockstep.
#    No tag or push - just rewrite the versions on disk.
npx lerna version "$VERSION" --exact --force-publish --no-push --no-git-tag-version --yes

# 4. Build the release artifacts (themes, custom elements manifest, web-types).
yarn release

# 5. Publish all public packages and move the feature dist-tag to this build.
#
# Testing the publish without touching npmjs:
#   DRY_RUN=1        -> npm publish --dry-run per package (shows tarballs, no upload)
#   NPM_REGISTRY=... -> real publish against another registry, e.g. a local
#                       Verdaccio (npx verdaccio, then NPM_REGISTRY=http://localhost:4873)
if [ -n "${DRY_RUN:-}" ]; then
  echo "DRY_RUN: previewing publish of $VERSION (dist-tag: $TAG), nothing is uploaded"
  npx lerna exec --no-private -- npm publish --dry-run --tag "$TAG"
else
  # `lerna publish from-package` refuses to run on a dirty tree, so commit the
  # version bump. This commit is throwaway - never pushed, the CI checkout is
  # discarded afterwards - so it just satisfies the clean-tree check.
  git -c user.email=ci@vaadin.com -c user.name="Vaadin CI" commit -am "chore: feature snapshot $VERSION"

  if [ -n "${NPM_REGISTRY:-}" ]; then
    npx lerna publish from-package --dist-tag "$TAG" --yes --registry "$NPM_REGISTRY"
  else
    npx lerna publish from-package --dist-tag "$TAG" --yes
  fi
fi
