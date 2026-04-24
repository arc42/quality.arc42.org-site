#!/bin/sh
set -eu

image_stamp_file="/opt/site-deps/.gemfile-lock.sha256"
runtime_lock_file="/site/Gemfile.lock"

if [ ! -f "$runtime_lock_file" ]; then
  echo "Missing $runtime_lock_file inside the container." >&2
  exit 1
fi

image_stamp="$(cat "$image_stamp_file")"
runtime_stamp="$(sha256sum "$runtime_lock_file" | awk '{ print $1 }')"

if [ "$image_stamp" != "$runtime_stamp" ]; then
  echo "The container gems are out of date for Gemfile.lock." >&2
  echo "Run 'make build' to rebuild the Docker images before starting the service." >&2
  exit 1
fi

exec "$@"
