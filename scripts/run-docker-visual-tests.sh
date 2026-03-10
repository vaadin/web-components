#!/bin/bash
set -e

# Run visual tests inside a Docker container
#
# Usage:
#   ./scripts/run-docker-visual-tests.sh <yarn-script> [extra-args...]
#   ./scripts/run-docker-visual-tests.sh --clean
#
# Examples:
#   ./scripts/run-docker-visual-tests.sh test:playwright:lumo
#   ./scripts/run-docker-visual-tests.sh test:playwright:lumo --group button
#   ./scripts/run-docker-visual-tests.sh test:playwright:aura --all
#   ./scripts/run-docker-visual-tests.sh test:playwright:aura:dark
#   ./scripts/run-docker-visual-tests.sh update:playwright:lumo
#   ./scripts/run-docker-visual-tests.sh update:playwright:lumo --group button
#   ./scripts/run-docker-visual-tests.sh --clean                # Remove cached node_modules volume

IMAGE=$(grep 'VISUAL_TESTS_DOCKER_IMAGE:' "$(dirname "$0")/../.github/workflows/visual-tests.yml" | head -1 | sed 's/.*VISUAL_TESTS_DOCKER_IMAGE: *//')

NODE_MODULES_VOLUME="vaadin-web-components-node-modules"

if [ "$1" = "--clean" ]; then
  echo "Removing cached node_modules volume (${NODE_MODULES_VOLUME})..."
  docker volume rm "$NODE_MODULES_VOLUME" 2>/dev/null && echo "Done." || echo "Volume not found (nothing to clean)."
  exit 0
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <yarn-script> [extra-args...]"
  echo "       $0 --clean"
  echo ""
  echo "Examples:"
  echo "  $0 test:playwright:lumo"
  echo "  $0 test:playwright:lumo --group button"
  echo "  $0 update:playwright:lumo"
  echo "  $0 --clean                # Remove cached node_modules volume"
  exit 1
fi

YARN_SCRIPT="$1"
shift

echo "Running visual tests in Docker (${IMAGE})..."
echo "  Script: yarn ${YARN_SCRIPT} $*"

# Run Docker:
# - --rm: Remove container after exit
# - --ipc=host: Recommended for Chromium to avoid shared memory crashes
# - -v $(pwd):/work: Mount repository source into container
# - -v $VOL:/work/node_modules: Use a named volume for node_modules (overlays host's)
# - PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1: Use pre-installed browsers from the image
docker run --rm --ipc=host \
  -v "$(pwd)":/work \
  -v "${NODE_MODULES_VOLUME}":/work/node_modules \
  -w /work \
  -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  "$IMAGE" \
  /bin/bash -c 'git config --global --add safe.directory /work && yarn --frozen-lockfile --no-progress --non-interactive && yarn "$@"' -- "$YARN_SCRIPT" "$@"
