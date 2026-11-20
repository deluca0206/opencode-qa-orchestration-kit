#!/bin/sh
set -eu
base=${0%/*}
if [ "$base" = "$0" ]; then base=.; fi
exec node "$base/scripts/install.mjs" "$@"
