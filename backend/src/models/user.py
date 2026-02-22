from src.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # Changé de password à password_hash
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' ou 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def check_password(self, password):
        """Vérifie le mot de passe"""
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)
    
    def set_password(self, password):
        """Définit le mot de passe"""
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)
        
    def has_permission(self, permission):
        """Vérifie si l'utilisateur a une permission spécifique
        
        Les permissions sont basées sur le rôle de l'utilisateur:
        - 'admin': Toutes les permissions
        - 'user': Permissions limitées
        
        Permissions disponibles:
        - 'view_all_orders': Voir toutes les commandes (admin)
        - 'update_order_status': Mettre à jour le statut des commandes (admin)
        - 'manage_products': Gérer les produits (admin)
        - 'manage_users': Gérer les utilisateurs (admin)
        - 'view_own_orders': Voir ses propres commandes (user, admin)
        """
        # Permissions par défaut pour tous les utilisateurs
        default_permissions = ['view_own_orders']
        
        # Permissions spécifiques aux administrateurs
        admin_permissions = [
            'view_all_orders',
            'update_order_status',
            'manage_products',
            'manage_users',
            'view_dashboard',
            'view_admin_logs'
        ]
        
        if permission in default_permissions:
            return True
            
        if self.role == 'admin' and permission in admin_permissions:
            return True
            
        return False
    
    def is_admin(self):
        """Vérifie si l'utilisateur est un administrateur"""
        return self.role == 'admin'
        
    def generate_token(self, secret_key):
        """Génère un token JWT pour l'utilisateur"""
        import jwt
        import datetime
        
        payload = {
            'user_id': self.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        
        return jwt.encode(payload, secret_key, algorithm='HS256')
    
    @staticmethod
    def verify_token(token, secret_key):
        """Vérifie un token JWT"""
        import jwt
        
        try:
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None  # Token expiré
        except jwt.InvalidTokenError:
            return None  # Token invalide

