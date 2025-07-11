# EduPress Authentication Testing Script

Write-Host "EduPress Backend Authentication Testing" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Base URL
$baseUrl = "http://localhost:8081"

Write-Host "`n1. Testing Student Authentication..." -ForegroundColor Yellow

# Test 1: Authenticate as Student
$loginData = @{
    email = "student@edupress.com"
    password = "student123"
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Student Authentication SUCCESS" -ForegroundColor Green
    Write-Host "   User ID: $($authResponse.id)"
    Write-Host "   Email: $($authResponse.email)"
    Write-Host "   Role: $($authResponse.roles -join ', ')"
    Write-Host "   Token Type: $($authResponse.type)"
    
    $studentToken = $authResponse.token
    Write-Host "   Token: $($studentToken.Substring(0,50))..."
    
} catch {
    Write-Host "❌ Student Authentication FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
    exit 1
}

Write-Host "`n2. Testing Admin Authentication..." -ForegroundColor Yellow

# Test 2: Authenticate as Admin
$adminLoginData = @{
    email = "admin@edupress.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $adminAuthResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -Body $adminLoginData -ContentType "application/json"
    Write-Host "✅ Admin Authentication SUCCESS" -ForegroundColor Green
    Write-Host "   User ID: $($adminAuthResponse.id)"
    Write-Host "   Email: $($adminAuthResponse.email)"
    Write-Host "   Role: $($adminAuthResponse.roles -join ', ')"
    
    $adminToken = $adminAuthResponse.token
    
} catch {
    Write-Host "❌ Admin Authentication FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host "`n3. Testing Instructor Authentication..." -ForegroundColor Yellow

# Test 3: Authenticate as Instructor
$instructorLoginData = @{
    email = "instructor@edupress.com"
    password = "instructor123"
} | ConvertTo-Json

try {
    $instructorAuthResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -Body $instructorLoginData -ContentType "application/json"
    Write-Host "✅ Instructor Authentication SUCCESS" -ForegroundColor Green
    Write-Host "   User ID: $($instructorAuthResponse.id)"
    Write-Host "   Email: $($instructorAuthResponse.email)"
    Write-Host "   Role: $($instructorAuthResponse.roles -join ', ')"
    
    $instructorToken = $instructorAuthResponse.token
    
} catch {
    Write-Host "❌ Instructor Authentication FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host "`n4. Testing Public Endpoint Access..." -ForegroundColor Yellow

# Test 4: Test public endpoint (categories)
try {
    $categoriesResponse = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method GET
    Write-Host "✅ Public Categories Endpoint ACCESS SUCCESS" -ForegroundColor Green
    Write-Host "   Number of categories: $($categoriesResponse.Count)"
} catch {
    Write-Host "⚠️  Public Categories Endpoint Response: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    Write-Host "   This might be expected if it requires authentication"
}

Write-Host "`n5. Testing Protected Endpoint with Student Token..." -ForegroundColor Yellow

# Test 5: Test protected endpoint with student token
if ($studentToken) {
    $headers = @{
        "Authorization" = "Bearer $studentToken"
        "Content-Type" = "application/json"
    }
    
    try {
        $userResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/profile" -Method GET -Headers $headers
        Write-Host "✅ Student Profile Access SUCCESS" -ForegroundColor Green
        Write-Host "   Profile data retrieved successfully"
    } catch {
        Write-Host "⚠️  Student Profile Access Response: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "   Endpoint may not be implemented yet"
        } elseif ($_.Exception.Response.StatusCode -eq 403) {
            Write-Host "   Access forbidden for student role"
        }
    }
}

Write-Host "`n6. Testing Admin-Only Endpoint with Student Token..." -ForegroundColor Yellow

# Test 6: Test admin-only endpoint with student token (should fail)
if ($studentToken) {
    $headers = @{
        "Authorization" = "Bearer $studentToken"
        "Content-Type" = "application/json"
    }
    
    try {
        $allUsersResponse = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method GET -Headers $headers
        Write-Host "❌ SECURITY ISSUE: Student accessed admin endpoint!" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 403) {
            Write-Host "✅ Access Control Working: Student properly denied admin access" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Admin Endpoint Response: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n7. Testing Admin-Only Endpoint with Admin Token..." -ForegroundColor Yellow

# Test 7: Test admin-only endpoint with admin token (should work)
if ($adminToken) {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    
    try {
        $allUsersResponse = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method GET -Headers $headers
        Write-Host "✅ Admin Access Working: Admin successfully accessed admin endpoint" -ForegroundColor Green
        Write-Host "   Retrieved user data successfully"
    } catch {
        Write-Host "⚠️  Admin Access Response: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)"
    }
}

Write-Host "`n" -ForegroundColor Green
Write-Host "Authentication Testing Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
