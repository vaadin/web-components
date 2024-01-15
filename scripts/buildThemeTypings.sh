#!/usr/bin/env bash

# Rename .js files to .ts
for file in packages/**/theme/**/*.js
do
  mv "$file" "${file%.js}.ts"
done

# Build type definitions
npm run build:ts

# Restore original .js files
git checkout packages/**/theme/**/*.js

# Remove .ts files but keep .d.ts
find . -path "./packages/*/theme/*.ts" ! -name "*.d.ts" -type f -delete
