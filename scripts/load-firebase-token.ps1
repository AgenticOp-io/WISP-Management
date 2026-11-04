# Load persistent Firebase CI credentials for non-interactive deploys.
# Usage (from any PowerShell):
#   . C:\Users\david\AgenticOps\products\wisptools\scripts\load-firebase-token.ps1
#   firebase deploy --only hosting

$ErrorActionPreference = 'Stop'

$tokenFile = Join-Path $env:USERPROFILE '.config\firebase\ci-token.env'
if (-not (Test-Path $tokenFile)) {
  Write-Error "Missing $tokenFile — run: firebase login --reauth, then re-run scripts/save-firebase-token.ps1"
}

Get-Content $tokenFile | ForEach-Object {
  if ($_ -match '^\s*FIREBASE_TOKEN=(.+)\s*$') {
    $env:FIREBASE_TOKEN = $Matches[1].Trim()
  }
}

if (-not $env:FIREBASE_TOKEN) {
  Write-Error "FIREBASE_TOKEN not found in $tokenFile"
}

Write-Host "FIREBASE_TOKEN loaded ($($env:FIREBASE_TOKEN.Length) chars) for non-interactive Firebase CLI." -ForegroundColor Green
