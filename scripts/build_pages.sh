#!/bin/bash

OUTPUT_PATH='dist/'

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"
cd "$(git rev-parse --show-toplevel)"

# Build site
yarn build

# Move build output to root directory and remove all other files
git clean -fx -d . -e "/${OUTPUT_PATH}"
git rm $(git ls-files | grep -v "^${OUTPUT_PATH}")
mv $OUTPUT_PATH* .
rm -r "$OUTPUT_PATH"
