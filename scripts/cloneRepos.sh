#!/usr/bin/env bash

# Remove all component modules, checkout them from their
# origin branch in github, consolidate folders.
#
# Usage:
#   ./scripts/update.sh
#

# skip renaming links in commig messages #nnn -> vaadin-xxx#nnn
[ "$1" = "--skipLinks" ] && skipLinks=true

set -e
list='repos.txt'
repos=`grep 'vaadin' $list`

cd ../
rm -rf migrate
mkdir migrate
cd migrate

renameLinks() {
  repo=$1
  echo "Filtering $repo"
  FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f \
     --prune-empty \
     --msg-filter '
        vrepo=vaadin/'$repo'
        msg=`cat -`
        head=`echo "$msg" | head -1 | perl -pe "s, *\((#\d+)\) *$,\n$vrepo\\$1,g" | perl -pe "s,(.* +)(#\d+)(.*),\\$1\\$2\\$3\n$vrepo\\$1,"`
        body=`echo "$msg" | tail +2 | perl -pe "s,(fixes|fix):? *(#\d+),Fixes: $vrepo\\$2,ig" | perl -pe "s,[ \():](#\d+),$vrepo\\$1,g"`
        echo "$head\n$body\n" | perl -p0e "s,\n\n\n+,\n\n,g"
        true
     '
}

checkoutProject() {
  repo=$1
  echo cloning $repo
  git clone -q git@github.com:vaadin/$repo.git
  cd $repo
  # See https://github.com/newren/git-filter-repo
  git filter-repo --to-subdirectory-filter "packages/$repo"

  [ -z "$skipLinks" ] && renameLinks $repo
  cd ../
}

for i in $repos
do
  checkoutProject $i
done
