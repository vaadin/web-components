#!/bin/bash
set -e

# Run visual tests inside a Docker container
#
# Usage:
#   ./scripts/run-docker-visual-tests.sh <yarn-script> [extra-args...]
#
# Examples:
#   ./scripts/run-docker-visual-tests.sh test:playwright:lumo
#   ./scripts/run-docker-visual-tests.sh test:playwright:lumo --group button
#   ./scripts/run-docker-visual-tests.sh test:playwright:aura --all
#   ./scripts/run-docker-visual-tests.sh test:playwright:aura:dark
#   ./scripts/run-docker-visual-tests.sh update:playwright:lumo
#   ./scripts/run-docker-visual-tests.sh update:playwright:lumo --group button

IMAGE=$(grep 'VISUAL_TESTS_DOCKER_IMAGE:' "$(dirname "$0")/../.github/workflows/visual-tests.yml" | head -1 | sed 's/.*VISUAL_TESTS_DOCKER_IMAGE: *//')

if [ -z "$1" ]; then
  echo "Usage: $0 <yarn-script> [extra-args...]"
  echo ""
  echo "Examples:"
  echo "  $0 test:playwright:lumo"
  echo "  $0 test:playwright:lumo --group button"
  echo "  $0 update:playwright:lumo"
  exit 1
fi

YARN_SCRIPT="$1"
shift
EXTRA_ARGS="$*"

echo "Running visual tests in Docker (${IMAGE})..."
echo "  Script: yarn ${YARN_SCRIPT} ${EXTRA_ARGS}"

# Use a named volume for node_modules so that:
# 1. Linux-native dependencies are installed separately from the host (macOS/Windows)
# 2. The volume persists between runs, making subsequent installs fast
# 3. We avoid exhausting Docker Desktop disk space from duplicate node_modules
NODE_MODULES_VOLUME="vaadin-web-components-node-modules"

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
  /bin/bash -c "yarn --frozen-lockfile --no-progress --non-interactive && yarn ${YARN_SCRIPT} ${EXTRA_ARGS}"
