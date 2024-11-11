# Step 1: Change to the first directory and run npm run dev
Write-Host "Navigating to the first directory and running 'npm run dev'..."
cd frontend
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'npm run dev'

# Step 2: Wait for the new terminal to open
Start-Sleep -Seconds 2

# Step 3: Change to the second directory and run npm run dev
Write-Host "Navigating to the second directory and running 'npm run dev'..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'npm run dev; cd ../backend; npm run dev'