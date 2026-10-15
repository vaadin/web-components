#!/usr/bin/env bash

# List all packages managed by Lerna
packages=$(./node_modules/.bin/lerna list)

# Get latest version of all packages
version=$(node -pe 'JSON.parse(process.argv[1]).version' "$(cat lerna.json)")

fixDistTag() {
  package=$1
  echo fixing $package

  # List npm tags
  npm dist-tag ls $package

  # Update "latest" tag to correct version
  npm dist-tag add $package@$version latest
}

for i in $packages
do
  fixDistTag $i
done
