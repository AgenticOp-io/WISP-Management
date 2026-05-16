#Requires -Version 5.1
<#
.SYNOPSIS
  Transfer listed repositories to GitHub org AgenticOp-io (brand: AgenticOp.io).

.DESCRIPTION
  Requires: gh CLI; admin on source repos; create-repo permission on AgenticOp-io.
  Run: gh auth refresh -h github.com -s admin:org

.PARAMETER WhatIf
  Print actions only; do not call the transfer API.
#>
param(
  [string] $TargetOrg = "AgenticOp-io",
  [switch] $WhatIf
)

$ErrorActionPreference = "Stop"

$Transfers = @(
  @{ Owner = "4GEngineer"; Name = "WISP-Management" },
  @{ Owner = "4GEngineer"; Name = "chrysalis" },
  @{ Owner = "4GEngineer"; Name = "Bandwidth-Test-Manager" },
  @{ Owner = "theorem6"; Name = "agenticops-web" },
  @{ Owner = "theorem6"; Name = "fragility-discovery-engine" }
)

function Test-Gh {
  $null = Get-Command gh -ErrorAction Stop
}

function Test-RepoExists {
  param([string] $Owner, [string] $Name)
  gh api "repos/$Owner/$Name" -q ".full_name" 2>$null
}

Test-Gh

Write-Host "Target org: $TargetOrg (brand AgenticOp.io)"
Write-Host ""

foreach ($t in $Transfers) {
  $owner = $t.Owner
  $name = $t.Name
  $full = "$owner/$name"
  $targetFull = "$TargetOrg/$name"

  Write-Host "--- $full -> $targetFull ---"

  $exists = Test-RepoExists -Owner $owner -Name $name
  if (-not $exists) {
    Write-Warning "Source not found or no access: $full (skip)"
    continue
  }

  $targetExists = Test-RepoExists -Owner $TargetOrg -Name $name
  if ($targetExists) {
    Write-Warning "Target already exists: $targetFull (skip)"
    continue
  }

  if ($WhatIf) {
    Write-Host "[WhatIf] gh api repos/$owner/$name/transfer -X POST -f new_owner=$TargetOrg"
    continue
  }

  try {
    gh api "repos/$owner/$name/transfer" -X POST -f "new_owner=$TargetOrg" | Out-Null
    Write-Host "Transfer initiated: $full -> $targetFull"
  } catch {
    Write-Error "Transfer failed for ${full}: $_"
  }
}

Write-Host ""
Write-Host "Done. Verify https://github.com/$TargetOrg"
