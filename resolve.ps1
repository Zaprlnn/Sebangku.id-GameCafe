$file = "src\pages\app\Kasir.tsx"
$lines = Get-Content $file -Raw
# Regex to match the conflict marker blocks.
# We want to replace:
# <<<<<<< HEAD
# (content of HEAD)
# =======
# (content of incoming)
# >>>>>>> 4cb842fc8e8956248bf4aec4a2459389b881c4f1
# with just the (content of incoming)

$pattern = '(?s)<<<<<<< HEAD\r?\n.*?\r?\n=======\r?\n(.*?)\r?\n>>>>>>> [a-f0-9]+'
$newContent = [regex]::Replace($lines, $pattern, '$1')

Set-Content -Path $file -Value $newContent -NoNewline
