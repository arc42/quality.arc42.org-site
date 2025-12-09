#!/bin/bash

# Check if _site directory exists
if [ ! -d "_site" ]; then
  echo "_site directory does not exist."
  exit 0
fi

# Prompt for confirmation
read -p "Remove _site directory? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf _site
  echo "_site directory removed."
else
  echo "Removal cancelled."
fi
