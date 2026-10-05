param(
  [string]$ApiUrl
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($ApiUrl)) {
  $wifiAddress = Get-NetIPAddress -AddressFamily IPv4 -AddressState Preferred |
    Where-Object {
      $_.InterfaceAlias -match 'Wi-Fi|Wireless' -and
      $_.IPAddress -notlike '169.254.*'
    } |
    Select-Object -First 1

  if (-not $wifiAddress) {
    throw 'No active Wi-Fi IPv4 address found. Pass the backend URL with -ApiUrl, for example: npm run android:apk -- -ApiUrl http://192.168.1.10:5000/api'
  }

  $ApiUrl = "http://$($wifiAddress.IPAddress):5000/api"
}

$parsedApiUrl = $null
if (-not [Uri]::TryCreate($ApiUrl, [UriKind]::Absolute, [ref]$parsedApiUrl) -or $parsedApiUrl.Scheme -notin @('http', 'https')) {
  throw 'ApiUrl must be a valid absolute HTTP or HTTPS URL.'
}

$env:VITE_API_URL = $ApiUrl.TrimEnd('/')

npm run build
if ($LASTEXITCODE -ne 0) {
  throw 'Web app build failed.'
}

npx cap sync android
if ($LASTEXITCODE -ne 0) {
  throw 'Capacitor Android sync failed.'
}

$androidDirectory = Join-Path $PSScriptRoot '..\android'
$gradleWrapper = Join-Path $androidDirectory 'gradlew.bat'
if (-not (Test-Path $gradleWrapper)) {
  throw 'Android project is missing. Run npm run android:add first.'
}

Push-Location $androidDirectory
try {
  & $gradleWrapper assembleDebug
  if ($LASTEXITCODE -ne 0) {
    throw 'Android APK build failed. Check the Gradle output above for a missing Android SDK/JDK or a blocked Gradle download.'
  }
} finally {
  Pop-Location
}

$apkPath = Join-Path $androidDirectory 'app\build\outputs\apk\debug\app-debug.apk'
if (-not (Test-Path $apkPath)) {
  throw "Build completed but the debug APK was not found at $apkPath."
}

$deliverablePath = Join-Path $PSScriptRoot '..\DriveNow-Car-Rental.apk'
Copy-Item -Path $apkPath -Destination $deliverablePath -Force

Write-Output "APK created: $deliverablePath"
Write-Output "API server: $env:VITE_API_URL"
