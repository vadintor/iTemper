$credentials = Get-Credential
$computer="vs"
Invoke-Command {Do-Stuff} -computername $computer -credential $credentials

Copy-Item -Path .\dist -Destination \\vs\c$\Websites\test.nivapro
