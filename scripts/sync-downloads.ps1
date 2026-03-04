param(
  [string]$MapPath = "sync-map.json",
  [switch]$Watch,
  [int]$PollSeconds = 2,
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

function Get-RepoRoot {
  $root = (& git rev-parse --show-toplevel 2>$null)
  if (-not $root) {
    throw "Not inside a git repository."
  }
  return $root.Trim()
}

function Read-Map([string]$RepoRoot, [string]$RelativeMapPath) {
  $fullMapPath = Join-Path $RepoRoot $RelativeMapPath
  if (-not (Test-Path $fullMapPath)) {
    throw "Map file not found: $fullMapPath"
  }
  $raw = Get-Content -Raw -LiteralPath $fullMapPath
  $items = $raw | ConvertFrom-Json
  if (-not $items) {
    throw "Map file is empty: $fullMapPath"
  }
  return $items
}

function Get-Fingerprint([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    return $null
  }
  $item = Get-Item -LiteralPath $Path
  return "$($item.LastWriteTimeUtc.Ticks)|$($item.Length)"
}

function Sync-ChangedFiles([string]$RepoRoot, [array]$MapItems, [hashtable]$State, [switch]$InitialRun) {
  $copiedTargets = New-Object System.Collections.Generic.List[string]
  foreach ($entry in $MapItems) {
    $source = [string]$entry.source
    $targetRel = [string]$entry.target
    if ([string]::IsNullOrWhiteSpace($source) -or [string]::IsNullOrWhiteSpace($targetRel)) {
      continue
    }
    $target = Join-Path $RepoRoot $targetRel
    $fingerprint = Get-Fingerprint $source
    if (-not $fingerprint) {
      Write-Host "Source missing, skipping: $source" -ForegroundColor Yellow
      continue
    }

    $key = "$source=>$targetRel"
    $changed = $InitialRun -or (-not $State.ContainsKey($key)) -or ($State[$key] -ne $fingerprint)
    if (-not $changed) {
      continue
    }

    $targetDir = Split-Path -Parent $target
    if (-not (Test-Path -LiteralPath $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir | Out-Null
    }

    Copy-Item -LiteralPath $source -Destination $target -Force
    $State[$key] = $fingerprint
    $copiedTargets.Add($targetRel)
    Write-Host "Synced $source -> $targetRel" -ForegroundColor Cyan
  }

  if ($copiedTargets.Count -eq 0) {
    return
  }

  foreach ($relTarget in $copiedTargets) {
    & git -C $RepoRoot add -- $relTarget
  }

  & git -C $RepoRoot diff --cached --quiet
  if ($LASTEXITCODE -eq 0) {
    Write-Host "No staged file differences after sync." -ForegroundColor DarkGray
    return
  }

  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $msg = "sync: update downloaded study files ($ts)"
  & git -C $RepoRoot commit -m $msg | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "Commit failed."
  }

  & git -C $RepoRoot push origin $Branch | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "Push failed."
  }
}

$repoRoot = Get-RepoRoot
$mapItems = Read-Map -RepoRoot $repoRoot -RelativeMapPath $MapPath
$state = @{}

Write-Host "Repo: $repoRoot" -ForegroundColor Green
Write-Host "Map:  $MapPath" -ForegroundColor Green

Sync-ChangedFiles -RepoRoot $repoRoot -MapItems $mapItems -State $state -InitialRun

if (-not $Watch) {
  Write-Host "Sync completed (single run)." -ForegroundColor Green
  exit 0
}

Write-Host "Watching for changes every $PollSeconds seconds. Press Ctrl+C to stop." -ForegroundColor Green
while ($true) {
  Start-Sleep -Seconds $PollSeconds
  Sync-ChangedFiles -RepoRoot $repoRoot -MapItems $mapItems -State $state
}
