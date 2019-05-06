npm run build:demo
npm run build:docs

# Copy preview photo over to API reference site
mkdir ./demo/api-reference/docs/
cp ./docs/preview.png ./demo/api-reference/docs/preview.png
