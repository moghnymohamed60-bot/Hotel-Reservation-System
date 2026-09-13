$r1 = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing
Write-Host "Landing Page HTTP Status: $($r1.StatusCode)"

$r2 = Invoke-WebRequest -Uri "http://localhost:8080/css/styles.css" -UseBasicParsing
Write-Host "CSS File HTTP Status: $($r2.StatusCode) (Size: $($r2.RawContentLength) bytes)"

$r3 = Invoke-WebRequest -Uri "http://localhost:8080/dist/pages/landing.js" -UseBasicParsing
Write-Host "JS Bundle HTTP Status: $($r3.StatusCode) (Size: $($r3.RawContentLength) bytes)"

$r4 = Invoke-RestMethod -Uri "http://localhost:8080/api/hotels"
Write-Host "Hotels API Count: $($r4.data.totalElements) hotels returned"

$r5 = Invoke-WebRequest -Uri "http://localhost:8080/admin.html" -UseBasicParsing
Write-Host "Admin Page HTTP Status: $($r5.StatusCode)"

$r6 = Invoke-WebRequest -Uri "http://localhost:8080/swagger-ui/index.html" -UseBasicParsing
Write-Host "Swagger UI HTTP Status: $($r6.StatusCode)"
