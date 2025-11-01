import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def login():
    """Login as admin and get authentication token"""
    login_data = {
        "email": "admin@samurai-nutrition.com",
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token") or data.get("token")
        print(f"Login successful")
        return token
    else:
        print(f"Login failed: {response.status_code}")
        print(response.text)
        return None

def update_order_status(token, order_id, new_status):
    """Update the status of order ID 35"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    update_data = {
        "status": new_status,
        "comment": "Test update from script"
    }
    
    print(f"\nSending request to update order {order_id} to status '{new_status}'")
    print(f"Headers: {headers}")
    print(f"Data: {json.dumps(update_data)}")
    
    response = requests.put(
        f"{BASE_URL}/admin/orders/{order_id}/status", 
        headers=headers, 
        json=update_data
    )
    
    print(f"\nResponse status code: {response.status_code}")
    print(f"Response headers: {response.headers}")
    
    try:
        print(f"Response body: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response body: {response.text}")
    
    return response

if __name__ == "__main__":
    # Login as admin
    token = login()
    if not token:
        print("Failed to login. Exiting.")
        exit(1)
    
    # Update order status
    order_id = 35
    new_status = "processing"  # Try with a valid status
    update_order_status(token, order_id, new_status)