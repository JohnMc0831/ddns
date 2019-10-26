Set-Location "C:\Projects\ddns"
$currTime = Get-Date -Format "MM/dd/yyyy HH:mm K"
$msg = "Executing node job for freeDNS dynamic DNS update at $currTime" 
Tee-Object -InputObject $msg  -Append -FilePath "C:\Projects\ddns\ddns.log" | Write-Host
Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "c:\projects\ddns\ddns.js" -WorkingDirectory "C:\projects\ddns"
