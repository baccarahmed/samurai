from flask import Blueprint, jsonify, request
from ..models.user import User, db
from ..models.order import Order, OrderItem
from ..models.product import Product
from ..routes.auth import token_required
from sqlalchemy import desc

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users', methods=['POST'])
def create_user():
    
    data = request.json
    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Get current user profile"""
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update current user profile"""
    try:
        data = request.get_json()
        
        # Update allowed fields
        if 'first_name' in data:
            current_user.first_name = data['first_name']
        if 'last_name' in data:
            current_user.last_name = data['last_name']
        if 'email' in data:
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != current_user.id:
                return jsonify({'message': 'Cet email est déjà utilisé'}), 400
            current_user.email = data['email']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profil mis à jour avec succès',
            'user': current_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Erreur lors de la mise à jour du profil'}), 500

@user_bp.route('/orders', methods=['GET'])
@token_required
def get_user_orders(current_user):
    """Get current user's order history"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        # Build query for user's orders
        query = Order.query.filter_by(user_id=current_user.id)
        
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(desc(Order.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        orders_data = []
        for order in orders.items:
            # Get order items with product details
            order_items = []
            for item in order.order_items:
                product = Product.query.get(item.product_id)
                order_items.append({
                    'id': item.id,
                    'product_id': item.product_id,
                    'product_name': product.name if product else 'Produit supprimé',
                    'product_image': product.image_url if product else None,
                    'quantity': item.quantity,
                    'price': item.price,
                    'total': item.quantity * item.price
                })
            
            orders_data.append({
                'id': order.id,
                'total_amount': order.total_amount,
                'status': order.status,
                'created_at': order.created_at.strftime('%Y-%m-%d %H:%M'),
                'updated_at': order.updated_at.strftime('%Y-%m-%d %H:%M') if order.updated_at else None,
                'items': order_items,
                'items_count': len(order_items)
            })
        
        return jsonify({
            'orders': orders_data,
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page,
            'has_next': orders.has_next,
            'has_prev': orders.has_prev
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Erreur lors de la récupération des commandes'}), 500

@user_bp.route('/orders/<int:order_id>', methods=['GET'])
@token_required
def get_user_order_detail(current_user, order_id):
    """Get detailed information about a specific order"""
    try:
        # Make sure the order belongs to the current user
        order = Order.query.filter_by(id=order_id, user_id=current_user.id).first()
        
        if not order:
            return jsonify({'message': 'Commande non trouvée'}), 404
        
        # Get order items with product details
        order_items = []
        for item in order.order_items:
            product = Product.query.get(item.product_id)
            order_items.append({
                'id': item.id,
                'product_id': item.product_id,
                'product_name': product.name if product else 'Produit supprimé',
                'product_description': product.description if product else None,
                'product_image': product.image_url if product else None,
                'product_category': product.category if product else None,
                'quantity': item.quantity,
                'price': item.price,
                'total': item.quantity * item.price
            })
        
        order_data = {
            'id': order.id,
            'total_amount': order.total_amount,
            'status': order.status,
            'created_at': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'updated_at': order.updated_at.strftime('%Y-%m-%d %H:%M') if order.updated_at else None,
            'items': order_items,
            'items_count': len(order_items)
        }
        
        return jsonify({
            'order': order_data
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Erreur lors de la récupération de la commande'}), 500

@user_bp.route('/orders/stats', methods=['GET'])
@token_required
def get_user_order_stats(current_user):
    """Get user's order statistics"""
    try:
        # Get all user orders
        user_orders = Order.query.filter_by(user_id=current_user.id).all()
        
        # Calculate statistics
        total_orders = len(user_orders)
        total_spent = sum(order.total_amount for order in user_orders)
        
        # Count orders by status
        status_counts = {}
        for order in user_orders:
            status_counts[order.status] = status_counts.get(order.status, 0) + 1
        
        # Get most recent order
        recent_order = Order.query.filter_by(user_id=current_user.id).order_by(desc(Order.created_at)).first()
        
        stats = {
            'total_orders': total_orders,
            'total_spent': round(total_spent, 2),
            'status_counts': status_counts,
            'recent_order_date': recent_order.created_at.strftime('%Y-%m-%d') if recent_order else None
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'message': 'Erreur lors de la récupération des statistiques'}), 500
