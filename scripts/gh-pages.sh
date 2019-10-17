npm run build-global
npm run build-examples
rm -rf /tmp/query-builder-lib
mkdir /tmp/query-builder-lib
mkdir /tmp/query-builder-lib/gh-pages
cp ./examples/bundle.js ./examples/bundle.js.map /tmp/query-builder-lib/gh-pages
git checkout gh-pages
cp -R /tmp/query-builder-lib/gh-pages/* .
git add ./bundle.js
git add ./bundle.js.map
git commit -m "update"
git checkout master

