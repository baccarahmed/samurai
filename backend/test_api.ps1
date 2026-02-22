# PowerShell script to test the API endpoint

# Login to get a token
$loginUrl = "http://localhost:5000/api/auth/login"
$loginBody = @{
    email = "admin@samurai-nutrition.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Logging in to get token..."
$loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction SilentlyContinue

if ($loginResponse) {
    $token = $loginResponse.token
    Write-Host "Successfully logged in and got token: $($token.Substring(0, 10))..."
    
    # Set up headers with the token
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Make the request to the orders endpoint
    $url = "http://localhost:5000/api/orders"
    Write-Host "Sending GET request to $url"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "Response received successfully"
        Write-Host "Response: $($response | ConvertTo-Json -Depth 5)"
    } catch {
        Write-Host "Error: $_"
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        
        # Try to get the response body for more details
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
        } catch {
            Write-Host "Could not read response body: $_"
        }
    }
} else {
    Write-Host "Login failed"
}