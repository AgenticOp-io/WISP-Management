#Requires -Version 5.1
<#
.SYNOPSIS
  Copy docs/WHITEPAPER.md to WHITEPAPER.md at site root for Firebase Hosting + whitepaper.html fetch.
#>
$ErrorActionPreference = "Stop"
$siteDir = Split-Path $PSScriptRoot -Parent
$src = Join-Path $siteDir "docs\WHITEPAPER.md"
$dst = Join-Path $siteDir "WHITEPAPER.md"
if (-not (Test-Path $src)) {
  Write-Error "Missing $src"
}
Copy-Item -Force $src $dst
Write-Host "Synced WHITEPAPER.md from docs/WHITEPAPER.md"
