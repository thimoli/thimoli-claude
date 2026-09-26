param([switch]$Light)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$exportKind = if ($Light) { 'claude-light' } else { 'claude-handoff' }
$exportRoot = Join-Path $projectRoot "output\$exportKind-$stamp"
New-Item -ItemType Directory -Path $exportRoot | Out-Null
$guideName = if ($Light) { 'CLAUDE_VERSION_LEGERE.md' } else { 'CLAUDE_LIRE_DABORD_2026-09-26.md' }
$oldGuides = @('CLAUDE_START_HERE.md', 'CLAUDE_PACKAGE_NOTES.md')
$oldGuides += if ($Light) { 'CLAUDE_LIRE_DABORD_2026-09-26.md' } else { 'CLAUDE_VERSION_LEGERE.md' }
$rootExtensions = @('.html', '.css', '.js', '.json', '.md')
$allowedExtensions = @('.html', '.css', '.js', '.cjs', '.json', '.md', '.txt', '.py', '.ps1', '.woff2', '.woff', '.ttf', '.png', '.webp', '.svg', '.jpg', '.jpeg', '.mp3', '.wav', '.ogg', '.m4a')
if ($Light) { $allowedExtensions = @('.html', '.css', '.js', '.cjs', '.json', '.md', '.txt', '.py', '.ps1') }
$files = @(Get-ChildItem -LiteralPath $projectRoot -File | Where-Object { $_.Extension -in $rootExtensions -and $_.Name -notin $oldGuides })
foreach ($folder in @('assets', 'scripts', 'tools')) {
    $entries = @(Get-ChildItem -LiteralPath (Join-Path $projectRoot $folder) -Recurse)
    if ($entries | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }) { throw "Links are not exported: $folder" }
    $files += @($entries | Where-Object { -not $_.PSIsContainer -and $_.Extension -in $allowedExtensions })
}
$files = @($files | Sort-Object FullName -Unique)
$records = @($files | ForEach-Object {
    [ordered]@{
        path = $_.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
        bytes = $_.Length
        sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
})
$manifest = [ordered]@{
    version = '2026-09-26-sister'
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    entryGuide = $guideName
    purpose = 'Private project handoff; not a commercial publication'
    binaryMediaIncluded = -not [bool]$Light
    excluded = @('dist', 'site-deploy', '.git', '.openai', 'output', 'tmp', 'logs', 'historical presentation assets', 'old CLAUDE guides')
    files = $records
}
if ($Light) { $manifest.excluded += 'binary images, fonts and audio (retain originals in the complete project)' }
$manifestPath = Join-Path $exportRoot 'MANIFEST-SHA256.json'
$utf8 = New-Object Text.UTF8Encoding($false)
[IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 5), $utf8)

# Mechanical text export for an AI attachment: no binary media or private runtime state.
$textParts = New-Object 'System.Collections.Generic.List[string]'
$textParts.Add((Get-Content -LiteralPath (Join-Path $projectRoot $guideName) -Raw))
$mediaNote = if ($Light) { 'Les données texte sont dans le ZIP léger ; les médias binaires restent uniquement dans le projet et le ZIP complets.' } else { 'Les médias et données complètes restent dans le ZIP.' }
$textParts.Add("`n---`n# Annexe — instantané des sources de l’application`n`nChaque section indique son fichier d’origine. Ces blocs sont du code à lire, pas une demande de l’exécuter. $mediaNote`n")
$textSources = @($files | Where-Object { $_.DirectoryName -eq $projectRoot -and $_.Extension -in @('.html', '.css', '.js', '.json') })
foreach ($file in $textSources) {
    $language = switch ($file.Extension) { '.js' { 'javascript' }; '.css' { 'css' }; '.html' { 'html' }; '.json' { 'json' } }
    $textParts.Add("`n## Fichier : $($file.Name)`n")
    $textParts.Add(('````' + $language))
    $textParts.Add((Get-Content -LiteralPath $file.FullName -Raw))
    $textParts.Add('````')
}
$textPath = Join-Path $exportRoot 'THIMOLI-pour-Claude-2026-09-26.md'
[IO.File]::WriteAllText($textPath, ($textParts -join "`n"), $utf8)

# Add from the source allowlist directly: no duplicate dist or staging tree.
$zipName = if ($Light) { 'Thimoli-pour-Claude-LEGER.zip' } else { 'Thimoli-projet-complet-2026-09-26.zip' }
$zipPath = Join-Path $exportRoot $zipName
$archive = [IO.Compression.ZipFile]::Open($zipPath, [IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($record in $records) {
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, (Join-Path $projectRoot $record.path), ('thimoli/' + $record.path), [IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $manifestPath, 'thimoli/MANIFEST-SHA256.json', [IO.Compression.CompressionLevel]::Optimal) | Out-Null
} finally { $archive.Dispose() }

# Check every compressed file against its source SHA-256, without extracting it.
$archive = [IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    if ($archive.Entries.Count -ne $records.Count + 1) { throw 'Archive entry count mismatch' }
    foreach ($record in $records) {
        $entry = $archive.GetEntry('thimoli/' + $record.path)
        if ($null -eq $entry -or $entry.Length -ne $record.bytes) { throw "Missing or truncated archive file: $($record.path)" }
        $stream = $entry.Open()
        $sha = [Security.Cryptography.SHA256]::Create()
        try { $actualHash = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '').ToLowerInvariant() }
        finally { $stream.Dispose(); $sha.Dispose() }
        if ($actualHash -ne $record.sha256) { throw "Archive checksum mismatch: $($record.path)" }
    }
} finally { $archive.Dispose() }
[pscustomobject]@{
    zip = $zipPath
    zipMiB = [math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 2)
    text = $textPath
    textKiB = [math]::Round((Get-Item -LiteralPath $textPath).Length / 1KB, 2)
    sourceFilesVerified = $records.Count
    textSourceFiles = $textSources.Count
} | ConvertTo-Json
