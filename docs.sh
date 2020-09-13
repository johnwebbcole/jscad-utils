rm -rf srcx
cp -R src srcx
find ./srcx -name "*.js" -print0 | xargs -0 sed -i ".bak" -e "s/@typedef {typeof import/@xtypedef {typeof import/g" -e "s/@typedef {import/@xtypedef {import/g"
# npm run serve

npx vuepress-jsdoc --source ./srcx --dist ./docs --readme ./README.md --readme ./README.md --rmPattern=./docs/code/README.md
npx vuepress dev ./docs