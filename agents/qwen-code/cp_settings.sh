#!/bin/bash

# Copy settings.json to ~/.qwen/settings.json
echo "Setting up configuration..."
QWEN_CONFIG_DIR="$HOME/.qwen"
SETTINGS_SOURCE="$(dirname "$0")/settings.json"
SETTINGS_TARGET="$QWEN_CONFIG_DIR/settings.json"
SETTINGS_BACKUP="$QWEN_CONFIG_DIR/settings.backup.json"

# Create .qwen directory if it doesn't exist
if [ ! -d "$QWEN_CONFIG_DIR" ]; then
    mkdir -p "$QWEN_CONFIG_DIR"
    echo "Created directory: $QWEN_CONFIG_DIR"
fi

# Check if settings.json already exists
if [ -f "$SETTINGS_TARGET" ]; then
    # Check if backup already exists
    if [ ! -f "$SETTINGS_BACKUP" ]; then
        cp "$SETTINGS_TARGET" "$SETTINGS_BACKUP"
        echo "📋 Existing settings.json backed up to: $SETTINGS_BACKUP"
    else
        echo "📋 Backup already exists at: $SETTINGS_BACKUP (skipping backup)"
    fi
else
    echo "📋 No existing settings.json found"
fi

# Copy new settings.json
cp "$SETTINGS_SOURCE" "$SETTINGS_TARGET"
echo "✅ Configuration updated: $SETTINGS_TARGET"
echo "Setup complete! 🎉"