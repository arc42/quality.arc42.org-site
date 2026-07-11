#!/bin/bash
# Exit on error
set -e

# Make sure we are in the script's directory
cd "$(dirname "$0")"

CONTAINER="q42-dashboard"
IMAGE="q42-dashboard"
URL="http://localhost:3000"

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: docker is not installed or not in PATH."
    echo "Please install Docker and try again."
    exit 1
fi

# Pick a browser-opener for the current platform.
open_browser() {
  if command -v open &> /dev/null; then
    open "$URL"            # macOS
  elif command -v xdg-open &> /dev/null; then
    xdg-open "$URL"        # Linux
  else
    echo "ℹ️  Open $URL in your browser."
  fi
}

# --- `stop` subcommand: shut the dashboard down -------------------------------
if [ "$1" = "stop" ]; then
  if docker ps -q -f "name=^${CONTAINER}$" | grep -q .; then
    echo "🛑 Stopping dashboard..."
    docker stop "$CONTAINER" > /dev/null
    echo "✅ Dashboard stopped."
  else
    echo "ℹ️  Dashboard is not running."
  fi
  exit 0
fi

echo "========================================================"
echo "   Starting arc42 Quality Model Dashboard"
echo "========================================================"

# Remove any stale container so the fixed name is free.
docker rm -f "$CONTAINER" > /dev/null 2>&1 || true

echo "🐳 Building Docker image '${IMAGE}'..."
docker build -t "$IMAGE" ./tmp

echo "🚀 Starting Q42 Dashboard container (detached)..."
# Run detached so the shell returns immediately. --init gives us a proper init
# (tini) as PID 1 that forwards signals, so `docker stop` shuts down cleanly.
docker run -d --rm --init \
  --name "$CONTAINER" \
  -p 3000:3000 \
  -v "$(pwd):/workspace:ro" \
  "$IMAGE" > /dev/null

# Wait (up to ~30s) for the server to answer, then open the browser.
for _ in $(seq 1 60); do
  if curl -s -o /dev/null "$URL" 2>/dev/null; then
    echo "🌐 Opening dashboard in your browser..."
    open_browser
    break
  fi
  sleep 0.5
done

echo "--------------------------------------------------------"
echo "✅ Dashboard is running at: $URL"
echo "👉 Stop it with:  ./dashboard.sh stop"
echo "   (or the Stop button in the dashboard, or: docker stop ${CONTAINER})"
echo "--------------------------------------------------------"
