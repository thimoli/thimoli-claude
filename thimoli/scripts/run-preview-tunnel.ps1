$ErrorActionPreference = 'Stop'

$cloudflaredPath = Join-Path $env:TEMP 'thimoli-cloudflared\cloudflared.exe'
$logPath = Join-Path $env:TEMP 'thimoli-cloudflared\persistent.log'

if (-not (Test-Path -LiteralPath $cloudflaredPath)) {
    throw "cloudflared is missing at $cloudflaredPath"
}

& $cloudflaredPath tunnel --no-autoupdate --protocol http2 --logfile $logPath --url http://127.0.0.1:4173
