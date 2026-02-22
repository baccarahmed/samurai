from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

# Import des extensions depuis extensions.py
from src.extensions import db
jwt = JWTManager()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config["SECRET_KEY"] = "your-secret-key-here"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///nutrition.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "your-secret-key-here"  # Même clé que SECRET_KEY
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    
    # Initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configuration CORS
    CORS(app,
          origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
          allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
          methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          supports_credentials=True,
          expose_headers=["Content-Type", "Authorization"])
    
    # Import des modèles (après l'initialisation de db)
    from src.models.user import User
    from src.models.product import Product
    from src.models.order import Order, OrderItem, OrderStatusHistory
    from src.models.admin_log import AdminLog
    from src.models.wishlist_cart import Wishlist, WishlistItem, Cart, CartItem
    from src.models.user_history import UserHistory
    from src.models.bundle import Bundle
    
    # Import des routes
    from src.routes.auth import auth_bp
    from src.routes.orders import orders_bp
    from src.routes.admin import admin_bp
    from src.routes.products import products_bp
    from src.routes.wishlist_cart import wishlist_cart_bp
    from src.routes.user_history import user_history_bp
    from src.routes.bundles import bundles_bp
    
    # Enregistrement des blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(wishlist_cart_bp, url_prefix='/api')
    app.register_blueprint(user_history_bp, url_prefix='/api')
    app.register_blueprint(bundles_bp, url_prefix='/api')
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Point de contrôle de santé de l'API"""
        return jsonify({
            'status': 'healthy',
            'message': 'Samurai Nutrition API is running',
            'version': '2.0.0'
        })
    
    @app.route('/api/auth/register', methods=['OPTIONS'])
    def handle_register_options():
        """Gérer les requêtes OPTIONS pour /api/auth/register"""
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200
    
    @app.route('/api/auth/login', methods=['OPTIONS'])
    def handle_login_options():
        """Gérer les requêtes OPTIONS pour /api/auth/login"""
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200
    
    @app.route('/api/auth/verify-token', methods=['OPTIONS'])
    def handle_verify_token_options():
        """Gérer les requêtes OPTIONS pour /api/auth/verify-token"""
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200
    
    # Gestionnaire global pour les requêtes préflight OPTIONS
    @app.before_request
    def handle_preflight():
        """Gérer les requêtes preflight CORS"""
        if request.method == "OPTIONS":
            response = jsonify()
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
            response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
            response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
            response.headers.add('Access-Control-Allow-Credentials', "true")
            return response
    
    @app.after_request
    def after_request(response):
        """Ajouter les en-têtes CORS à toutes les réponses"""
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint non trouvé'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Erreur interne du serveur'}), 500
    
    return app

# Créer l'application
app = create_app()
