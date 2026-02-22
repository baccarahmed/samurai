import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def login(email, password):
    """Login and get authentication token"""
    login_data = {
        "email": email,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token") or data.get("token")
        print(f"Login successful for {email}")
        return token
    else:
        print(f"Login failed for {email}: {response.status_code}")
        print(response.text)
        return None

def get_orders(token):
    """Get all orders"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Try the orders-all endpoint instead of orders
    response = requests.get(f"{BASE_URL}/orders-all", headers=headers)
    
    if response.status_code == 200:
        orders = response.json()
        if isinstance(orders, list):
            print(f"Successfully retrieved {len(orders)} orders")
            return {"orders": orders}
        else:
            print(f"Successfully retrieved {len(orders.get('orders', []))} orders")
            return orders
    else:
        print(f"Failed to get orders: {response.status_code}")
        print(response.text)
        return None

def update_order_status(token, order_id, new_status, comment="Status updated via API test"):
    """Update the status of an order"""
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "status": new_status,
        "comment": comment
    }
    
    response = requests.put(f"{BASE_URL}/orders/{order_id}/status", headers=headers, json=update_data)
    
    if response.status_code == 200:
        print(f"Successfully updated order {order_id} status to {new_status}")
        return response.json()
    else:
        print(f"Failed to update order {order_id} status: {response.status_code}")
        print(response.text)
        return None

def get_order_details(token, order_id):
    """Get details of a specific order"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Try with the correct error message format
    response = requests.get(f"{BASE_URL}/orders/{order_id}", headers=headers)
    
    if response.status_code == 200:
        order = response.json()
        print(f"Successfully retrieved details for order {order_id}")
        return order.get('order', order)  # Handle both formats
    else:
        print(f"Failed to get order {order_id} details: {response.status_code}")
        print(response.text)
        
        # Check if the error message contains 'introuvable' instead of 'non trouvée'
        if response.status_code == 404 and 'introuvable' in response.text.lower():
            print("The error message indicates the order was not found with 'introuvable'")
        return None

def main():
    # Login as admin
    admin_token = login("admin@samurai-nutrition.com", "admin123")
    if not admin_token:
        print("Admin login failed. Exiting.")
        return
    
    # Get all orders
    orders_data = get_orders(admin_token)
    if not orders_data or "orders" not in orders_data:
        print("Failed to retrieve orders. Exiting.")
        return
    
    # Get the first order
    orders = orders_data.get("orders", [])
    if not orders:
        print("No orders found. Exiting.")
        return
    
    # Select the first order for testing
    test_order = orders[0]
    order_id = test_order.get("id")
    current_status = test_order.get("status")
    
    print(f"\nSelected order {order_id} for testing. Current status: {current_status}")
    
    # Get detailed information about the order before update
    print("\nOrder details before status update:")
    order_before = get_order_details(admin_token, order_id)
    if order_before:
        print(f"Status: {order_before.get('status')}")
        print(f"Status History: {json.dumps(order_before.get('status_history', []), indent=2)}")
    
    # Update the order status to 'processing'
    new_status = "processing"
    print(f"\nUpdating order {order_id} status to '{new_status}'...")
    update_result = update_order_status(admin_token, order_id, new_status)
    
    # Get detailed information about the order after update
    print("\nOrder details after status update:")
    order_after = get_order_details(admin_token, order_id)
    if order_after:
        print(f"Status: {order_after.get('status')}")
        print(f"Status History: {json.dumps(order_after.get('status_history', []), indent=2)}")
    
    # Update the order status back to original status
    print(f"\nResetting order {order_id} status back to '{current_status}'...")
    reset_result = update_order_status(admin_token, order_id, current_status, "Resetting status after test")
    
    # Final verification
    print("\nFinal order details after reset:")
    order_final = get_order_details(admin_token, order_id)
    if order_final:
        print(f"Status: {order_final.get('status')}")
        print(f"Status History: {json.dumps(order_final.get('status_history', []), indent=2)}")

if __name__ == "__main__":
    main()