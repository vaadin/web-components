#!/bin/bash -e

org=vaadin
repo=vaadin-charts
branch=master
port=5199

# make folder (same as input, no checking!)
mkdir ${repo}
git clone https://github.com/$org/$repo.git --branch ${branch} --single-branch

# switch to deploy branch
pushd ${repo} >/dev/null
git checkout --orphan deploy

# remove all content
git rm -rf -q .

# user bower to install runtime deployment
npm i -g bower
bower cache clean $repo # make sure to clean cache before installing 
git show ${branch}:bower.json > bower.json
echo "{
  \"directory\": \"components\"
}
" > .bowerrc
bower install
bower install $org/$repo#$branch
git checkout ${branch} -- demo
rm -rf components/$repo/demo
mv demo components/$repo/

# redirect to component folder
echo "<META http-equiv="refresh" content=\"0;URL=components/$repo/\">" > index.html

# generate the war file
zip -r $repo.war .

# copy and move war file to server
scp -o StrictHostKeyChecking=no -P $port *.war dev@app.fi:$repo.war
ssh -o StrictHostKeyChecking=no -p $port dev@app.fi mv $repo.war tomcat/webapps/ROOT.war

# cleanup 
popd >/dev/null
rm -rf $repo