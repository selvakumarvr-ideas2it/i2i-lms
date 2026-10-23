<#
  Prepares an upload-ready zip of this repo for Azure Cloud Shell.

  Step 1: deletes local-only / reproducible folders so the zip is small and
          doesn't ship anything Cloud Shell regenerates itself (npm install)
          or that's just local build/emulator output.
  Step 2: compresses everything that's left into a zip next to the repo.

  Run from the project root (powerbi-accelerator/):
    .\scripts\prepare-cloud-shell-zip.ps1

  NOTE: this deletes your local node_modules (root + api/) and dist folders.
  You'll need to run `npm install` (root and api/) again for local dev after
  running this - that's expected, not a bug.
#>

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$pathsToRemove = @(
  'node_modules',
  'api\node_modules',
  'dist',
  'api\dist',
  '.azurite',
  '.git'
)

Write-Host "Cleaning unwanted files from $root ..."
foreach ($path in $pathsToRemove) {
  $full = Join-Path $root $path
  if (Test-Path $full) {
    Write-Host "  Removing $path"
    Remove-Item -Recurse -Force $full
  }
}

# Common OS/editor clutter that shouldn't ship either
Get-ChildItem -Path $root -Recurse -Force -Include 'Thumbs.db', '.DS_Store' -ErrorAction SilentlyContinue |
  ForEach-Object {
    Write-Host "  Removing $($_.FullName.Substring($root.Length + 1))"
    Remove-Item -Force $_.FullName -ErrorAction SilentlyContinue
  }

$zipPath = Join-Path (Split-Path $root -Parent) 'powerbi-accelerator.zip'
if (Test-Path $zipPath) {
  Write-Host "Removing existing $zipPath"
  Remove-Item -Force $zipPath
}

Write-Host "Compressing $root to $zipPath ..."
# Get-ChildItem -Force (not a bare '*' glob) so dotfolders like .github ship too.
$items = Get-ChildItem -Path $root -Force | Select-Object -ExpandProperty FullName
Compress-Archive -Path $items -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "Done: $zipPath"
