#!/bin/bash

echo "Checking if Qwen-Code is already installed..."

# Check if qwen command exists and is functional
if command -v qwen >/dev/null 2>&1; then
    echo "qwen command detected, checking version..."
    
    # Try to get version info
    if qwen --version >/dev/null 2>&1; then
        VERSION=$(qwen --version 2>/dev/null || echo "unknown version")
        echo "✅ Qwen-Code is already installed, version: $VERSION"
        echo "Skipping installation step"
        exit 0
    else
        echo "⚠️  qwen command exists but version info unavailable, attempting reinstallation..."
    fi
else
    echo "qwen command not detected, starting installation..."
fi

echo "Installing Qwen-Code..."
npm install -g @qwen-code/qwen-code@latest

# Verify after installation
if command -v qwen >/dev/null 2>&1; then
    echo "✅ Installation successful!"
    echo "Version info: $(qwen --version 2>/dev/null || echo "failed to get version")"
else
    echo "❌ Installation may have failed, please check npm permissions and network connection"
    exit 1
fi

