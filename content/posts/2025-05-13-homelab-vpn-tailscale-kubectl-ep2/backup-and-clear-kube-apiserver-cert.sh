#!/bin/bash

set -e

CERT_DIR="/var/lib/rancher/rke2/server/tls"
BACKUP_DIR="/var/lib/rancher/rke2/server/tls-backup-$(date +%Y%m%d-%H%M%S)"
FILES_TO_BACKUP=(
  "serving-kube-apiserver.crt"
  "serving-kube-apiserver.key"
)

echo "📁 Preparing backup directory: $BACKUP_DIR"
sudo mkdir -p "$BACKUP_DIR"

echo "🔍 Checking files..."
for FILE in "${FILES_TO_BACKUP[@]}"; do
  FULL_PATH="$CERT_DIR/$FILE"
  if [ ! -f "$FULL_PATH" ]; then
    echo "❌ ERROR: Missing expected file: $FULL_PATH"
    exit 1
  fi
done

echo "📦 Backing up certs..."
for FILE in "${FILES_TO_BACKUP[@]}"; do
  sudo cp "$CERT_DIR/$FILE" "$BACKUP_DIR/"
  echo "✅ Backed up $FILE"
done

echo "🛑 Stopping RKE2 server..."
sudo systemctl stop rke2-server

echo "🧹 Removing old certs (will trigger RKE2 to regenerate)..."
for FILE in "${FILES_TO_BACKUP[@]}"; do
  sudo rm -f "$CERT_DIR/$FILE"
  echo "🗑 Removed $FILE"
done

echo "🚀 Restarting RKE2 server..."
sudo systemctl start rke2-server

echo "✅ Done! Original certs are backed up at: $BACKUP_DIR"

