#!/bin/bash

# Navigate to your target directory
cd ./_requirements || exit

# Find all .md files recursively
find . -type f -name "*.md" | while read -r filepath; do
  # Extract directory and filename
  dir=$(dirname "$filepath")
  file=$(basename "$filepath")

  # Use regex to match and remove YYYY-MM-DD- from the filename
  if [[ $file =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-(.*\.md)$ ]]; then
    new_name="${BASH_REMATCH[1]}"
    old_path="$dir/$file"
    new_path="$dir/$new_name"

    # Preview
    echo "Renaming: $old_path → $new_path"

    # Uncomment the next line to actually rename
    mv "$old_path" "$new_path"
  fi
done
