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

# When running inside a git worktree, .git is a file pointing to a gitdir
# outside the mounted source tree. Mount the referenced gitdir (and the
# shared common .git directory) at the same absolute path so git commands
# work inside the container.
GIT_MOUNTS=()
if [ -f .git ]; then
  WORKTREE_GIT_DIR=$(sed -n 's/^gitdir: //p' .git)
  if [ -n "$WORKTREE_GIT_DIR" ] && [ -d "$WORKTREE_GIT_DIR" ]; then
    COMMONDIR_FILE="$WORKTREE_GIT_DIR/commondir"
    COMMON_DIR=""
    if [ -f "$COMMONDIR_FILE" ]; then
      COMMON_DIR_RAW=$(cat "$COMMONDIR_FILE")
      case "$COMMON_DIR_RAW" in
        /*) COMMON_DIR="$COMMON_DIR_RAW" ;;
        *)  COMMON_DIR=$(cd "$WORKTREE_GIT_DIR/$COMMON_DIR_RAW" && pwd) ;;
      esac
    fi
    if [ -n "$COMMON_DIR" ] && [ -d "$COMMON_DIR" ]; then
      # The worktree's gitdir lives under $COMMON_DIR/worktrees/<name>,
      # so mounting $COMMON_DIR alone covers both.
      GIT_MOUNTS+=(-v "$COMMON_DIR:$COMMON_DIR")
    else
      GIT_MOUNTS+=(-v "$WORKTREE_GIT_DIR:$WORKTREE_GIT_DIR")
    fi
  fi
fi

# Run Docker:
# - --rm: Remove container after exit
# - -i: Enables input in --watch mode
# - -t: Enables colored and interactive output in --watch mode
# - --ipc=host: Recommended for Chromium to avoid shared memory crashes
# - -v $(pwd):/work: Mount repository source into container
# - -v $VOL:/work/node_modules: Use a named volume for node_modules (overlays host's)
# - PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1: Use pre-installed browsers from the image
docker run --rm --ipc=host \
  -i \
  -t \
  -v "$(pwd)":/work \
  -v "${NODE_MODULES_VOLUME}":/work/node_modules \
  "${GIT_MOUNTS[@]}" \
  -w /work \
  -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  -e TEST_ENV \
  "$IMAGE" \
  /bin/bash -c 'yarn --frozen-lockfile --no-progress --non-interactive && yarn "$@"' -- "$@"
