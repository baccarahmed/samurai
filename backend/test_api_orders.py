import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def test_orders_api():
    # URL of the API endpoint
    url = 'http://localhost:5000/api/orders'
    
    # Get token from local storage (simulating browser behavior)
    # For testing, we'll use a hardcoded token or get one via login
    try:
        # Try to login first to get a fresh token
        login_url = 'http://localhost:5000/api/auth/login'
        login_data = {
            'email': 'admin@samurai-nutrition.com',
            'password': 'admin123'
        }
        
        login_response = requests.post(login_url, json=login_data)
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            logging.info(f"Successfully logged in and got token: {token[:10]}...")
        else:
            logging.error(f"Login failed with status code: {login_response.status_code}")
            logging.error(f"Response: {login_response.text}")
            return
        
        # Set up headers with the token
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Make the request to the orders endpoint
        logging.info(f"Sending GET request to {url} with headers: {headers}")
        response = requests.get(url, headers=headers)
        
        # Log the response status and headers
        logging.info(f"Response status code: {response.status_code}")
        logging.info(f"Response headers: {response.headers}")
        
        # Try to parse the response as JSON
        try:
            data = response.json()
            logging.info(f"Response JSON: {json.dumps(data, indent=2)}")
            
            # Check if we got orders
            if 'orders' in data:
                logging.info(f"Number of orders: {len(data['orders'])}")
                
                # Log details of each order
                for i, order in enumerate(data['orders']):
                    logging.info(f"Order {i+1}: {order}")
            else:
                logging.info("No 'orders' key in response")
                
        except json.JSONDecodeError:
            logging.error(f"Failed to parse response as JSON: {response.text}")
    
    except Exception as e:
        logging.error(f"Error during API test: {str(e)}")

if __name__ == "__main__":
    test_orders_api()