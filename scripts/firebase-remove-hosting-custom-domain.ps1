#Requires -Version 5.1
<#
.SYNOPSIS
  Remove a custom domain from Firebase Hosting via the Hosting REST API.

.DESCRIPTION
  firebase.json does not list custom domains — they live only in Firebase/Google Cloud.
  There is no `firebase remove-domain` CLI. This script lists custom domains on a site
  and deletes matching hostnames (e.g. agenticops.io and www.agenticops.io).

  Prerequisites: gcloud CLI, logged in (`gcloud auth login` or ADC with access to the project).

.PARAMETER ProjectId
  GCP / Firebase project ID (default: wisptools-production).

.PARAMETER SiteId
  Hosting site ID (default: agenticops-production).

.PARAMETER Domain
  Apex domain to remove (default: agenticops.io). Also removes www.<Domain> if present.

.PARAMETER WhatIf
  List domains only; do not delete.

.EXAMPLE
  .\scripts\firebase-remove-hosting-custom-domain.ps1 -WhatIf
  .\scripts\firebase-remove-hosting-custom-domain.ps1 -Domain agenticops.io
#>
param(
  [string] $ProjectId = "wisptools-production",
  [string] $SiteId = "agenticops-production",
  [string] $Domain = "agenticops.io",
  [switch] $WhatIf
)

$ErrorActionPreference = "Stop"
$base = "https://firebasehosting.googleapis.com/v1beta1"
$listUri = "$base/projects/$ProjectId/sites/$SiteId/customDomains"

try {
  $token = & gcloud auth print-access-token 2>$null
} catch { $token = $null }
if (-not $token) {
  Write-Error "No gcloud access token. Run: gcloud auth login"
}

$headers = @{ Authorization = "Bearer $token" }
$res = Invoke-RestMethod -Uri $listUri -Headers $headers -Method Get
$items = @($res.customDomains)
if (-not $items -or $items.Count -eq 0) {
  Write-Host "No custom domains on site '$SiteId' in project '$ProjectId'."
  exit 0
}

$want = @(
  $Domain.ToLowerInvariant(),
  ("www." + $Domain).ToLowerInvariant()
)

Write-Host "Custom domains on $SiteId`:"
foreach ($d in $items) {
  $dn = $d.domainName
  $match = $want -contains $dn.ToLowerInvariant()
  $flag = if ($match) { " <-- REMOVE" } else { "" }
  Write-Host "  $dn$flag"
}

$toDelete = $items | Where-Object { $want -contains $_.domainName.ToLowerInvariant() }
if (-not $toDelete) {
  Write-Host "No matching domains for '$Domain' / 'www.$Domain'."
  exit 0
}

if ($WhatIf) {
  Write-Host "`nWhatIf: would DELETE $($toDelete.Count) domain binding(s). Run without -WhatIf to delete."
  exit 0
}

foreach ($d in $toDelete) {
  $name = $d.name
  Write-Host "Deleting $name ..."
  Invoke-RestMethod -Uri "$base/$name" -Headers $headers -Method Delete | Out-Null
}
Write-Host "Done. Allow a few minutes for Firebase console to refresh."
