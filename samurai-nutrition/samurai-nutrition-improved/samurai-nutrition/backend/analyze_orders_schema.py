from src.main_fixed import app
from src.extensions import db
from src.models.order import Order, OrderItem, OrderStatusHistory
from src.models.user import User
from src.models.product import Product
import json
import inspect
from sqlalchemy import inspect as sqlalchemy_inspect

def analyze_orders_schema():
    with app.app_context():
        print("\n===== DATABASE SCHEMA ANALYSIS =====\n")
        
        # Analyze Order model
        print("ORDER MODEL SCHEMA:")
        analyze_model_schema(Order)
        
        # Analyze OrderItem model
        print("\nORDER ITEM MODEL SCHEMA:")
        analyze_model_schema(OrderItem)
        
        # Analyze OrderStatusHistory model
        print("\nORDER STATUS HISTORY MODEL SCHEMA:")
        analyze_model_schema(OrderStatusHistory)
        
        # Analyze relationships
        print("\n===== RELATIONSHIP ANALYSIS =====\n")
        
        # Order relationships
        print("ORDER RELATIONSHIPS:")
        analyze_relationships(Order)
        
        # OrderItem relationships
        print("\nORDER ITEM RELATIONSHIPS:")
        analyze_relationships(OrderItem)
        
        # OrderStatusHistory relationships
        print("\nORDER STATUS HISTORY RELATIONSHIPS:")
        analyze_relationships(OrderStatusHistory)
        
        # Analyze data distribution
        print("\n===== DATA DISTRIBUTION ANALYSIS =====\n")
        
        # Order status distribution
        print("ORDER STATUS DISTRIBUTION:")
        statuses = db.session.query(Order.status, db.func.count(Order.id)).group_by(Order.status).all()
        for status, count in statuses:
            print(f"  - {status}: {count} orders")
        
        # Payment method distribution
        print("\nPAYMENT METHOD DISTRIBUTION:")
        payment_methods = db.session.query(Order.payment_method, db.func.count(Order.id)) \
            .group_by(Order.payment_method).all()
        for method, count in payment_methods:
            print(f"  - {method or 'Not specified'}: {count} orders")
        
        # Shipping method distribution
        print("\nSHIPPING METHOD DISTRIBUTION:")
        shipping_methods = db.session.query(Order.shipping_method, db.func.count(Order.id)) \
            .group_by(Order.shipping_method).all()
        for method, count in shipping_methods:
            print(f"  - {method or 'Not specified'}: {count} orders")
        
        # Order value distribution
        print("\nORDER VALUE DISTRIBUTION:")
        value_ranges = [
            (0, 50, "$0-$50"),
            (50, 100, "$50-$100"),
            (100, 150, "$100-$150"),
            (150, 200, "$150-$200"),
            (200, float('inf'), "$200+")
        ]
        
        for min_val, max_val, label in value_ranges:
            count = Order.query.filter(Order.total_amount >= min_val, Order.total_amount < max_val).count()
            print(f"  - {label}: {count} orders")
        
        # Items per order distribution
        print("\nITEMS PER ORDER DISTRIBUTION:")
        orders = Order.query.all()
        items_per_order = {}
        
        for order in orders:
            item_count = OrderItem.query.filter_by(order_id=order.id).count()
            items_per_order[item_count] = items_per_order.get(item_count, 0) + 1
        
        for item_count, order_count in sorted(items_per_order.items()):
            print(f"  - {item_count} item(s): {order_count} orders")
        
        print("\n===== END OF SCHEMA ANALYSIS =====\n")

def analyze_model_schema(model):
    """Analyze and print the schema of a SQLAlchemy model"""
    inspector = sqlalchemy_inspect(db.engine)
    table_name = model.__tablename__
    
    # Get column information
    columns = inspector.get_columns(table_name)
    print(f"Table: {table_name}")
    print("Columns:")
    for column in columns:
        nullable = "NULL" if column['nullable'] else "NOT NULL"
        default = f"DEFAULT {column['default']}" if column['default'] is not None else ""
        print(f"  - {column['name']}: {column['type']} {nullable} {default}")
    
    # Get primary key information
    pk = inspector.get_pk_constraint(table_name)
    print(f"Primary Key: {', '.join(pk['constrained_columns'])}")
    
    # Get foreign key information
    fks = inspector.get_foreign_keys(table_name)
    if fks:
        print("Foreign Keys:")
        for fk in fks:
            print(f"  - {', '.join(fk['constrained_columns'])} -> {fk['referred_table']}.{', '.join(fk['referred_columns'])}")

def analyze_relationships(model):
    """Analyze and print the relationships of a SQLAlchemy model"""
    for relationship in inspect.getmembers(model, lambda attr: hasattr(attr, 'prop') and hasattr(attr.prop, 'target')):
        rel_name = relationship[0]
        target = relationship[1].prop.target.name
        print(f"  - {rel_name} -> {target}")

if __name__ == "__main__":
    analyze_orders_schema()