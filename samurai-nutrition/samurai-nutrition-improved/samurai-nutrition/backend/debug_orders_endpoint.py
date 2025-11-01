import requests
import json
import logging
import sys
import os
import sys

# Add the backend directory to the path so we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

BASE_URL = "http://localhost:5000/api"

def login():
    """Login to get authentication token"""
    login_data = {
        "email": "admin@samurai-nutrition.com",
        "password": "admin123"
    }
    
    try:
        logging.info(f"Sending login request to {BASE_URL}/auth/login with data: {login_data}")
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        logging.info(f"Login response status code: {response.status_code}")
        logging.info(f"Login response headers: {dict(response.headers)}")
        
        try:
            response_json = response.json()
            logging.info(f"Login response JSON: {json.dumps(response_json, indent=2)}")
            token = response_json.get("token")
            if token:
                logging.info(f"Successfully logged in and got token: {token[:10]}...")
            else:
                logging.warning("Login successful but no token received in response")
            return token
        except json.JSONDecodeError:
            logging.error(f"Login response is not valid JSON: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        logging.error(f"Login failed: {str(e)}")
        if hasattr(e, 'response') and e.response:
            logging.error(f"Response status: {e.response.status_code}")
            logging.error(f"Response body: {e.response.text}")
        return None

def test_orders_endpoint(token):
    """Test the /api/orders endpoint with detailed debugging"""
    if not token:
        logging.error("No token available, cannot test orders endpoint")
        return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Add query parameters
    params = {
        "page": 1,
        "per_page": 10
    }
    
    logging.info(f"Testing GET request to {BASE_URL}/orders with headers: {headers} and params: {params}")
    
    try:
        # Make the request with debug mode and query parameters
        response = requests.get(f"{BASE_URL}/orders", headers=headers, params=params)
        
        # Log detailed response information
        logging.info(f"Response status code: {response.status_code}")
        logging.info(f"Response headers: {dict(response.headers)}")
        
        # Always log the raw response text first
        logging.info(f"Raw response text: {response.text}")
        
        try:
            response_json = response.json()
            logging.info(f"Response JSON: {json.dumps(response_json, indent=2)}")
            
            # Check for error details in the response
            if "error_details" in response_json:
                logging.error(f"Error details: {response_json['error_details']}")
            if "error_type" in response_json:
                logging.error(f"Error type: {response_json['error_type']}")
            if "traceback" in response_json:
                logging.error(f"Traceback: {response_json['traceback']}")
            if "debug_info" in response_json:
                logging.error(f"Debug info: {json.dumps(response_json['debug_info'], indent=2)}")
            
            # Check if we got orders
            if 'orders' in response_json:
                logging.info(f"Number of orders: {len(response_json['orders'])}")
            else:
                logging.info("No 'orders' key in response")
                
        except json.JSONDecodeError:
            logging.error(f"Response is not valid JSON: {response.text}")
    
    except requests.exceptions.RequestException as e:
        logging.error(f"Request failed: {str(e)}")
        if hasattr(e, 'response') and e.response:
            logging.error(f"Response status: {e.response.status_code}")
            logging.error(f"Response body: {e.response.text}")

def main():
    """Main function to run the tests"""
    token = login()
    if token:
        test_orders_endpoint(token)
    else:
        logging.error("Failed to obtain authentication token")

if __name__ == "__main__":
    main()