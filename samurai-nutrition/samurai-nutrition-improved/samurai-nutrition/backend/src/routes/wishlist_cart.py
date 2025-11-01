from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.product import Product
from src.models.wishlist_cart import Wishlist, WishlistItem, Cart, CartItem
from src.models.user_history import UserHistory
from src.routes.auth import token_required

wishlist_cart_bp = Blueprint("wishlist_cart_bp", __name__)

@wishlist_cart_bp.route("/wishlist", methods=["GET"])
@token_required
def get_wishlist(current_user):
    wishlist = Wishlist.query.filter_by(user_id=current_user.id).first()
    if not wishlist:
        return jsonify({"message": "Wishlist not found"}), 404
    return jsonify(wishlist.to_dict()), 200

@wishlist_cart_bp.route("/wishlist/add/<int:product_id>", methods=["POST"])
@token_required
def add_to_wishlist(current_user, product_id):
    wishlist = Wishlist.query.filter_by(user_id=current_user.id).first()
    if not wishlist:
        wishlist = Wishlist(user_id=current_user.id)
        db.session.add(wishlist)
        db.session.commit()

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    existing_item = WishlistItem.query.filter_by(wishlist_id=wishlist.id, product_id=product_id).first()
    if existing_item:
        return jsonify({"message": "Product already in wishlist"}), 409

    wishlist_item = WishlistItem(wishlist_id=wishlist.id, product_id=product_id)
    db.session.add(wishlist_item)
    db.session.commit()
    
    # Enregistrer l'action dans l'historique
    UserHistory.log_action(
        user_id=current_user.id,
        action_type='add_to_wishlist',
        action_description=f'Ajouté {product.name} à la wishlist',
        product_id=product_id,
        ip_address=request.remote_addr,
        user_agent=request.headers.get('User-Agent')
    )
    
    return jsonify({"message": "Product added to wishlist", "wishlist_item": wishlist_item.to_dict()}), 201

@wishlist_cart_bp.route("/wishlist/remove/<int:product_id>", methods=["DELETE"])
@token_required
def remove_from_wishlist(current_user, product_id):
    wishlist = Wishlist.query.filter_by(user_id=current_user.id).first()
    if not wishlist:
        return jsonify({"message": "Wishlist not found"}), 404

    wishlist_item = WishlistItem.query.filter_by(wishlist_id=wishlist.id, product_id=product_id).first()
    if not wishlist_item:
        return jsonify({"message": "Product not in wishlist"}), 404

    product = Product.query.get(product_id)
    db.session.delete(wishlist_item)
    db.session.commit()
    
    # Enregistrer l'action dans l'historique
    if product:
        UserHistory.log_action(
            user_id=current_user.id,
            action_type='remove_from_wishlist',
            action_description=f'Retiré {product.name} de la wishlist',
            product_id=product_id,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
    
    return jsonify({"message": "Product removed from wishlist"}), 200

@wishlist_cart_bp.route("/cart", methods=["GET"])
@token_required
def get_cart(current_user):
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return jsonify({"message": "Cart not found"}), 404
    return jsonify(cart.to_dict()), 200

@wishlist_cart_bp.route("/cart/add/<int:product_id>", methods=["POST"])
@token_required
def add_to_cart(current_user, product_id):
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.session.add(cart)
        db.session.commit()

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
        
    # Vérifier si le produit est en stock
    if product.stock_quantity <= 0:
        return jsonify({"message": "Produit en rupture de stock"}), 400
        
    existing_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    
    # Vérifier si l'ajout dépasse le stock disponible
    new_quantity = 1
    if existing_item:
        new_quantity = existing_item.quantity + 1
        
    if new_quantity > product.stock_quantity:
        return jsonify({"message": "Quantité demandée non disponible en stock"}), 400
        
    if existing_item:
        existing_item.quantity = new_quantity
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=1)
        db.session.add(cart_item)
    db.session.commit()
    
    # Enregistrer l'action dans l'historique
    UserHistory.log_action(
        user_id=current_user.id,
        action_type='add_to_cart',
        action_description=f'Ajouté {product.name} au panier',
        product_id=product_id,
        ip_address=request.remote_addr,
        user_agent=request.headers.get('User-Agent')
    )
    
    return jsonify({"message": "Product added to cart", "cart": cart.to_dict()}), 201

@wishlist_cart_bp.route("/cart/remove/<int:product_id>", methods=["DELETE"])
@token_required
def remove_from_cart(current_user, product_id):
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return jsonify({"message": "Cart not found"}), 404

    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if not cart_item:
        return jsonify({"message": "Product not in cart"}), 404

    product = Product.query.get(product_id)
    db.session.delete(cart_item)
    db.session.commit()
    
    # Enregistrer l'action dans l'historique
    if product:
        UserHistory.log_action(
            user_id=current_user.id,
            action_type='remove_from_cart',
            action_description=f'Retiré {product.name} du panier',
            product_id=product_id,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
    
    return jsonify({"message": "Product removed from cart"}), 200

@wishlist_cart_bp.route("/cart/update_quantity/<int:product_id>", methods=["PUT"])
@token_required
def update_cart_quantity(current_user, product_id):
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return jsonify({"message": "Cart not found"}), 404

    data = request.get_json()
    quantity = data.get("quantity")

    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"message": "Invalid quantity"}), 400

    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if not cart_item:
        return jsonify({"message": "Product not in cart"}), 404

    product = Product.query.get(product_id)
    old_quantity = cart_item.quantity
    cart_item.quantity = quantity
    db.session.commit()
    
    # Enregistrer l'action dans l'historique
    if product:
        UserHistory.log_action(
            user_id=current_user.id,
            action_type='update_cart_quantity',
            action_description=f'Modifié quantité de {product.name} de {old_quantity} à {quantity}',
            product_id=product_id,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
    
    return jsonify({"message": "Cart quantity updated", "cart": cart.to_dict()}), 200

@wishlist_cart_bp.route("/cart/empty", methods=["DELETE"])
@token_required
def empty_cart(current_user):
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return jsonify({"message": "Cart not found"}), 404

    # Supprimer tous les éléments du panier
    CartItem.query.filter_by(cart_id=cart.id).delete()
    db.session.commit()
    
    # Enregistrer l'action dans l'historique
    UserHistory.log_action(
        user_id=current_user.id,
        action_type='empty_cart',
        action_description='Panier vidé',
        ip_address=request.remote_addr,
        user_agent=request.headers.get('User-Agent')
    )
    
    return jsonify({"message": "Cart emptied successfully"}), 200

