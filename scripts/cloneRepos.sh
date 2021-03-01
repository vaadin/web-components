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

cd ../
rm -rf migrate
mkdir migrate
cd migrate

checkoutProject() {
  repo=$1
  echo cloning $repo
  git clone -q git@github.com:vaadin/$repo.git
  cd $repo
  # See https://github.com/newren/git-filter-repo
  git filter-repo --to-subdirectory-filter "packages/$repo"
  cd ../
}

for i in $repos
do
  checkoutProject $i
done
