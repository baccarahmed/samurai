from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.extensions import db
import decimal

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    total_amount = db.Column(db.DECIMAL(10, 2), nullable=False)
    status = db.Column(db.String(50), default='pending')
    shipping_address = db.Column(db.Text, nullable=False)
    billing_address = db.Column(db.Text, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    shipping_method = db.Column(db.String(50), nullable=True)
    shipping_cost = db.Column(db.DECIMAL(10, 2), default=0.0)
    tax_amount = db.Column(db.DECIMAL(10, 2), default=0.0)
    discount_amount = db.Column(db.DECIMAL(10, 2), default=0.0)
    payment_status = db.Column(db.String(50), default='pending')
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', viewonly=True)
    order_items = db.relationship('OrderItem', cascade='all, delete-orphan')
    status_history = db.relationship('OrderStatusHistory', cascade='all, delete-orphan')
    
    @staticmethod
    def generate_order_number():
        """Génère un numéro de commande unique basé sur la date et un nombre aléatoire"""
        import random
        import time
        timestamp = int(time.time())
        random_num = random.randint(1000, 9999)
        return f"ORD-{timestamp}-{random_num}"

    def to_dict(self):
        # Convertir les types Decimal en float pour la sérialisation JSON
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'order_number': self.order_number,
            'total_amount': float(self.total_amount) if isinstance(self.total_amount, decimal.Decimal) else self.total_amount,
            'status': self.status,
            'shipping_address': self.shipping_address,
            'billing_address': self.billing_address,
            'payment_method': self.payment_method,
            'shipping_method': self.shipping_method,
            'shipping_cost': float(self.shipping_cost) if isinstance(self.shipping_cost, decimal.Decimal) else self.shipping_cost,
            'tax_amount': float(self.tax_amount) if isinstance(self.tax_amount, decimal.Decimal) else self.tax_amount,
            'discount_amount': float(self.discount_amount) if isinstance(self.discount_amount, decimal.Decimal) else self.discount_amount,
            'payment_status': self.payment_status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.order_items],  # Renommer order_items en items
            'status_history': [status.to_dict() for status in self.status_history]
        }
        return result

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)  # Nouveau champ
    product_sku = db.Column(db.String(50), nullable=False)    # Nouveau champ
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.DECIMAL(10, 2), nullable=False)
    total_price = db.Column(db.DECIMAL(10, 2), nullable=False)

    order = db.relationship('Order', viewonly=True)
    product = db.relationship('Product', viewonly=True)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,  # Ajoutez ces champs à to_dict()
            'product_sku': self.product_sku,    # Ajoutez ces champs à to_dict()
            'quantity': self.quantity,
            'unit_price': float(self.unit_price) if self.unit_price else 0.0,
            'total_price': float(self.total_price) if self.total_price else 0.0,
        }

class OrderStatusHistory(db.Model):
    __tablename__ = 'order_status_history'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    comment = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Nouveau champ
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    order = db.relationship('Order', viewonly=True)
    user = db.relationship('User', foreign_keys=[created_by], viewonly=True)  # Nouvelle relation

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'status': self.status,
            'comment': self.comment,
            'created_by': self.created_by,  # Ajoutez ce champ à to_dict()
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AdminLog(db.Model):
    __tablename__ = 'admin_logs'
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text)
    ip_address = db.Column(db.String(45))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    admin = db.relationship('User', viewonly=True)

    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'action': self.action,
            'details': self.details,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @classmethod
    def log_action(cls, admin_id, action, target_type=None, target_id=None, details=None, request=None):
        """Méthode utilitaire pour enregistrer une action d'administration"""
        # Create log entry
        log_entry = cls(
            admin_id=admin_id,
            action=action,
            details=details,
            ip_address=request.remote_addr if request else None
        )
        
        # Add to session and commit
        db.session.add(log_entry)
        
        # Note: We don't commit here because this is typically called within a transaction
        # The calling function should handle the commit or rollback
        
        return log_entry


def decimal_to_float(value):
    """Convert decimal.Decimal to float safely"""
    if isinstance(value, decimal.Decimal):
        return float(value)
    return value

