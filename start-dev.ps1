$ErrorActionPreference = "Stop"

if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
  Write-Host "Created .env.local. Please fill in GEMINI_API_KEY."
}

$npm = Get-Command npm -ErrorAction SilentlyContinue

if ($npm) {
  npm run dev
  exit $LASTEXITCODE
}

$installedNpm = "C:\Program Files\nodejs\npm.cmd"

if (Test-Path $installedNpm) {
  $env:Path = "C:\Program Files\nodejs;$env:Path"
  & $installedNpm run dev
  exit $LASTEXITCODE
}

$localNode = "C:\Users\nagachen\AppData\Local\OpenAI\Codex\bin\5b9024f90663758b\node.exe"
$localNpm = ".tools\npm\package\bin\npm-cli.js"

if ((Test-Path $localNode) -and (Test-Path $localNpm)) {
  $env:Path = "$(Split-Path $localNode);$env:Path"
  $env:npm_config_cache = ".npm-cache"
  & $localNode $localNpm run dev
  exit $LASTEXITCODE
}

throw "npm was not found. Please install Node.js, then run this script again."
