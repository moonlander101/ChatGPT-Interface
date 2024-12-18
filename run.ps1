# ===================================================
# ==================== FUNCTIONS ====================
# ===================================================

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
    Write-Host "Enter Value (Press Enter for default): " -ForegroundColor Cyan -NoNewline
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

function Set-SavePathForChatsInConfig($configPath, $config) {
    Write-Host ""
    Write-Host "Where would you like for your chats to be saved?" -ForegroundColor Cyan
    Write-Host "1. File System (default)" -ForegroundColor Cyan
    Write-Host "2. MongoDB" -ForegroundColor Cyan
    Write-Host "Enter Value (Press Enter for default): " -ForegroundColor Cyan -NoNewline
    $ChatSaveModeSelected = Read-Host
    if ($ChatSaveModeSelected -eq "2") {
        $config | Add-Member -NotePropertyName "CHAT_SAVE_MODE" -NotePropertyValue 2
    } else {
        $config | Add-Member -NotePropertyName "CHAT_SAVE_MODE" -NotePropertyValue 1
    }
    $res = $config | ConvertTo-Json -Depth 10
    $res | Out-File -FilePath $configFile -Encoding utf8
    return $config
}

function Set-ModelTypeInConfig($configFile, $config) {
    Write-Host ""
    Write-Host "Where Type of Text Completion Models are you using?" -ForegroundColor Cyan
    Write-Host "1. OpenAI (default)" -ForegroundColor Cyan
    Write-Host "2. HuggingFace" -ForegroundColor Cyan
    Write-Host "Enter Value (Press Enter for default): " -ForegroundColor Cyan -NoNewline
    $modelType = Read-Host
    if ($modelType -eq "2") {
        $config | Add-Member -NotePropertyName "MODEL_TYPE" -NotePropertyValue 2
    } else {
        $config | Add-Member -NotePropertyName "MODEL_TYPE" -NotePropertyValue 1
    }
    $res = $config | ConvertTo-Json -Depth 10
    $res | Out-File -FilePath $configFile -Encoding utf8
    return $config
}

function Set-HuggingFaceKey($envFile) {
    Write-Host ""
    $HFKey = ""
    while ($HFKey.Length -eq 0) {
        Write-Host "Enter your HuggingFace API key: " -ForegroundColor Cyan
        Write-Host ">" -ForegroundColor Cyan -NoNewline
        $HFKey = Read-Host -assecurestring

        if ($HFKey.Length -eq 0) {
            Write-Host "API key cannot be empty." -ForegroundColor Red
        }
    }
    $HFKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($HFKey)
    )
    $newValue = "HF_API_KEY=$HFKey"
    $newValue | Add-Content -Path $envFile -Encoding UTF8
}

function Set-HuggingFaceURL($envFile) {
    Write-Host ""
    $HuggingFaceURL = ""
    while ($HuggingFaceURL.Length -eq 0) {
        Write-Host "Enter your HuggingFace Models URL: " -ForegroundColor Cyan
        Write-Host ">" -ForegroundColor Cyan -NoNewline
        $HuggingFaceURL = Read-Host

        if ($HuggingFaceURL.Length -eq 0) {
            Write-Host "URL cannot be empty." -ForegroundColor Red
        }
    }
    $newValue = "BASE_URL=$HuggingFaceURL"
    $newValue | Add-Content -Path $envFile -Encoding UTF8
}


# ===================================================
# ==================== MAIN CODE ====================
# ===================================================
# Clear-Host


Write-Host "  _      _      __  __   _____       _             __               " -ForegroundColor White
Write-Host " | |    | |    |  \/  | |_   _|     | |           / _|              " -ForegroundColor White
Write-Host " | |    | |    | \  / |   | |  _ __ | |_ ___ _ __| |_ __ _  ___ ___ " -ForegroundColor Gray
Write-Host " | |    | |    | |\/| |   | | | '_ \| __/ _ \ '__|  _/ _` |/ __/ _ \" -ForegroundColor Gray
Write-Host " | |____| |____| |  | |  _| |_| | | | ||  __/ |  | || (_| | (_|  __/" -ForegroundColor DarkGray
Write-Host " |______|______|_|  |_| |_____|_| |_|\__\___|_|  |_| \__,_|\___\___|" -ForegroundColor Black
Write-Host "                                                                    "

