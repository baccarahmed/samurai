from src.extensions import db
from datetime import datetime

class UserHistory(db.Model):
    __tablename__ = 'user_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action_type = db.Column(db.String(50), nullable=False)  # 'login', 'logout', 'purchase', 'view_product', etc.
    action_description = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relations
    user = db.relationship('User', backref='history')
    product = db.relationship('Product', backref='user_history')
    order = db.relationship('Order', backref='user_history')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action_type': self.action_type,
            'action_description': self.action_description,
            'product_id': self.product_id,
            'order_id': self.order_id,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    @classmethod
    def log_action(cls, user_id, action_type, action_description, product_id=None, order_id=None, ip_address=None, user_agent=None):
        """Méthode utilitaire pour enregistrer une action dans l'historique"""
        history_entry = cls(
            user_id=user_id,
            action_type=action_type,
            action_description=action_description,
            product_id=product_id,
            order_id=order_id,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.session.add(history_entry)
        db.session.commit()
        return history_entry 