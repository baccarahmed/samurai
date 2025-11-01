import os
import sys
import logging
from flask import Flask, request
from werkzeug.datastructures import ImmutableMultiDict
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Add the backend directory to the path so we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the necessary modules from the application
from src.models.user import User
from src.models.order import Order
from src.routes.orders import get_orders
from src.extensions import db
from src.main_fixed import app as flask_app

def test_orders_direct():
    """Test the get_orders function directly"""
    # Use the imported Flask application
    app = flask_app
    
    with app.app_context():
        # Check if the database is initialized and has orders
        order_count = Order.query.count()
        logging.info(f"Database has {order_count} orders")
        
        if order_count == 0:
            logging.warning("No orders found in database. Test may not be meaningful.")
        
        # Create a test request context
        with app.test_request_context():
            # Mock the JWT identity
            from flask_jwt_extended import get_jwt_identity, create_access_token
            import flask_jwt_extended
            
            # Get an admin user
            admin = User.query.filter_by(email="admin@samurai-nutrition.com").first()
            if not admin:
                logging.error("Admin user not found")
                return
            
            logging.info(f"Using admin user: {admin.email} (ID: {admin.id})")
            
            # Create an access token for the admin
            access_token = create_access_token(identity=admin.id)
            
            # Mock the get_jwt_identity function to return the admin ID
            flask_jwt_extended.get_jwt_identity = lambda: admin.id
            
            # Add Authorization header to request
            request.headers = {'Authorization': f'Bearer {access_token}'}
            
            # Set up request.args with pagination parameters
            request.args = ImmutableMultiDict([("page", "1"), ("per_page", "10")])
            
            try:
                # Call the get_orders function directly
                logging.info("Calling get_orders function directly")
                response = get_orders()
                
                # Parse the response
                status_code = response[1] if isinstance(response, tuple) else 200
                response_data = json.loads(response[0].data) if isinstance(response, tuple) else json.loads(response.data)
                
                logging.info(f"Response status code: {status_code}")
                logging.info(f"Response data: {json.dumps(response_data, indent=2)}")
                
                # Check if we got orders
                if 'orders' in response_data:
                    logging.info(f"Number of orders: {len(response_data['orders'])}")
                else:
                    logging.info("No 'orders' key in response")
                    
                    # Check for error details
                    if "error_details" in response_data:
                        logging.error(f"Error details: {response_data['error_details']}")
                    if "error_type" in response_data:
                        logging.error(f"Error type: {response_data['error_type']}")
                    if "traceback" in response_data:
                        logging.error(f"Traceback: {response_data['traceback']}")
                    if "debug_info" in response_data:
                        logging.error(f"Debug info: {json.dumps(response_data['debug_info'], indent=2)}")
                
            except Exception as e:
                logging.error(f"Error calling get_orders: {str(e)}")
                import traceback
                traceback.print_exc()
                
                # Try to query orders directly from the database as a fallback
                try:
                    orders = Order.query.limit(5).all()
                    logging.info(f"Direct database query found {len(orders)} orders")
                    for order in orders:
                        logging.info(f"Order ID: {order.id}, Number: {order.order_number}, Status: {order.status}")
                except Exception as db_error:
                    logging.error(f"Error querying database directly: {str(db_error)}")

if __name__ == "__main__":
    test_orders_direct()