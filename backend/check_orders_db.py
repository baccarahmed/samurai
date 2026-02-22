from src.main_fixed import app
from src.extensions import db
from src.models.order import Order, OrderItem, OrderStatusHistory
from src.models.user import User
from src.models.product import Product
import json

def check_orders_database():
    with app.app_context():
        print("\n===== ORDERS DATABASE INFORMATION =====")
        
        # Count total orders
        total_orders = Order.query.count()
        print(f"\nTotal Orders: {total_orders}")
        
        # Orders by status
        print("\nOrders by Status:")
        statuses = db.session.query(Order.status, db.func.count(Order.id)).group_by(Order.status).all()
        for status, count in statuses:
            print(f"  - {status}: {count}")
        
        # Orders by user
        print("\nOrders by User:")
        user_orders = db.session.query(Order.user_id, User.email, db.func.count(Order.id)) \
            .join(User, User.id == Order.user_id) \
            .group_by(Order.user_id, User.email).all()
        for user_id, email, count in user_orders:
            print(f"  - User {user_id} ({email}): {count} orders")
        
        # Total revenue
        total_revenue = db.session.query(db.func.sum(Order.total_amount)).scalar() or 0
        print(f"\nTotal Revenue: ${total_revenue:.2f}")
        
        # Most ordered products
        print("\nMost Ordered Products:")
        popular_products = db.session.query(
            OrderItem.product_id,
            OrderItem.product_name,
            db.func.sum(OrderItem.quantity).label('total_quantity'),
            db.func.count(OrderItem.order_id).label('order_count')
        ).group_by(OrderItem.product_id, OrderItem.product_name) \
         .order_by(db.func.sum(OrderItem.quantity).desc()).limit(5).all()
        
        for product_id, name, quantity, order_count in popular_products:
            print(f"  - {name} (ID: {product_id}): {quantity} units in {order_count} orders")
        
        # Recent orders
        print("\nRecent Orders:")
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
        for order in recent_orders:
            print(f"  - Order {order.id} ({order.order_number}): ${order.total_amount:.2f} - Status: {order.status} - Date: {order.created_at}")
            
        # Order items statistics
        total_items = OrderItem.query.count()
        avg_items_per_order = db.session.query(db.func.avg(db.session.query(db.func.count(OrderItem.id)) \
            .filter(OrderItem.order_id == Order.id) \
            .correlate(Order) \
            .scalar_subquery())).scalar() or 0
        
        print(f"\nTotal Order Items: {total_items}")
        print(f"Average Items per Order: {avg_items_per_order:.2f}")
        
        # Status history statistics
        total_status_changes = OrderStatusHistory.query.count() - total_orders  # Subtract initial statuses
        print(f"\nTotal Status Changes: {total_status_changes}")
        
        # Detailed order information
        print("\n===== DETAILED ORDER INFORMATION =====")
        
        # Get the most recent order
        latest_order = Order.query.order_by(Order.created_at.desc()).first()
        if latest_order:
            print(f"\nMost Recent Order (ID: {latest_order.id}):\n")
            print_detailed_order(latest_order)
        
        # Get the order with the most items
        order_with_most_items = db.session.query(Order) \
            .join(OrderItem, OrderItem.order_id == Order.id) \
            .group_by(Order.id) \
            .order_by(db.func.count(OrderItem.id).desc()) \
            .first()
        
        if order_with_most_items and order_with_most_items.id != latest_order.id:
            print(f"\nOrder with Most Items (ID: {order_with_most_items.id}):\n")
            print_detailed_order(order_with_most_items)
        
        # Get the order with the highest total amount
        highest_value_order = Order.query.order_by(Order.total_amount.desc()).first()
        if highest_value_order and highest_value_order.id != latest_order.id and highest_value_order.id != order_with_most_items.id:
            print(f"\nHighest Value Order (ID: {highest_value_order.id}):\n")
            print_detailed_order(highest_value_order)
        
        print("\n===== END OF DATABASE REPORT =====")

def print_detailed_order(order):
    """Print detailed information about an order"""
    # Basic order information
    print(f"Order Number: {order.order_number}")
    print(f"Date: {order.created_at}")
    print(f"Status: {order.status}")
    print(f"Total Amount: ${order.total_amount:.2f}")
    
    # User information
    user = User.query.get(order.user_id)
    print(f"Customer: {user.email} (ID: {user.id})")
    
    # Shipping and payment details
    if order.shipping_address:
        try:
            shipping_address = json.loads(order.shipping_address)
            print("\nShipping Address:")
            for key, value in shipping_address.items():
                print(f"  {key}: {value}")
        except:
            print(f"Shipping Address: {order.shipping_address}")
    
    print(f"Shipping Method: {order.shipping_method or 'Not specified'}")
    print(f"Shipping Cost: ${order.shipping_cost or 0:.2f}")
    print(f"Payment Method: {order.payment_method or 'Not specified'}")
    print(f"Payment Status: {order.payment_status or 'Not specified'}")
    
    # Tax and discounts
    print(f"Tax Amount: ${order.tax_amount or 0:.2f}")
    print(f"Discount Amount: ${order.discount_amount or 0:.2f}")
    
    # Order items
    items = OrderItem.query.filter_by(order_id=order.id).all()
    print(f"\nOrder Items ({len(items)}):")
    for item in items:
        print(f"  - {item.quantity}x {item.product_name} (ID: {item.product_id})")
        print(f"    Unit Price: ${item.unit_price:.2f}, Total: ${item.total_price:.2f}")
        
        # Get current product information
        product = Product.query.get(item.product_id)
        if product:
            print(f"    Current Stock: {product.stock_quantity}")
    
    # Status history
    history = OrderStatusHistory.query.filter_by(order_id=order.id).order_by(OrderStatusHistory.created_at).all()
    print(f"\nStatus History ({len(history)}):")
    for entry in history:
        created_by = "System"
        if entry.created_by:
            user = User.query.get(entry.created_by)
            created_by = user.email if user else f"User ID: {entry.created_by}"
            
        print(f"  - {entry.status} on {entry.created_at} by {created_by}")
        if entry.comment:
            print(f"    Comment: {entry.comment}")
    
    # Notes
    if order.notes:
        print(f"\nNotes: {order.notes}")


if __name__ == "__main__":
    check_orders_database()