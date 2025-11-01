import requests
import json
import sys

# Configuration
BASE_URL = 'http://localhost:5000/api'
ADMIN_CREDENTIALS = {
    'email': 'admin',
    'password': 'admin'
}

# Helper functions
def login(credentials):
    """Login and return the access token"""
    response = requests.post(f'{BASE_URL}/auth/login', json=credentials)
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print(f"Login failed: {response.status_code} - {response.text}")
        return None

def get_order_details(order_id, token):
    """Get details for a specific order"""
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/orders/{order_id}', headers=headers)
    print(f"\nGET /orders/{order_id} Response: {response.status_code}")
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting order details: {response.text}")
        return None

def update_order_status(order_id, new_status, token, comment=""):
    """Update the status of an order"""
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    data = {
        'status': new_status,
        'comment': comment
    }
    
    print(f"\nSending PUT request to {BASE_URL}/orders/{order_id}/status")
    print(f"Headers: {headers}")
    print(f"Data: {json.dumps(data)}")
    
    response = requests.put(f'{BASE_URL}/orders/{order_id}/status', headers=headers, json=data)
    print(f"Response status code: {response.status_code}")
    print(f"Response headers: {response.headers}")
    print(f"Response body: {response.text}")
    
    return response

def get_all_orders(token):
    """Get all orders (admin only)"""
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/orders-all', headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting orders: {response.status_code} - {response.text}")
        return None

def main():
    # Login as admin
    print("Logging in as admin...")
    admin_token = login(ADMIN_CREDENTIALS)
    if not admin_token:
        print("Failed to login as admin. Exiting.")
        sys.exit(1)
    print("Admin login successful!")
    
    # Get all orders
    print("\nGetting all orders...")
    orders = get_all_orders(admin_token)
    if not orders:
        print("Failed to get orders. Exiting.")
        sys.exit(1)
    
    # Find the first order
    if isinstance(orders, list) and len(orders) > 0:
        order_id = orders[0].get('id')
    elif isinstance(orders, dict) and 'orders' in orders and len(orders['orders']) > 0:
        order_id = orders['orders'][0].get('id')
    else:
        print("No orders found. Exiting.")
        sys.exit(1)
    
    print(f"\nSelected order ID: {order_id}")
    
    # Get order details before update
    print("\nGetting order details before update...")
    order_before = get_order_details(order_id, admin_token)
    if order_before:
        current_status = order_before.get('status', 'unknown')
        print(f"Current order status: {current_status}")
    
    # Update order status to 'processing'
    new_status = 'processing' if current_status != 'processing' else 'shipped'
    print(f"\nUpdating order status to '{new_status}'...")
    update_response = update_order_status(order_id, new_status, admin_token, "Status update test")
    
    if update_response.status_code == 200:
        print(f"Status update successful: {update_response.json().get('message')}")
        
        # Get order details after update
        print("\nGetting order details after update...")
        order_after = get_order_details(order_id, admin_token)
        if order_after:
            updated_status = order_after.get('status', 'unknown')
            print(f"Updated order status: {updated_status}")
            
            if updated_status == new_status:
                print("\n✅ Status update confirmed in order details!")
            else:
                print(f"\n❌ Status update failed! Expected: {new_status}, Got: {updated_status}")
    else:
        print(f"\n❌ Status update request failed with status code: {update_response.status_code}")

if __name__ == "__main__":
    main()