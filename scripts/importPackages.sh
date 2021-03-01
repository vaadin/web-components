#!/usr/bin/env bash

# Remove all component modules, checkout them from their
# origin branch in github, consolidate folders.
#
# Usage:
#   ./scripts/update.sh
#

set -e
list='repos.txt'
repos=`grep 'vaadin' $list`

checkoutProject() {
  repo=$1
  echo Importing $repo
  # Prepare the repo
  git remote add $repo ~/vaadin/migrate/$repo/.git
  git merge $repo/master --allow-unrelated-histories -m "Merge branch 'master' of ../$repo"
  # Cleanup
  git remote remove $repo
  # Delete .git and .github
  rm -rf packages/$repo/.??*
  # Delete old issue template
  rm -rf packages/$repo/ISSUE_TEMPLATE.md
  # Delete tsconfig.json
  rm -rf packages/$repo/tsconfig.json
  # Delete visual tests
  rm -rf packages/$repo/test/visual
  # Delete directory description
  rm -rf packages/$repo/vaadin-directory-description.md
  # Delete API docs
  rm -rf packages/$repo/index.html
  # Delete Rollup config
  rm -rf packages/$repo/rollup.config.js
  # Delete WTR config
  rm -rf packages/$repo/web-test-runner.config.js
  # Delete meta packages files
  rm -rf packages/$repo/CONTRIBUTING.md
  rm -rf packages/$repo/DEVELOPMENT.md
}

updatePackage() {
  node scripts/updatePackage.js $1
}

for i in $repos
do
  checkoutProject $i
  updatePackage $i
  git add .
  git commit -m "chore: import $i to monorepo"
done

node scripts/updateTests.js

node scripts/updateCopyright.js

git add .

git commit -m "chore: update tests and license headers"
