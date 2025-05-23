#!/bin/bash

echo "Running backend server"
cd flask-server

# Setup Python virtual environment only if it doesn't already exist
if [ ! -d "venv" ]; then
  echo "Setting up virtual environment..."
  python3 -m venv venv
  echo "Virtual environment created."
else
  echo "Virtual environment already exists. Skipping creation."
fi

# Activate the virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run the server in the background
echo "Starting backend server..."
python3 server.py &

cd ..

# Detect OS type
os=$(uname)

if [ "$os" == "Darwin" ]; then
  # macOS: get IP from en0 (Wi-Fi). Might need to change to en1 depending on your machine.
  ip=$(ipconfig getifaddr en0)
else
  # Linux
  ip=$(hostname -I | awk '{print $1}')
fi

# Define port and construct URL
port=5000
baseUpiUrl="http://$ip:$port/"

# TypeScript export string
tsContent="export const API_BASE_URL = '$baseUpiUrl';"

# Write to config.ts
echo "$tsContent" > ./config.ts

# Optional: output to console
echo "Generated config.ts with BASE_UPI_URL: $baseUpiUrl"

# Setup Expo dependencies
echo "Installing Expo dependencies..."
npm install expo@latest
npm install expo-module-scripts
npx expo install expo-status-bar
npm install @react-navigation/native
npm install @react-native-assets/slider
npm install @react-native-async-storage/async-storage

# Run the Expo app
echo "Starting Expo app..."
npx expo start
