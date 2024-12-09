function Get-BackendEnvVariables {
    param ()
    $envVariables = @{}
    $lines = Get-Content -Path $envFile

    foreach ($line in $lines) {
        # Ignore empty lines and comments
        if (-not [string]::IsNullOrWhiteSpace($line) -and -not $line.TrimStart().StartsWith("#")) {
            # Split the line into key and value at the first '='
            $parts = $line -split '=', 2
            if ($parts.Length -eq 2) {
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()

                # Add the key-value pair to the hashtable
                $envVariables[$key] = $value
            }
        }
    }
    return $envVariables
}

function Set-OpenAI($envFile) {
    Write-Host ""
    $OpenAIKey = ""
    while ($OpenAIKey.Length -eq 0) {
        Write-Host "Enter your OpenAI API key: " -ForegroundColor Cyan
        Write-Host ">" -ForegroundColor Cyan -NoNewline
        $OpenAIKey = Read-Host -assecurestring

        if ($OpenAIKey.Length -eq 0) {
            Write-Host "API key cannot be empty." -ForegroundColor Red
        }
    }
    $OpenAIKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($OpenAIKey)
    )
    $newValue = "OPENAI_API_KEY=$OpenAIKey"
    $newValue | Add-Content -Path $envFile -Encoding UTF8
}

function Set-MongoVariables($envFile) {
    Write-Host ""
    $connectionUrl = ""
    while ($connectionUrl.Length -eq 0) {
        Write-Host "Enter your MongoDB Connection URL: " -ForegroundColor Cyan
        Write-Host ">" -ForegroundColor Cyan -NoNewline
        $connectionUrl = Read-Host -assecurestring

        if ($connectionUrl.Length -eq 0) {
            Write-Host "URL cannot be empty." -ForegroundColor Red
        }
    }
    $connectionUrl = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($connectionUrl)
    )
    $newValue = "CONNECTION_URL=$connectionUrl"
    $newValue | Add-Content -Path $envFile -Encoding UTF8
}

function Set-SavePathForChats($envFile) {
    Write-Host ""
    Write-Host "Where would you like for your chats to be saved?" -ForegroundColor Cyan
    Write-Host "1. File System (default)" -ForegroundColor Cyan
    Write-Host "2. MongoDB" -ForegroundColor Cyan
    Write-Host "Enter Value (Press Enter to skip): " -ForegroundColor Cyan -NoNewline
    $ChatSaveModeSelected = Read-Host
    if ($ChatSaveModeSelected -eq "2") {
        $newValue = "CHAT_SAVE_MODE=2"
        $newValue | Add-Content -Path $envFile -Encoding UTF8
        Set-MongoVariables $envFile
    } else {
        $newValue = "CHAT_SAVE_MODE=1"
        $newValue | Add-Content -Path $envFile -Encoding UTF8
    }
}

# MAIN
# Clear-Host

Write-Host "  _      _      __  __   _____       _             __               " -ForegroundColor White
Write-Host " | |    | |    |  \/  | |_   _|     | |           / _|              " -ForegroundColor White
Write-Host " | |    | |    | \  / |   | |  _ __ | |_ ___ _ __| |_ __ _  ___ ___ " -ForegroundColor Gray
Write-Host " | |    | |    | |\/| |   | | | '_ \| __/ _ \ '__|  _/ _` |/ __/ _ \" -ForegroundColor Gray
Write-Host " | |____| |____| |  | |  _| |_| | | | ||  __/ |  | || (_| | (_|  __/" -ForegroundColor DarkGray
Write-Host " |______|______|_|  |_| |_____|_| |_|\__\___|_|  |_| \__,_|\___\___|" -ForegroundColor Black
Write-Host "                                                                    "

$envFile = ".\backend\.env"
$exist = Test-Path $envFile -PathType Leaf


if ($exist) {
    Write-Host "Backend .env file exists" -ForegroundColor Green
    # Read all lines from the .env file
    $envVariables = Get-BackendEnvVariables
    
    if ($envVariables["CHAT_SAVE_MODE"]) {
        Write-Host "Chat save mode selected" -ForegroundColor Green
    } else {
        Set-SavePathForChats $envFile
    }

    if ($envVariables["OPENAI_API_KEY"]) {
        Write-Host "OpenAI API key found" -ForegroundColor Green
    } else {
        Set-OpenAI $envFile
    }


} else {
    Write-Host "Backend .env file does not exist" -ForegroundColor Red
    Write-Host "Creating .env file for backend" -ForegroundColor Yellow
    Set-Content -Path $envFile -Value ""
    Set-SavePathForChats $envFile
    Set-OpenAI $envFile
}

Write-Host "Setup Complete, Starting Chat" -ForegroundColor Green

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd frontend; npm run dev'

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; npm run dev'