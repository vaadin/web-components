#!/bin/bash
set -e

# Run visual tests inside a Docker container
#
# Usage:
#   ./scripts/run-docker-visual-tests.sh <yarn-args...>
#   ./scripts/run-docker-visual-tests.sh --clean
#
# Examples:
#   ./scripts/run-docker-visual-tests.sh test --config web-test-runner-lumo.config.js
#   ./scripts/run-docker-visual-tests.sh test --config web-test-runner-lumo.config.js --group button
#   ./scripts/run-docker-visual-tests.sh test --config web-test-runner-aura.config.js --dark
#   ./scripts/run-docker-visual-tests.sh --clean                # Remove cached node_modules volume

IMAGE=$(grep 'image:' "$(dirname "$0")/../.github/workflows/visual-tests.yml" | head -1 | sed 's/.*image: *//')

NODE_MODULES_VOLUME="vaadin-web-components-node-modules"

if [ "$1" = "--clean" ]; then
  echo "Removing cached node_modules volume (${NODE_MODULES_VOLUME})..."
  docker volume rm "$NODE_MODULES_VOLUME" 2>/dev/null && echo "Done." || echo "Volume not found (nothing to clean)."
  exit 0
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <yarn-args...>"
  echo "       $0 --clean"
  echo ""
  echo "Examples:"
  echo "  $0 test --config web-test-runner-lumo.config.js"
  echo "  $0 test --config web-test-runner-lumo.config.js --group button"
  echo "  $0 --clean                # Remove cached node_modules volume"
  exit 1
fi

echo "Running visual tests in Docker (${IMAGE})..."
echo "  Command: yarn $*"

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
  -e TEST_ENV \
  "$IMAGE" \
  /bin/bash -c 'git config --global safe.directory /work && yarn --frozen-lockfile --no-progress --non-interactive && yarn "$@"' -- "$@"
