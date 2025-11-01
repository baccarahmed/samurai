import requests
import json

# Configuration
BASE_URL = 'http://localhost:5000/api'
LOGIN_URL = f'{BASE_URL}/auth/login'
ORDERS_URL = f'{BASE_URL}/orders'

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
    print(f"\nTesting orders endpoint with user: {credentials['email']}")
    
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
    
    orders_response = requests.get(ORDERS_URL, headers=headers)
    
    print(f"Status code: {orders_response.status_code}")
    
    if orders_response.status_code == 200:
        orders_data = orders_response.json()
        orders = orders_data.get('orders', [])
        pagination = orders_data.get('pagination', {})
        
        print(f"Successfully retrieved {len(orders)} orders")
        print(f"Pagination info: {json.dumps(pagination, indent=2)}")
        
        # Print first 2 orders details
        for i, order in enumerate(orders[:2]):
            print(f"\nOrder {i+1}:")
            print(f"  ID: {order.get('id')}")
            print(f"  Number: {order.get('order_number')}")
            print(f"  Status: {order.get('status')}")
            print(f"  Total: ${order.get('total_amount')}")
            print(f"  Items: {len(order.get('items', []))}")
    else:
        print(f"Failed to get orders: {orders_response.text}")

# Test with regular user
print("=== TESTING WITH REGULAR USER ===")
test_orders_endpoint(user_credentials)

# Test with admin user
print("\n=== TESTING WITH ADMIN USER ===")
test_orders_endpoint(admin_credentials)