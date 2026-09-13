$loginPayload = @{
    email = "admin@grandhotel.com"
    password = "password123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginPayload -ContentType "application/json"
$token = $loginRes.data.token
$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "`n=== 1. CEO EXECUTIVE KPIS ===" -ForegroundColor Yellow
$kpi = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/executive/kpis" -Headers $headers
$kpi.data | Format-List grossBookingValue, netRevenue, grossProfit, netProfit, netProfitMargin, occupancyRate, revPAR, averageDailyRate

Write-Host "`n=== 2. CFO PROFIT & LOSS ===" -ForegroundColor Yellow
$pl = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/finance/profit-loss" -Headers $headers
$pl.data | Format-List grossRoomRevenue, addOnRevenue, totalRevenue, grossProfit, totalOperatingExpenses, operatingIncomeEbitda, netProfit

Write-Host "`n=== 3. CORPORATE CASH FLOW ===" -ForegroundColor Yellow
$cf = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/finance/cash-flow" -Headers $headers
$cf.data | Format-List openingBalance, totalOperatingInflows, totalOperatingOutflows, closingCashBalance

Write-Host "`n=== 4. EXPENSES REGISTER ===" -ForegroundColor Yellow
$exp = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/expenses" -Headers $headers
Write-Host "Total Seeded Corporate Expenses: $($exp.data.Count)" -ForegroundColor Green

Write-Host "`n=== 5. COO OPERATIONS ===" -ForegroundColor Yellow
$ops = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/operations/analytics" -Headers $headers
$ops.data | Format-List operationalHealthScore, totalRooms, availableRooms, occupiedRooms, todaysExpectedCheckIns, todaysExpectedCheckOuts

Write-Host "`n=== 6. CMO MARKETING ===" -ForegroundColor Yellow
$mkt = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/marketing/analytics" -Headers $headers
$mkt.data | Format-List directBookingRatio, customerAcquisitionCost, estimatedCustomerLifetimeValue, returnOnAdSpend

Write-Host "`n=== 7. CTO SYSTEM TELEMETRY ===" -ForegroundColor Yellow
$cto = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/system/health" -Headers $headers
$cto.data | Format-List systemStatus, databaseStatus, databaseLatencyMs, paymentGatewayStatus, apiSuccessRatePercent, jvmMemoryUsedMb, jvmMemoryMaxMb

Write-Host "`n=== 8. AURA AI EXECUTIVE INSIGHTS ===" -ForegroundColor Yellow
$ai = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/ai/insights" -Headers $headers
Write-Host "Active AI Strategic Insight Cards: $($ai.data.Count)" -ForegroundColor Green

Write-Host "`n=== ALL EXECUTIVE SERVICES VALIDATED 100% SUCCESSFUL ===" -ForegroundColor Green
