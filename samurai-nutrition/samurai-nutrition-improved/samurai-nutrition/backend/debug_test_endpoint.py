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

# API endpoint and authentication
BASE_URL = 'http://localhost:5000/api'
LOGIN_URL = f'{BASE_URL}/auth/login'
TEST_ENDPOINT_URL = f'{BASE_URL}/orders/test'

def test_endpoint():
    # Login to get JWT token
    login_data = {
        'email': 'admin@samurai-nutrition.com',
        'password': 'admin123'
    }
    
    try:
        # Login request
        logging.info(f"Attempting login with {login_data['email']}")
        login_response = requests.post(LOGIN_URL, json=login_data)
        
        # Log login response details
        logging.info(f"Login response status code: {login_response.status_code}")
        logging.info(f"Login response headers: {login_response.headers}")
        logging.info(f"Login response text: {login_response.text}")
        
        login_response.raise_for_status()
        
        # Try to parse JSON response
        try:
            login_json = login_response.json()
            logging.info(f"Login JSON response: {json.dumps(login_json, indent=2)}")
            
            # Extract token - the API returns 'token' not 'access_token'
            token = login_json.get('token')
            if not token:
                logging.error("No token in response")
                return
        except json.JSONDecodeError:
            logging.error("Login response is not valid JSON")
            return
        
        logging.info("Login successful, got access token")
        
        # Set up headers with token
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Test the test endpoint
        logging.info(f"Testing GET request to {TEST_ENDPOINT_URL} with headers: {headers}")
        response = requests.get(TEST_ENDPOINT_URL, headers=headers)
        
        # Log response details
        logging.info(f"Response status code: {response.status_code}")
        logging.info(f"Response headers: {response.headers}")
        logging.info(f"Raw response text: {response.text}")
        
        # Parse JSON if possible
        try:
            response_json = response.json()
            logging.info(f"Response JSON: {json.dumps(response_json, indent=2)}")
            
            # Check for success status
            if response_json.get('status') == 'success':
                logging.info("Test endpoint working correctly!")
            else:
                logging.warning("Test endpoint response doesn't contain success status")
                
        except json.JSONDecodeError:
            logging.error("Response is not valid JSON")
            
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_endpoint()