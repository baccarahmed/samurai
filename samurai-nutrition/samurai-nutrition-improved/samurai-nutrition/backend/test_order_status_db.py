from src.main_fixed import app
from src.extensions import db
from src.models.order import Order, OrderStatusHistory
import sys

def update_order_status_in_db(order_id, new_status, comment="Status updated via direct DB access"):
    """Update an order's status directly in the database"""
    with app.app_context():
        # Find the order
        order = Order.query.get(order_id)
        if not order:
            print(f"Order with ID {order_id} not found")
            return False
        
        print(f"Found order {order_id}: {order.order_number}")
        print(f"Current status: {order.status}")
        
        # Get current status history
        print("\nCurrent status history:")
        for history in OrderStatusHistory.query.filter_by(order_id=order_id).order_by(OrderStatusHistory.created_at).all():
            print(f"  - {history.status} on {history.created_at} by {history.created_by or 'System'}: {history.comment or 'No comment'}")
        
        # Update the status
        old_status = order.status
        order.status = new_status
        
        # Add status history entry
        status_history = OrderStatusHistory(
            order_id=order_id,
            status=new_status,
            comment=comment,
            created_by=1  # Admin user ID
        )
        
        db.session.add(status_history)
        
        try:
            db.session.commit()
            print(f"\nSuccessfully updated order {order_id} status from '{old_status}' to '{new_status}'")
            
            # Verify the update
            updated_order = Order.query.get(order_id)
            print(f"Verified new status: {updated_order.status}")
            
            # Show updated status history
            print("\nUpdated status history:")
            for history in OrderStatusHistory.query.filter_by(order_id=order_id).order_by(OrderStatusHistory.created_at).all():
                print(f"  - {history.status} on {history.created_at} by {history.created_by or 'System'}: {history.comment or 'No comment'}")
            
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error updating order status: {str(e)}")
            return False

def reset_order_status(order_id, original_status="pending"):
    """Reset an order's status to its original value"""
    with app.app_context():
        # Find the order
        order = Order.query.get(order_id)
        if not order:
            print(f"Order with ID {order_id} not found")
            return False
        
        # Update the status
        order.status = original_status
        
        # Add status history entry
        status_history = OrderStatusHistory(
            order_id=order_id,
            status=original_status,
            comment="Reset to original status after testing",
            created_by=1  # Admin user ID
        )
        
        db.session.add(status_history)
        
        try:
            db.session.commit()
            print(f"\nReset order {order_id} status to '{original_status}'")
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error resetting order status: {str(e)}")
            return False

def main():
    # Check if order ID was provided as command line argument
    if len(sys.argv) > 1:
        try:
            order_id = int(sys.argv[1])
        except ValueError:
            print("Please provide a valid order ID as an integer")
            return
    else:
        # Default to order ID 17 if none provided
        order_id = 17
    
    # Update the order status to 'processing'
    print(f"Updating order {order_id} status to 'processing'...\n")
    success = update_order_status_in_db(order_id, "processing")
    
    if success:
        # Reset the order status to 'pending'
        print(f"\nResetting order {order_id} status to 'pending'...")
        reset_order_status(order_id)

if __name__ == "__main__":
    main()