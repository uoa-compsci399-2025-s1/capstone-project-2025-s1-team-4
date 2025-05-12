# # setup.ps1 for Windows PowerShell
Write-Host "Running backend server"
cd flask-server

# Setup Python virtual environment only if it doesn't already exist
if (-Not (Test-Path "venv")) {
    Write-Host "Setting up virtual environment..."
    py -3 -m venv venv  # Create virtual environment
    Write-Host "Virtual environment created."
} else {
    Write-Host "Virtual environment already exists. Skipping creation."
}

# Activate the virtual environment
.\venv\Scripts\activate

# Install Python dependencies
Write-Host "Installing Python dependencies..."
pip install -r requirements.txt

# Run the server
Start-Process python server.py

cd ..

# Setup Expo
Write-Host "Installing Expo dependencies..."
npm install expo@^52.0.0
npm install expo-module-scripts
npx expo install expo-status-bar
npm install @react-native-community/slider

# Run the Expo app
Write-Host "Starting Expo app..."
npx expo start