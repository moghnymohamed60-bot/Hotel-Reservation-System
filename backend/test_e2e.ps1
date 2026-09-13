$authBody = @{
    email = "john.doe@example.com"
    password = "password123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $authBody
$token = $login.data.token
Write-Host "Customer login successful. Token acquired."

$headers = @{
    "Authorization" = "Bearer $token"
}

$bookPayload = @{
    roomId = 2
    checkInDate = "2026-12-10"
    checkOutDate = "2026-12-15"
    numberOfGuests = 2
    specialRequests = "High floor ocean view please"
    paymentMethod = "CARD"
} | ConvertTo-Json

try {
    $reservation = Invoke-RestMethod -Uri "http://localhost:8080/api/reservations" -Method Post -ContentType "application/json" -Headers $headers -Body $bookPayload
    Write-Host "Reservation created successfully!"
    Write-Host "Reservation Code: $($reservation.data.reservationCode)"
    Write-Host "Total Price: $($reservation.data.totalPrice)"
    Write-Host "Status: $($reservation.data.reservationStatus)"
    Write-Host "Payment Method: $($reservation.data.payment.paymentMethod)"
    Write-Host "Payment Status: $($reservation.data.payment.paymentStatus)"
    Write-Host "Transaction Ref: $($reservation.data.payment.transactionReference)"
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $errorBody = $reader.ReadToEnd()
    Write-Host "Reservation creation error:" $errorBody
}

# Double-booking prevention test: Attempt to book the exact same room and overlapping dates
Write-Host "`nTesting Anti-Double-Booking Guard..."
try {
    $overlapPayload = @{
        roomId = 2
        checkInDate = "2026-12-12"
        checkOutDate = "2026-12-16"
        numberOfGuests = 2
        paymentMethod = "CARD"
    } | ConvertTo-Json
    $dup = Invoke-RestMethod -Uri "http://localhost:8080/api/reservations" -Method Post -ContentType "application/json" -Headers $headers -Body $overlapPayload
    Write-Host "ERROR: Double booking was not prevented!"
} catch {
    Write-Host "SUCCESS: Double booking was correctly blocked with HTTP $($_.Exception.Response.StatusCode.value__)"
}

# Now test Admin metrics
$adminAuth = @{
    email = "admin@grandhotel.com"
    password = "password123"
} | ConvertTo-Json

$adminLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $adminAuth
$adminToken = $adminLogin.data.token
$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}

$stats = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard/statistics" -Method Get -Headers $adminHeaders
Write-Host "`nAdmin Dashboard Statistics:"
Write-Host "Total Revenue: $($stats.data.totalRevenue)"
Write-Host "Total Reservations: $($stats.data.totalReservations)"
Write-Host "Occupancy Rate: $($stats.data.occupancyRate)%"
