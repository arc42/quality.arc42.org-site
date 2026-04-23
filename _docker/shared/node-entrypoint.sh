#!/bin/sh
set -eu

image_stamp_file="/opt/site-deps/.package-lock.sha256"
runtime_lock_file="/site/package-lock.json"
target_node_modules="/site/node_modules"

if [ ! -f "$runtime_lock_file" ]; then
  echo "Missing $runtime_lock_file inside the container." >&2
  exit 1
fi

image_stamp="$(cat "$image_stamp_file")"
runtime_stamp="$(sha256sum "$runtime_lock_file" | awk '{ print $1 }')"

if [ "$image_stamp" != "$runtime_stamp" ]; then
  echo "The container dependencies are out of date for package-lock.json." >&2
  echo "Run 'make build' to rebuild the Docker images before starting the service." >&2
  exit 1
fi

mkdir -p "$target_node_modules"

volume_stamp=""
if [ -f "$target_node_modules/.package-lock.sha256" ]; then
  volume_stamp="$(cat "$target_node_modules/.package-lock.sha256")"
fi

if [ "$volume_stamp" != "$image_stamp" ]; then
  echo "Syncing node_modules from the image cache..."
  find "$target_node_modules" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  cp -a /opt/site-deps/node_modules/. "$target_node_modules"/
  printf '%s\n' "$image_stamp" > "$target_node_modules/.package-lock.sha256"
fi

exec "$@"
