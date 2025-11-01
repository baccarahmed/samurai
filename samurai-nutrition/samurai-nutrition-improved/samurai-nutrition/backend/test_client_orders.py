import requests
import json

# Configuration
BASE_URL = 'http://localhost:5000/api'
LOGIN_URL = f'{BASE_URL}/auth/login'
ORDERS_ALL_URL = f'{BASE_URL}/orders-all'

# Test user credentials
user_credentials = {
    'email': 'john@example.com',
    'password': 'password123'
}

admin_credentials = {
    'email': 'admin@samurai-nutrition.com',
    'password': 'admin123'
}

def test_orders_endpoint(credentials):
    print(f"\nTesting orders-all endpoint with user: {credentials['email']}")
    
    # Step 1: Login to get JWT token
    print("\n1. Logging in to get JWT token...")
    login_response = requests.post(LOGIN_URL, json=credentials)
    
    if login_response.status_code != 200:
        print(f"Login failed with status code: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return
    
    login_data = login_response.json()
    token = login_data.get('access_token') or login_data.get('token')
    
    if not token:
        print("No access token in response")
        print(f"Response: {login_data}")
        return
    
    print("Login successful, received JWT token")
    
    # Step 2: Get orders with JWT token
    print("\n2. Getting orders with JWT token...")
    headers = {'Authorization': f'Bearer {token}'}
    
    orders_response = requests.get(ORDERS_ALL_URL, headers=headers)
    
    print(f"Status code: {orders_response.status_code}")
    
    if orders_response.status_code == 200:
        orders_data = orders_response.json()
        orders = orders_data.get('orders', [])
        
        print(f"Successfully retrieved {len(orders)} orders")
        
        # Print orders details
        for i, order in enumerate(orders):
            print(f"\nOrder {i+1}:")
            print(f"  ID: {order.get('id')}")
            print(f"  User ID: {order.get('user_id')}")
            print(f"  Status: {order.get('status')}")
            print(f"  Total Amount: {order.get('total_amount')}")
    else:
        print(f"Failed to retrieve orders: {orders_response.text}")

# Test with regular user
print("\n=== TESTING WITH REGULAR USER ===")
test_orders_endpoint(user_credentials)

# Test with admin user
print("\n=== TESTING WITH ADMIN USER ===")
test_orders_endpoint(admin_credentials)