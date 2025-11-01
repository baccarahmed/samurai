from flask import Blueprint, request, jsonify
from src.models.product import Product
from src.extensions import db

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """Récupérer tous les produits"""
    try:
        products = Product.query.filter_by(is_active=True).all()
        return jsonify([product.to_dict() for product in products]), 200
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des produits: {str(e)}'}), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Récupérer un produit spécifique"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Produit non trouvé'}), 404
        
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération du produit: {str(e)}'}), 500

@products_bp.route('/products/categories', methods=['GET'])
def get_categories():
    """Récupérer toutes les catégories de produits"""
    try:
        # Récupérer toutes les catégories uniques depuis la base de données
        categories = db.session.query(Product.category).distinct().all()
        category_list = [category[0] for category in categories if category[0]]
        
        return jsonify(category_list), 200
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des catégories: {str(e)}'}), 500

@products_bp.route('/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    """Récupérer les produits par catégorie"""
    try:
        products = Product.query.filter_by(category=category, is_active=True).all()
        return jsonify([product.to_dict() for product in products]), 200
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des produits: {str(e)}'}), 500

