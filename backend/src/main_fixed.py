from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from datetime import timedelta
import os

# Initialisation de l'application Flask
app = Flask(__name__)

# Configuration
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "default-dev-key-do-not-use-in-production")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", app.config["SECRET_KEY"])
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///nutrition.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "jwt-secret-string"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

# Initialisation des extensions
from src.extensions import db
db.init_app(app)
# Add these lines after initializing the JWT manager (around line 20)
jwt = JWTManager(app)

# JWT error handlers
@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        'status': 'error',
        'message': 'Missing Authorization Header',
        'code': 'authorization_header_missing'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'status': 'error',
        'message': 'Invalid token',
        'code': 'invalid_token'
    }), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'status': 'error',
        'message': 'Token has expired',
        'code': 'token_expired'
    }), 401

# Configuration CORS pour le développement
CORS(app, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173", 
              "http://localhost:5174", "http://127.0.0.1:5174"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)

# Import des modèles (après l'initialisation de db)
# Change these lines
from src.models.user import User
from src.models.product import Product
from src.models.order import Order, OrderItem, OrderStatusHistory, AdminLog
from src.models.bundle import Bundle

# Import des routes
from src.routes.auth import auth_bp
from src.routes.orders import orders_bp
from src.routes.admin import admin_bp
# Import des routes manquantes
from src.routes.user import user_bp
from src.routes.wishlist_cart import wishlist_cart_bp
from src.routes.user_history import user_history_bp
from src.routes.products import products_bp  # Add this line
from src.routes.bundles import bundles_bp

# Enregistrement des blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(wishlist_cart_bp, url_prefix='/api')
app.register_blueprint(user_history_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(orders_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(products_bp, url_prefix='/api')  # Add this line
app.register_blueprint(bundles_bp, url_prefix='/api')

@app.route('/api/products', methods=['GET'])
def get_products():
    """Récupérer tous les produits actifs"""
    try:
        products = Product.query.filter_by(is_active=True).all()
        return jsonify([product.to_dict() for product in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Récupérer un produit spécifique"""
    try:
        product = Product.query.get_or_404(product_id)
        if not product.is_active:
            return jsonify({'error': 'Produit non disponible'}), 404
        return jsonify(product.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_direct(order_id):
    """Récupérer les détails d'une commande spécifique (endpoint direct)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Récupérer la commande
        order = Order.query.get(order_id)
        if not order:
            return jsonify({"message": "Commande non trouvée"}), 404
            
        # Vérifier les permissions
        if order.user_id != current_user_id and not user.has_permission('view_all_orders'):
            return jsonify({"message": "Permission insuffisante"}), 403
            
        # Récupérer les détails complets
        order_data = order.to_dict()
        
        # Ajouter les articles de la commande
        order_data['items'] = [item.to_dict() for item in order.order_items]
        
        # Ajouter l'historique des statuts
        order_data['status_history'] = [history.to_dict() for history in order.status_history]
        
        return jsonify({
            'order': order_data
        }), 200
        
    except Exception as e:
        print(f"Error in get_order_direct: {str(e)}")
        return jsonify({"error": f"Erreur lors de la récupération des détails de la commande: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Point de contrôle de santé de l'API"""
    return jsonify({
        'status': 'healthy',
        'message': 'Samurai Nutrition API is running',
        'version': '2.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint non trouvé'}), 404

@app.errorhandler(500)
def internal_error(error):
    import traceback
    error_details = {
        'error': 'Erreur interne du serveur',
        'details': str(error),
        'traceback': traceback.format_exc() if app.debug else None
    }
    print(f"500 Error: {error}")
    print(f"Traceback: {traceback.format_exc()}")
    return jsonify(error_details), 500

def create_sample_data():
    """Créer des données d'exemple pour le développement"""
    try:
        # Vérifier si des données existent déjà
        if User.query.count() > 0:
            return
        
        print("Création des données d'exemple...")
        
        # Créer un utilisateur admin
        admin = User(
            first_name="Admin",
            last_name="Samurai",
            email="admin@samurai-nutrition.com",
            role="admin",
            is_active=True
        )
        admin.set_password("admin123")
        db.session.add(admin)
        
        # Créer un utilisateur client
        client = User(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            role="customer",
            is_active=True
        )
        client.set_password("password123")
        db.session.add(client)
        
        # Créer des produits d'exemple
        products_data = [
            {
                'name': 'Whey Protein Isolate',
                'description': 'Protéine de lactosérum isolée de haute qualité',
                'price': 49.99,
                'original_price': 59.99,
                'category': 'Protéines',
                'stock_quantity': 100,
                'sku': 'WPI001',
                'weight': 2.0,
                'featured': True,
                'image_url': '/images/whey-protein.jpg'
            },
            {
                'name': 'Créatine Monohydrate',
                'description': 'Créatine pure pour améliorer les performances',
                'price': 24.99,
                'category': 'Performance',
                'stock_quantity': 150,
                'sku': 'CM001',
                'weight': 1.0,
                'featured': True,
                'image_url': '/images/creatine.jpg'
            },
            {
                'name': 'BCAA Complex',
                'description': 'Acides aminés à chaîne ramifiée pour la récupération',
                'price': 34.99,
                'category': 'Récupération',
                'stock_quantity': 75,
                'sku': 'BCAA001',
                'weight': 0.5,
                'featured': False,
                'image_url': '/images/bcaa.jpg'
            }
        ]
        
        for product_data in products_data:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print("Données d'exemple créées avec succès!")
        
    except Exception as e:
        print(f"Erreur lors de la création des données d'exemple: {e}")
        db.session.rollback()

if __name__ == '__main__':
    with app.app_context():
        # Créer toutes les tables
        db.create_all()
        
        # Créer les données d'exemple
        create_sample_data()
        
        print("✅ Base de données initialisée avec succès!")
        print("🌐 Serveur démarré sur http://localhost:5000")
        print("📊 Health check: http://localhost:5000/api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5000)

