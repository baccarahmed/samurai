from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import desc, func, and_, or_
from src.extensions import db
from src.models.user import User
from src.models.product import Product
from src.models.order import Order, OrderItem, OrderStatusHistory, AdminLog

admin_bp = Blueprint('admin', __name__)

def require_admin():
    """Décorateur pour vérifier les droits d'administration"""
    def decorator(f):
        from functools import wraps
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or user.role != 'admin':
                return jsonify({'error': 'Accès administrateur requis'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# ==================== DASHBOARD ====================

@admin_bp.route('/admin/dashboard/stats', methods=['GET'])
@jwt_required()
@require_admin()
def get_dashboard_stats():
    """Récupérer les statistiques du dashboard"""
    try:
        # Période pour les statistiques (30 derniers jours par défaut)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.now() - timedelta(days=days)
        
        # Statistiques générales
        total_users = User.query.count()
        total_products = Product.query.filter_by(is_active=True).count()
        total_orders = Order.query.count()
        
        # Nouveaux utilisateurs (période)
        new_users = User.query.filter(User.created_at >= start_date).count()
        
        # Commandes récentes
        recent_orders = Order.query.filter(Order.created_at >= start_date).count()
        
        # Chiffre d'affaires
        try:
            revenue_query = db.session.query(func.sum(Order.total_amount)).filter(
                and_(
                    Order.created_at >= start_date,
                    Order.status.in_(['delivered', 'shipped', 'processing'])
                )
            )
            total_revenue = revenue_query.scalar() or 0
            print(f"Revenue calculation successful: {total_revenue}")
        except Exception as revenue_error:
            print(f"Error calculating revenue: {str(revenue_error)}")
            total_revenue = 0
        
        # Commandes par statut
        status_stats = db.session.query(
            Order.status,
            func.count(Order.id).label('count')
        ).group_by(Order.status).all()
        
        return jsonify({
            'total_users': total_users,
            'total_products': total_products,
            'total_orders': total_orders,
            'new_users': new_users,
            'recent_orders': recent_orders,
            'total_revenue': float(total_revenue) if total_revenue else 0,
            'status_stats': [{'status': s.status, 'count': s.count} for s in status_stats]
        }), 200
        
    except Exception as e:
        print(f"Dashboard stats error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/dashboard/recent-orders', methods=['GET'])
@jwt_required()
@require_admin()
def get_recent_orders():
    """Récupérer les commandes récentes"""
    try:
        limit = request.args.get('limit', 5, type=int)
        
        recent_orders = Order.query.order_by(desc(Order.created_at)).limit(limit).all()
        
        return jsonify([{
            'id': order.id,
            'user_id': order.user_id,
            'status': order.status,
            'total_amount': float(order.total_amount),
            'created_at': order.created_at.isoformat(),
            'user': {
                'id': order.user.id,
                'first_name': order.user.first_name,
                'last_name': order.user.last_name,
                'email': order.user.email
            } if order.user else None
        } for order in recent_orders]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/dashboard/sales-chart', methods=['GET'])
@jwt_required()
@require_admin()
def get_sales_chart():
    """Récupérer les données du graphique des ventes"""
    try:
        days = request.args.get('days', 30, type=int)
        start_date = datetime.now() - timedelta(days=days)
        
        # Évolution des ventes (par jour)
        daily_sales = db.session.query(
            func.date(Order.created_at).label('date'),
            func.sum(Order.total_amount).label('revenue'),
            func.count(Order.id).label('orders')
        ).filter(
            and_(
                Order.created_at >= start_date,
                Order.status != 'cancelled'
            )
        ).group_by(func.date(Order.created_at)).order_by(
            func.date(Order.created_at)
        ).all()
        
        # Produits les plus vendus
        top_products = db.session.query(
            Product.name,
            func.sum(OrderItem.quantity).label('total_sold')
        ).join(OrderItem).join(Order).filter(
            Order.created_at >= start_date
        ).group_by(Product.id, Product.name).order_by(
            desc('total_sold')
        ).limit(5).all()
        
        return jsonify({
            'daily_sales': [{'date': str(d.date), 'revenue': float(d.revenue), 'orders': d.orders} for d in daily_sales],
            'top_products': [{'name': p.name, 'total_sold': p.total_sold} for p in top_products]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== GESTION DES UTILISATEURS ====================

@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
@require_admin()
def get_users():
    """Récupérer la liste des utilisateurs"""
    try:
        # Paramètres de pagination et filtres
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        role = request.args.get('role', '')
        
        # Base query
        query = User.query
        
        # Filtres
        if search:
            query = query.filter(
                or_(
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        if role:
            query = query.filter(User.role == role)
        
        # Tri par date de création (plus récent en premier)
        query = query.order_by(desc(User.created_at))
        
        # Pagination
        users = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': users.total,
                'pages': users.pages,
                'has_next': users.has_next,
                'has_prev': users.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des utilisateurs: {str(e)}'}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['GET'])
@jwt_required()
@require_admin()
def get_user(user_id):
    """Récupérer un utilisateur spécifique"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Statistiques de l'utilisateur
        user_orders = Order.query.filter_by(user_id=user_id).count()
        user_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            and_(
                Order.user_id == user_id,
                Order.status.in_(['delivered', 'shipped'])
            )
        ).scalar() or 0
        
        user_data = user.to_dict()
        user_data['stats'] = {
            'total_orders': user_orders,
            'total_spent': float(user_revenue)
        }
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération de l\'utilisateur: {str(e)}'}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@require_admin()
def update_user(user_id):
    """Mettre à jour un utilisateur"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Champs modifiables
        updatable_fields = ['first_name', 'last_name', 'email', 'role']
        
        for field in updatable_fields:
            if field in data:
                setattr(user, field, data[field])
        
        user.updated_at = datetime.utcnow()
        
        # Logger l'action
        AdminLog.log_action(
            admin_id=current_user_id,
            action='update_user',
            target_type='user',
            target_id=user_id,
            details=f'Utilisateur mis à jour: {user.email}',
            request=request
        )
        
        db.session.commit()
        
        return jsonify({
            'message': 'Utilisateur mis à jour avec succès',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour: {str(e)}'}), 500

# ==================== GESTION DES PRODUITS ====================

@admin_bp.route('/admin/products', methods=['GET'])
@jwt_required()
@require_admin()
def get_admin_products():
    """Récupérer la liste des produits pour l'admin"""
    try:
        # Paramètres de pagination et filtres
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        is_active = request.args.get('is_active', '')
        low_stock = request.args.get('low_stock', '')
        
        # Base query
        query = Product.query
        
        # Filtres
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f'%{search}%'),
                    Product.sku.ilike(f'%{search}%')
                )
            )
        
        if category:
            query = query.filter(Product.category == category)
        
        if is_active:
            query = query.filter(Product.is_active == (is_active.lower() == 'true'))
        
        if low_stock and low_stock.lower() == 'true':
            query = query.filter(Product.stock_quantity <= Product.low_stock_threshold)
        
        # Tri par date de création (plus récent en premier)
        query = query.order_by(desc(Product.created_at))
        
        # Pagination
        products = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des produits: {str(e)}'}), 500

@admin_bp.route('/admin/products', methods=['POST'])
@jwt_required()
@require_admin()
def create_product():
    """Créer un nouveau produit"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation des données
        required_fields = ['name', 'price', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Champ requis manquant: {field}'}), 400
        
        # Générer un SKU si non fourni
        if 'sku' not in data or not data['sku']:
            # Générer un SKU basé sur le nom et un timestamp
            import re
            name_part = re.sub(r'[^a-zA-Z0-9]', '', data['name'][:10]).upper()
            timestamp_part = str(int(datetime.now().timestamp()))[-6:]
            data['sku'] = f"{name_part}{timestamp_part}"
        
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            original_price=data.get('original_price'),
            category=data['category'],
            stock_quantity=data.get('stock_quantity', 0),
            low_stock_threshold=data.get('low_stock_threshold', 10),
            sku=data['sku'],
            weight=data.get('weight'),
            dimensions=data.get('dimensions'),
            rating=data.get('rating', 0),
            review_count=data.get('review_count', 0),
            image_url=data.get('image_url'),
            featured=data.get('featured', False),
            is_active=data.get('is_active', True),
            product_benefits=data.get('product_benefits', ''),
            directions=data.get('directions', ''),
            ingredients=data.get('ingredients', ''),
            nutrition_facts=data.get('nutrition_facts', {})
        )
        
        db.session.add(product)
        db.session.flush()  # Pour obtenir l'ID
        
        # Logger l'action
        AdminLog.log_action(
            admin_id=current_user_id,
            action='create_product',
            target_type='product',
            target_id=product.id,
            details=f'Produit créé: {product.name}',
            request=request
        )
        
        db.session.commit()
        
        return jsonify({
            'message': 'Produit créé avec succès',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la création du produit: {str(e)}'}), 500

@admin_bp.route('/admin/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@require_admin()
def update_product(product_id):
    """Mettre à jour un produit"""
    try:
        current_user_id = get_jwt_identity()
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Champs modifiables
        updatable_fields = ['name', 'description', 'price', 'original_price', 'category',
                           'stock_quantity', 'low_stock_threshold', 'sku', 'weight',
                           'dimensions', 'rating', 'review_count', 'image_url', 'featured', 'is_active',
                           'product_benefits', 'directions', 'ingredients', 'nutrition_facts']
        
        for field in updatable_fields:
            if field in data:
                setattr(product, field, data[field])
        
        product.updated_at = datetime.utcnow()
        
        # Logger l'action
        AdminLog.log_action(
            admin_id=current_user_id,
            action='update_product',
            target_type='product',
            target_id=product_id,
            details=f'Produit mis à jour: {product.name}',
            request=request
        )
        
        db.session.commit()
        
        return jsonify({
            'message': 'Produit mis à jour avec succès',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour du produit: {str(e)}'}), 500

@admin_bp.route('/admin/products/<int:product_id>/stock', methods=['PUT'])
@jwt_required()
@require_admin()
def update_product_stock(product_id):
    """Mettre à jour le stock d'un produit"""
    try:
        current_user_id = get_jwt_identity()
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        if 'stock_change' not in data:
            return jsonify({'error': 'Changement de stock requis'}), 400
        
        old_stock = product.stock_quantity
        stock_change = data['stock_change']
        reason = data.get('reason', 'Ajustement manuel')
        
        product.update_stock(stock_change)
        
        # Logger l'action
        AdminLog.log_action(
            admin_id=current_user_id,
            action='update_stock',
            target_type='product',
            target_id=product_id,
            details=f'Stock {product.name}: {old_stock} → {product.stock_quantity} ({reason})',
            request=request
        )
        
        db.session.commit()
        
        return jsonify({
            'message': 'Stock mis à jour avec succès',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour du stock: {str(e)}'}), 500

@admin_bp.route('/admin/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@require_admin()
def delete_product(product_id):
    """Supprimer un produit"""
    try:
        current_user_id = get_jwt_identity()
        product = Product.query.get_or_404(product_id)
        
        # Store product info for logging
        product_name = product.name
        
        # Delete the product
        db.session.delete(product)
        
        # Logger l'action
        AdminLog.log_action(
            admin_id=current_user_id,
            action='delete_product',
            target_type='product',
            target_id=product_id,
            details=f'Produit supprimé: {product_name}',
            request=request
        )
        
        db.session.commit()
        
        return jsonify({
            'message': 'Produit supprimé avec succès'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression du produit: {str(e)}'}), 500

# ==================== LOGS D'ADMINISTRATION ====================

@admin_bp.route('/admin/logs', methods=['GET'])
@jwt_required()
@require_admin()
def get_admin_logs():
    """Récupérer les logs d'administration"""
    try:
        # Paramètres de pagination et filtres
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        action = request.args.get('action', '')
        admin_id = request.args.get('admin_id', type=int)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Base query
        query = AdminLog.query
        
        # Filtres
        if action:
            query = query.filter(AdminLog.action.ilike(f'%{action}%'))
        
        if admin_id:
            query = query.filter(AdminLog.admin_id == admin_id)
        
        if start_date:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(AdminLog.created_at >= start_dt)
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date)
            query = query.filter(AdminLog.created_at <= end_dt)
        
        # Tri par date (plus récent en premier)
        query = query.order_by(desc(AdminLog.created_at))
        
        # Pagination
        logs = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'logs': [log.to_dict() for log in logs.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': logs.total,
                'pages': logs.pages,
                'has_next': logs.has_next,
                'has_prev': logs.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des logs: {str(e)}'}), 500

# ==================== GESTION DES COMMANDES ====================

@admin_bp.route('/admin/orders', methods=['GET'])
@jwt_required()
@require_admin()
def get_admin_orders():
    """Récupérer la liste des commandes pour l'admin"""
    try:
        # Paramètres de pagination et filtres
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        status = request.args.get('status', '')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Base query
        query = Order.query
        
        # Filtres
        if search:
            query = query.join(User).filter(
                or_(
                    Order.order_number.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%'),
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%')
                )
            )
        
        if status:
            query = query.filter(Order.status == status)
        
        if start_date:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(Order.created_at >= start_dt)
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date)
            query = query.filter(Order.created_at <= end_dt)
        
        # Tri par date de création (plus récent en premier)
        query = query.order_by(desc(Order.created_at))
        
        # Pagination
        orders = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'orders': [{
                'id': order.id,
                'order_number': order.order_number,
                'user_id': order.user_id,
                'user': {
                    'id': order.user.id,
                    'email': order.user.email,
                    'first_name': order.user.first_name,
                    'last_name': order.user.last_name
                } if order.user else None,
                'total_amount': float(order.total_amount),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat() if order.updated_at else None
            } for order in orders.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': orders.total,
                'pages': orders.pages,
                'has_next': orders.has_next,
                'has_prev': orders.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des commandes: {str(e)}'}), 500

@admin_bp.route('/admin/orders/<int:order_id>', methods=['GET'])
@jwt_required()
@require_admin()
def get_admin_order(order_id):
    """Récupérer les détails d'une commande spécifique"""
    try:
        order = Order.query.get_or_404(order_id)
        
        # Récupérer les articles de la commande
        order_items = [{
            'id': item.id,
            'product_id': item.product_id,
            'product_name': item.product_name,
            'product_sku': item.product_sku,
            'quantity': item.quantity,
            'unit_price': float(item.unit_price),
            'total_price': float(item.total_price)
        } for item in order.order_items]
        
        # Récupérer l'historique des statuts
        status_history = [{
            'id': history.id,
            'status': history.status,
            'comment': history.comment,
            'created_at': history.created_at.isoformat(),
            'created_by': history.created_by
        } for history in order.status_history]
        
        return jsonify({
            'order': {
                'id': order.id,
                'order_number': order.order_number,
                'user_id': order.user_id,
                'user': {
                    'id': order.user.id,
                    'email': order.user.email,
                    'first_name': order.user.first_name,
                    'last_name': order.user.last_name
                } if order.user else None,
                'total_amount': float(order.total_amount),
                'status': order.status,
                'shipping_address': order.shipping_address,
                'billing_address': order.billing_address,
                'payment_method': order.payment_method,
                'shipping_method': order.shipping_method,
                'shipping_cost': float(order.shipping_cost),
                'tax_amount': float(order.tax_amount),
                'discount_amount': float(order.discount_amount),
                'payment_status': order.payment_status,
                'notes': order.notes,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat() if order.updated_at else None,
                'items': order_items,
                'status_history': status_history
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération de la commande: {str(e)}'}), 500

@admin_bp.route('/admin/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
@require_admin()
def update_order_status(order_id):
    """Mettre à jour le statut d'une commande"""
    try:
        current_user_id = get_jwt_identity()
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Le statut est requis'}), 400
            
        new_status = data['status']
        comment = data.get('comment', '')
        
        # Vérifier les statuts valides
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
        if new_status not in valid_statuses:
            return jsonify({'error': f'Statut invalide. Valeurs acceptées: {", ".join(valid_statuses)}'}), 400
        
        # Vérifier si le statut est différent
        if order.status == new_status:
            return jsonify({'message': 'Aucun changement de statut nécessaire'}), 200
            
        # Mettre à jour le statut
        old_status = order.status
        order.status = new_status
        
        # Ajouter à l'historique des statuts
        history = OrderStatusHistory(
            order_id=order.id,
            status=new_status,
            comment=comment,
            created_by=current_user_id
        )
        db.session.add(history)
        
        # Logger l'action
        AdminLog.log_action(
            admin_id=current_user_id,
            action='update_order_status',
            target_type='order',
            target_id=order_id,
            details=f'Commande #{order.order_number}: {old_status} -> {new_status}',
            request=request
        )
        
        db.session.commit()
        
        return jsonify({
            'message': 'Statut de la commande mis à jour avec succès',
            'order': {
                'id': order.id,
                'status': order.status,
                'updated_at': order.updated_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour du statut: {str(e)}'}), 500

