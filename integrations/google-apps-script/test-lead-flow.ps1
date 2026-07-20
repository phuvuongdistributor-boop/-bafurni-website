param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^https://script\.google\.com/.+/exec$')]
  [string]$Endpoint,

  [string]$Phone = '0900000000'
)

$payload = @{
  need_type    = 'project'
  org_type     = 'contractor'
  quantity     = '100plus'
  timeline     = '30days'
  budget       = '500plus'
  region       = 'Nam Định'
  name         = 'BAFurniture Production Test'
  phone        = $Phone
  company      = 'BAFurniture'
  note         = 'V7.1 end-to-end smoke test'
  source       = 'production-smoke-test'
  page_url     = 'https://bafurni.com/'
  utm_source   = 'codex'
  utm_medium   = 'smoke-test'
  submitted_at = (Get-Date).ToUniversalTime().ToString('o')
} | ConvertTo-Json

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
try {
  $response = Invoke-RestMethod `
    -Uri $Endpoint `
    -Method Post `
    -ContentType 'application/json; charset=utf-8' `
    -Body $payload `
    -TimeoutSec 15
} finally {
  $stopwatch.Stop()
}

$elapsedMs = $stopwatch.ElapsedMilliseconds
$pass = $response.ok -eq $true -and $elapsedMs -lt 10000

[pscustomobject]@{
  pass          = $pass
  elapsed_ms    = $elapsedMs
  lead_id       = $response.lead_id
  server_ms     = $response.total_ms
  telegram_sent = 'Verify message in Telegram'
  sheet_row     = 'Verify lead_id in Leads tab'
}

if (-not $pass) {
  throw "Lead flow failed or exceeded 10 seconds."
}
