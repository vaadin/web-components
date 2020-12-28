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
  echo cloning $repo into packages/$repo
  rm -rf packages/$repo
  git clone -q git@github.com:vaadin/$repo.git --branch master packages/$repo
  # Delete .git and .github
  rm -rf packages/$repo/.??*
  # Delete tsconfig.json
  rm -rf packages/$repo/tsconfig.json
  # Delete visual tests
  rm -rf packages/$repo/test/visual
  # Delete typings tests
  rm -rf packages/$repo/test/typings
  # Delete directory description
  rm -rf packages/$repo/vaadin-directory-description.md
  # Delete API docs
  rm -rf packages/$repo/index.html
  # Delete Rollup config
  rm -rf packages/$repo/rollup.config.js
  # Delete WTR config
  rm -rf packages/$repo/web-test-runner.config.js
}

updatePackage() {
  node scripts/updatePackage.js $1
}

for i in $repos
do
  checkoutProject $i
  updatePackage $i
done

node scripts/updateTests.js
