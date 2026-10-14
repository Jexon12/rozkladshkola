$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$taskQa = Join-Path $taskRoot '.qa'
New-Item -ItemType Directory -Path $taskQa -Force | Out-Null
$taskWord = New-Object -ComObject Word.Application
$taskWord.Visible = $false
$taskWord.DisplayAlerts = 0
try {
    foreach ($taskClass in @(7,8,9)) {
        $taskSource = Join-Path $taskRoot "Домашні завдання/Домашні завдання $taskClass клас НУШ.docx"
        $taskPdf = Join-Path $taskQa "$taskClass.pdf"
        $taskDoc = $taskWord.Documents.Open($taskSource, $false, $true)
        $taskDoc.ExportAsFixedFormat($taskPdf,17)
        $taskDoc.Close(0)
        Write-Output "Rendered class $taskClass"
    }
} finally { $taskWord.Quit() }
