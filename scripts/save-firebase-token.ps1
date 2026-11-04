# Capture the current Firebase CLI refresh token into:
#   1) User env var FIREBASE_TOKEN (new terminals)
#   2) %USERPROFILE%\.config\firebase\ci-token.env (for Cursor / scripts)
#
# Run after: firebase login --reauth
# Then in Cursor shells: . .\scripts\load-firebase-token.ps1

$ErrorActionPreference = 'Stop'

$cfg = Join-Path $env:USERPROFILE '.config\configstore\firebase-tools.json'
if (-not (Test-Path $cfg)) {
  Write-Error "No firebase-tools.json at $cfg — run firebase login first."
}

$json = Get-Content $cfg -Raw | ConvertFrom-Json
$token = $json.tokens.refresh_token
if (-not $token) {
  Write-Error "No refresh_token in firebase-tools.json — run firebase login --reauth."
}

$dir = Join-Path $env:USERPROFILE '.config\firebase'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$envFile = Join-Path $dir 'ci-token.env'
Set-Content -Path $envFile -Value "FIREBASE_TOKEN=$token" -NoNewline
# Restrict ACL roughly (current user)
icacls $envFile /inheritance:r /grant:r "$($env:USERNAME):(R)" 2>$null | Out-Null

# Persist for interactive terminals
cmd /c "setx FIREBASE_TOKEN $token" | Out-Null
$env:FIREBASE_TOKEN = $token

Write-Host "Saved FIREBASE_TOKEN ($($token.Length) chars)" -ForegroundColor Green
Write-Host "  env file: $envFile"
Write-Host "  user env: FIREBASE_TOKEN (open a new terminal to pick up setx)"
Write-Host "Load in Cursor: . .\scripts\load-firebase-token.ps1"
