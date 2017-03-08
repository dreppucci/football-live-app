#!/bin/sh
# ideas used from https://gist.github.com/motemen/8595451

set -e
pwd

remote="$GH_REMOTE"
siteSource="$SITE_SOURCE"

if [ ! -d "node_modules" ]; then
  npm install
else
  echo "node_modules folder already existing"
fi

npm cache clean
npm rebuild node-sass
npm run build

cd ${siteSource}

git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1
git init
git remote add --fetch origin "$remote"

./../node_modules/gh-pages/bin/gh-pages -d .