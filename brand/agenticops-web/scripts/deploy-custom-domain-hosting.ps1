#Requires -Version 5.1
<#
.SYNOPSIS
  Optional: deploy this folder to Hosting site agenticops-production (project wisptools-production).

.DESCRIPTION
  Public domain **agenticop.io** should use **`firebase deploy --only hosting --project agenticop-io`**.
  Run this script when you still want **agenticops-production** / ***.firebaseapp.com** URLs to match the same static files.

.EXAMPLE
  .\scripts\deploy-custom-domain-hosting.ps1
#>
$ErrorActionPreference = "Stop"
$siteDir = Split-Path $PSScriptRoot -Parent
Set-Location $siteDir
if (-not (Test-Path "firebase.hosting-wisptools-agenticop.json")) {
  Write-Error "firebase.hosting-wisptools-agenticop.json missing."
}
$bak = "firebase.__deploy_wisptools__.json.bak"
try {
  Copy-Item -Force "firebase.json" $bak
  Copy-Item -Force "firebase.hosting-wisptools-agenticop.json" "firebase.json"
  firebase deploy --only hosting:agenticops --project wisptools-production
} finally {
  if (Test-Path $bak) {
    Copy-Item -Force $bak "firebase.json"
    Remove-Item -Force $bak
  }
}
