# API Testing Guide

This document provides examples for testing the Pastebin-Lite API endpoints.

## Base URL

- **Local**: `http://localhost:5000`
- **Production**: `https://your-backend.vercel.app`

## Endpoints

### 1. Health Check

Check if the API and database are running.

**Request:**
```bash
curl -X GET http://localhost:5000/api/healthz
```

**Expected Response (200 OK):**
```json
{
  "ok": true,
  "timestamp": "2026-01-27T16:00:00.000Z",
  "database": "connected"
}
```

---

### 2. Create a Simple Paste

Create a paste with no expiry or view limits.

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, World! This is my first paste."
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "abc123xyz",
  "url": "http://localhost:5173/p/abc123xyz"
}
```

---

### 3. Create a Paste with TTL

Create a paste that expires after 60 seconds.

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This paste will expire in 60 seconds",
    "ttl_seconds": 60
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "def456uvw",
  "url": "http://localhost:5173/p/def456uvw"
}
```

---

### 4. Create a Paste with View Limit

Create a paste that can only be viewed 5 times.

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This paste can only be viewed 5 times",
    "max_views": 5
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "ghi789rst",
  "url": "http://localhost:5173/p/ghi789rst"
}
```

---

### 5. Create a Paste with Both TTL and View Limit

Create a paste with both constraints.

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This paste expires in 1 hour OR after 10 views",
    "ttl_seconds": 3600,
    "max_views": 10
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "jkl012mno",
  "url": "http://localhost:5173/p/jkl012mno"
}
```

---

### 6. Fetch a Paste (API)

Retrieve paste content and metadata. **Note: This counts as a view!**

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/abc123xyz
```

**Expected Response (200 OK):**
```json
{
  "content": "Hello, World! This is my first paste.",
  "remaining_views": null,
  "expires_at": null
}
```

**With View Limit:**
```json
{
  "content": "This paste can only be viewed 5 times",
  "remaining_views": 4,
  "expires_at": null
}
```

**With TTL:**
```json
{
  "content": "This paste will expire in 60 seconds",
  "remaining_views": null,
  "expires_at": "2026-01-27T16:01:00.000Z"
}
```

---

### 7. View a Paste (HTML)

Get the HTML view of a paste.

**Request:**
```bash
curl -X GET http://localhost:5000/p/abc123xyz
```

**Expected Response (200 OK):**
Returns HTML page with the paste content.

---

### 8. Error Cases

#### Invalid Input - Empty Content

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": ""
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": ["content is required and must be a non-empty string"]
}
```

#### Invalid Input - Negative TTL

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test",
    "ttl_seconds": -1
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Invalid input",
  "details": ["ttl_seconds must be an integer >= 1"]
}
```

#### Paste Not Found

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/nonexistent
```

**Expected Response (404 Not Found):**
```json
{
  "error": "Paste not found or no longer available"
}
```

#### Paste Expired (TTL)

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/expired-paste-id
```

**Expected Response (404 Not Found):**
```json
{
  "error": "Paste not found or no longer available"
}
```

#### View Limit Exceeded

**Request:**
```bash
# After viewing a paste with max_views=1 twice
curl -X GET http://localhost:5000/api/pastes/view-limited-paste
```

**Expected Response (404 Not Found):**
```json
{
  "error": "Paste not found or no longer available"
}
```

---

## Testing with Deterministic Time (TEST_MODE)

For automated testing, you can use deterministic time.

### Enable Test Mode

Set environment variable:
```bash
TEST_MODE=1
```

### Create a Paste with TTL

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test paste",
    "ttl_seconds": 60
  }'
```

**Response:**
```json
{
  "id": "test123",
  "url": "http://localhost:5173/p/test123"
}
```

### Fetch Before Expiry

Assume current time is `1706371200000` (2024-01-27 16:00:00 UTC)

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/test123 \
  -H "x-test-now-ms: 1706371200000"
```

**Expected Response (200 OK):**
```json
{
  "content": "Test paste",
  "remaining_views": null,
  "expires_at": "2024-01-27T16:01:00.000Z"
}
```

### Fetch After Expiry

Set time to 61 seconds later: `1706371261000`

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/test123 \
  -H "x-test-now-ms: 1706371261000"
```

**Expected Response (404 Not Found):**
```json
{
  "error": "Paste not found or no longer available"
}
```

---

## Testing View Limits

### Create Paste with max_views=2

**Request:**
```bash
curl -X POST http://localhost:5000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Limited views test",
    "max_views": 2
  }'
```

**Response:**
```json
{
  "id": "view123",
  "url": "http://localhost:5173/p/view123"
}
```

### First View

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/view123
```

**Expected Response (200 OK):**
```json
{
  "content": "Limited views test",
  "remaining_views": 1,
  "expires_at": null
}
```

### Second View

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/view123
```

**Expected Response (200 OK):**
```json
{
  "content": "Limited views test",
  "remaining_views": 0,
  "expires_at": null
}
```

### Third View (Should Fail)

**Request:**
```bash
curl -X GET http://localhost:5000/api/pastes/view123
```

**Expected Response (404 Not Found):**
```json
{
  "error": "Paste not found or no longer available"
}
```

---

## PowerShell Examples (Windows)

For Windows users using PowerShell:

### Create Paste
```powershell
$body = @{
    content = "Hello from PowerShell"
    ttl_seconds = 300
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/pastes" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Get Paste
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/pastes/abc123xyz" `
    -Method Get
```

### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/healthz" `
    -Method Get
```

---

## Postman Collection

You can import these examples into Postman:

1. Create a new collection
2. Add requests for each endpoint above
3. Set environment variables:
   - `BASE_URL`: `http://localhost:5000`
   - `PASTE_ID`: (set after creating a paste)

---

## Automated Testing Script

Here's a simple bash script to test all endpoints:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "1. Testing health check..."
curl -s "$BASE_URL/api/healthz" | jq

echo -e "\n2. Creating simple paste..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/pastes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test paste"}')
echo $RESPONSE | jq
PASTE_ID=$(echo $RESPONSE | jq -r '.id')

echo -e "\n3. Fetching paste..."
curl -s "$BASE_URL/api/pastes/$PASTE_ID" | jq

echo -e "\n4. Creating paste with TTL..."
curl -s -X POST "$BASE_URL/api/pastes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Expires in 60s", "ttl_seconds": 60}' | jq

echo -e "\n5. Creating paste with view limit..."
curl -s -X POST "$BASE_URL/api/pastes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Max 5 views", "max_views": 5}' | jq

echo -e "\n6. Testing invalid input..."
curl -s -X POST "$BASE_URL/api/pastes" \
  -H "Content-Type: application/json" \
  -d '{"content": ""}' | jq

echo -e "\n7. Testing non-existent paste..."
curl -s "$BASE_URL/api/pastes/nonexistent" | jq

echo -e "\nAll tests completed!"
```

Save as `test-api.sh` and run with `bash test-api.sh`.
