import requests
import logging
import json
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# API endpoints
BASE_URL = 'http://localhost:5000/api'
LOGIN_URL = f'{BASE_URL}/auth/login'
ORDERS_URL = f'{BASE_URL}/orders'

# Admin credentials
login_data = {
    'email': 'admin@samurai-nutrition.com',
    'password': 'admin123'
}

def main():
    try:
        # Login request
        logging.info(f"Attempting login with {login_data['email']}")
        login_response = requests.post(LOGIN_URL, json=login_data)
        
        # Log login response details
        logging.info(f"Login response status code: {login_response.status_code}")
        
        login_response.raise_for_status()
        
        # Try to parse JSON response
        try:
            login_json = login_response.json()
            
            # Extract token - the API returns 'token' not 'access_token'
            token = login_json.get('token')
            if not token:
                logging.error("No token in response")
                return
                
            # Set up headers for authenticated requests
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            # Test GET request to orders endpoint
            logging.info(f"Testing GET request to {ORDERS_URL} with headers: {headers}")
            response = requests.get(ORDERS_URL, headers=headers)
            
            # Log response details
            logging.info(f"Response status code: {response.status_code}")
            logging.info(f"Response headers: {response.headers}")
            logging.info(f"Raw response text: {response.text}")
            
            if response.status_code == 200:
                response_json = response.json()
                logging.info(f"Response JSON: {json.dumps(response_json, indent=2)}")
                logging.info("Orders endpoint working correctly!")
            else:
                logging.error(f"Orders endpoint returned status code {response.status_code}")
                
        except json.JSONDecodeError:
            logging.error("Login response is not valid JSON")
            return
            
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error: {e}")
        return

if __name__ == "__main__":
    main()