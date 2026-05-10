#Requires -Version 5.1
<#
.SYNOPSIS
  Remove a custom domain from Firebase Hosting via the Hosting REST API.

.PARAMETER ProjectId
.PARAMETER SiteId
.PARAMETER Domain  Apex hostname to remove; also removes www.<Domain>
.PARAMETER WhatIf
#>
param(
  [string] $ProjectId = "agenticop-io",
  [string] $SiteId = "agenticop-io",
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
