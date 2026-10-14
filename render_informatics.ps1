$ErrorActionPreference = 'Stop'
$taskWord = New-Object -ComObject Word.Application
$taskWord.Visible = $false
$taskWord.DisplayAlerts = 0
try {
    $taskSource = Join-Path $PSScriptRoot 'Домашні завдання/Домашні завдання інформатика 8 клас НУШ.docx'
    $taskPdf = Join-Path $PSScriptRoot '.qa/informatics8.pdf'
    $taskDoc = $taskWord.Documents.Open($taskSource, $false, $true)
    $taskDoc.ExportAsFixedFormat($taskPdf,17)
    $taskDoc.Close(0)
} finally { $taskWord.Quit() }
