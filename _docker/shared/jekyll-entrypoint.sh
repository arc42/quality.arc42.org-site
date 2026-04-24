#!/bin/sh
set -eu

image_stamp_file="/opt/site-deps/.gemfile.sha256"
runtime_gemfile="/site/Gemfile"

if [ ! -f "$runtime_gemfile" ]; then
  echo "Missing $runtime_gemfile inside the container." >&2
  exit 1
fi

image_stamp="$(cat "$image_stamp_file")"
runtime_stamp="$(sha256sum "$runtime_gemfile" | awk '{ print $1 }')"

if [ "$image_stamp" != "$runtime_stamp" ]; then
  echo "The container gems are out of date for Gemfile." >&2
  echo "Run 'make build' to rebuild the Docker images before starting the service." >&2
  exit 1
fi

exec "$@"
