#!/bin/bash

base_dir=.

# Rename [name].common.js to [name].test.js
find "$base_dir/packages" -type f -name "*.common.js" | while read -r common_file; do
  test_file="${common_file%.common.js}.test.js"
  mv "$common_file" "$test_file"
done

# Merge [name]-polymer.test.js into [name].test.js and delete [name]-lit.test.js
find "$base_dir/packages" -type f -name "*-polymer.test.js" | while read -r polymer_file; do
  base_name="${polymer_file%-polymer.test.js}"
  test_file="$base_name.test.js"
  lit_file="$base_name-lit.test.js"

  # Merge polymer test into the test file
  cat "$test_file" >> "$polymer_file"
  mv "$polymer_file" "$test_file"

  # Delete the polymer and lit test files
  rm "$lit_file"
done

# Remove old JS imports of *.common.js from the final [name].test.js
find "$base_dir/packages" -type f -name "*.test.js" | while read -r test_file; do
  sed -i '' '/import .*\.common\.js/d' "$test_file"
done

echo "Renaming, merging, and linting completed."
