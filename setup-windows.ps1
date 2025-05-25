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

# Get the local IPv4 address (non-loopback)
$ip = (Get-NetIPAddress -AddressFamily IPv4 `
       | Where-Object { $_.IPAddress -notmatch "^169\.254|^127\." -and $_.InterfaceAlias -notmatch "Virtual|Loopback" } `
       | Select-Object -First 1 -ExpandProperty IPAddress)

# Define port and construct URL
$port = 5000
$baseUpiUrl = "http://$ip`:$port/"

# TypeScript export string
$tsContent = @"
export const API_BASE_URL = '$baseUpiUrl';
"@

# Write to config.ts
Set-Content -Path "./config.ts" -Value $tsContent

# Optional: output to console
Write-Host "Generated config.ts with BASE_UPI_URL: $baseUpiUrl"


# Setup Expo
Write-Host "Installing Expo dependencies..."
npm install expo@latest
npm install expo-module-scripts
npx expo install expo-status-bar
npm install @react-native-assets/slider
npm install @react-navigation/native
npm install @react-native-async-storage/async-storage
npx expo install expo-haptics

# Run the Expo app
Write-Host "Starting Expo app..."
npx expo start