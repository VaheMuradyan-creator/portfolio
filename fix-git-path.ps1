# Quick script to add Git to PATH
# Run this in PowerShell (you may need to run as Administrator for system-wide PATH)

Write-Host "Checking Git installation..." -ForegroundColor Cyan

# Check if Git is installed
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"
)

$gitFound = $false
$gitBinPath = ""

foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitBinPath = Split-Path $path
        $gitFound = $true
        Write-Host "Found Git at: $gitBinPath" -ForegroundColor Green
        break
    }
}

if (-not $gitFound) {
    Write-Host "Git not found in common locations." -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

# Check current PATH
$currentUserPath = [Environment]::GetEnvironmentVariable("Path", "User")
$currentSystemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Check if already in PATH
if ($currentUserPath -like "*$gitBinPath*" -or $currentSystemPath -like "*$gitBinPath*") {
    Write-Host "Git is already in your PATH!" -ForegroundColor Green
    Write-Host "If it's not working, restart your terminal." -ForegroundColor Yellow
    exit
}

# Ask user which PATH to modify
Write-Host "`nWhere would you like to add Git to PATH?" -ForegroundColor Cyan
Write-Host "1. User PATH (recommended - only for your account)" -ForegroundColor White
Write-Host "2. System PATH (for all users - requires Administrator)" -ForegroundColor White

$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    # Add to User PATH
    $newPath = $currentUserPath + ";$gitBinPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "`nAdded Git to User PATH!" -ForegroundColor Green
    Write-Host "Path added: $gitBinPath" -ForegroundColor Green
} elseif ($choice -eq "2") {
    # Check if running as admin
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Host "`nError: Adding to System PATH requires Administrator privileges." -ForegroundColor Red
        Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
        exit
    }
    
    # Add to System PATH
    $newPath = $currentSystemPath + ";$gitBinPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "`nAdded Git to System PATH!" -ForegroundColor Green
    Write-Host "Path added: $gitBinPath" -ForegroundColor Green
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SUCCESS! Git has been added to PATH." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nIMPORTANT: Close and reopen your terminal for changes to take effect." -ForegroundColor Yellow
Write-Host "Then test with: git --version" -ForegroundColor Yellow