$envFile = ".\backend\.env"
$configFile = ".\backend\configs\config.json"
$envExist = Test-Path $envFile -PathType Leaf
$configExist = Test-Path $configFile  -PathType Leaf

if (!$configExist) {
    Write-Host "Backend config file does not exist" -ForegroundColor Red
    Write-Host "Creating config file for backend" -ForegroundColor Yellow
    New-Item -Path $configFile -ItemType "file" -Value "{}" | Out-Null
} else {
    Write-Host "Backend config file exists" -ForegroundColor Green
}

if (!$envExist) {
    Write-Host "Backend .env file does not exist" -ForegroundColor Red
    Write-Host "Creating .env file for backend" -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType "file" | Out-Null
} else {
    Write-Host "Backend .env file exists" -ForegroundColor Green
}

$config = Get-Content $configFile | ConvertFrom-Json

if ([bool]($config.PSobject.Properties.name -match "CHAT_SAVE_MODE")) {
    Write-Host "CHAT_SAVE_MODE found in config" -ForegroundColor Green
} else {
    Write-Host "CHAT_SAVE_MODE not found in config" -ForegroundColor Red
    $config = Set-SavePathForChatsInConfig $configFile $config
}

if ([bool]($config.PSobject.Properties.name -match "MODEL_TYPE")) {
    Write-Host "MODEL_TYPE found in config" -ForegroundColor Green
} else {
    Write-Host "MODEL_TYPE not found in config" -ForegroundColor Red
    $config = Set-ModelTypeInConfig $configFile $config
}

Write-Host ""
Write-Host "Checking for environment variables..." -ForegroundColor Cyan
Write-Host ""

$envVariables = Get-BackendEnvVariables

if ($config.MODEL_TYPE -eq 1) {
    Write-Host "OpenAI Model selected" -ForegroundColor Green
    if ($envVariables["OPENAI_API_KEY"]) {
        Write-Host "OpenAI API key found" -ForegroundColor Green
    } else {
        Set-OpenAI $envFile
    }
} else {
    Write-Host "HuggingFace Model selected" -ForegroundColor Green
    if ($envVariables["HF_API_KEY"]) {
        Write-Host "HuggingFace API key found" -ForegroundColor Green
    } else {
        Set-HuggingFaceKey $envFile
    }

    if ($envVariables["BASE_URL"]) {
        Write-Host "Base URL found" -ForegroundColor Green
    } else {
        Set-HuggingFaceURL $envFile
    }
}

if ($config.CHAT_SAVE_MODE -eq 2) {
    Write-Host "MongoDB selected" -ForegroundColor Green
    
    if ($envVariables["CONNECTION_URL"]) {
        Write-Host "MongoDB Connection URL found" -ForegroundColor Green
    } else {
        Set-MongoVariables $envFile
    }

} else {
    Write-Host "File System selected" -ForegroundColor Green
}

if ($config.PSObject.Properties.Name -contains "model") {
    Write-Host "Model found in config" -ForegroundColor Green
} else {
    Write-Host "Model not found in config" -ForegroundColor Red
    Write-Host "Enter the model name: " -ForegroundColor Cyan
    Write-Host ">" -ForegroundColor Cyan -NoNewline
    $model = Read-Host
    $config | Add-Member -NotePropertyName "model" -NotePropertyValue $model
    $res = $config | ConvertTo-Json -Depth 10
    $res | Out-File -FilePath $configFile -Encoding utf8
}

Write-Host "Setup Complete, Starting Chat" -ForegroundColor Green

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd frontend; npm run dev'

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; npm run dev'