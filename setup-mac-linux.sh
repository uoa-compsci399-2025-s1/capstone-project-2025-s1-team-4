#!/bin/bash

echo "Running backend server"
cd flask-server

# Setup Python virtual environment only if it doesn't already exist
if [ ! -d "venv" ]; then
  echo "Setting up virtual environment..."
  python3 -m venv venv  # Create virtual environment
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
python server.py &

# Go back to the root project directory
cd ..

# Setup Expo dependencies
echo "Installing Expo dependencies..."
npm install expo@^52.0.0
npm install expo-module-scripts
npx expo install expo-status-bar
npm install @react-native-community/slider

# Run the Expo app
echo "Starting Expo app..."
npx expo start
