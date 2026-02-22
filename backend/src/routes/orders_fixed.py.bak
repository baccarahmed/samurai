from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from sqlalchemy import desc, and_, or_
from src.models.user import User
from src.models.product import Product
from src.models.order import Order, OrderItem, OrderStatusHistory, AdminLog
from src.extensions import db
from src.services.email_service import EmailService

orders_bp = Blueprint('orders', __name__)

def require_permission(permission):
    """Décorateur pour vérifier les permissions utilisateur"""
    def decorator(f):
        from functools import wraps
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or not user.has_permission(permission):
                return jsonify({'error': 'Permission insuffisante'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@orders_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    """Créer une nouvelle commande"""
    try:
        from main_fixed import db
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation des données
        # Dans la fonction create_order
        required_fields = ['items', 'shipping_address', 'billing_address', 'payment_method']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Champ requis manquant: {field}'}), 400
        
        if not data['items']:
            return jsonify({'error': 'La commande doit contenir au moins un article'}), 400
        
        # Vérifier la disponibilité des produits
        total_amount = 0
        order_items_data = []
        
        for item_data in data['items']:
            product = Product.query.get(item_data['product_id'])
            if not product:
                return jsonify({'error': f'Produit {item_data["product_id"]} introuvable'}), 404
            
            if not product.is_in_stock(item_data['quantity']):
                return jsonify({'error': f'Stock insuffisant pour {product.name}'}), 400
            
            item_total = product.price * item_data['quantity']
            total_amount += item_total
            
            order_items_data.append({
                'product': product,
                'quantity': item_data['quantity'],
                'unit_price': product.price,
                'total_price': item_total
            })
        
        # Ajouter les frais de port et taxes
        shipping_cost = data.get('shipping_cost', 0)
        tax_amount = data.get('tax_amount', 0)
        discount_amount = data.get('discount_amount', 0)
        
        final_total = total_amount + shipping_cost + tax_amount - discount_amount
        
        # Créer la commande
        order = Order(
            user_id=current_user_id,
            order_number=Order.generate_order_number(),
            total_amount=final_total,
            shipping_address=data['shipping_address'],
            billing_address=data['billing_address'],
            payment_method=data.get('payment_method'),
            shipping_method=data.get('shipping_method'),
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            discount_amount=discount_amount,
            notes=data.get('notes')
        )
        
        db.session.add(order)
        db.session.flush()  # Pour obtenir l'ID de la commande
        
        # Créer les articles de commande et réserver le stock
        for item_data in order_items_data:
            product = item_data['product']
            
            # Réserver le stock
            if not product.reserve_stock(item_data['quantity']):
                db.session.rollback()
                return jsonify({'error': f'Impossible de réserver le stock pour {product.name}'}), 400
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price'],
                product_name=product.name,
                product_sku=product.sku
            )
            db.session.add(order_item)
        
        # Créer l'historique initial
        history = OrderStatusHistory(
            order_id=order.id,
            status='pending',
            comment='Commande créée',
            created_by=current_user_id
        )
        db.session.add(history)
        
        db.session.commit()
        
        # Envoyer une notification aux administrateurs
        try:
            # Récupérer tous les administrateurs
            admins = User.query.filter_by(role='admin').all()
            
            # Envoyer un email à chaque administrateur
            for admin in admins:
                EmailService.send_new_order_notification(
                    admin_email=admin.email,
                    order=order
                )
                
            print(f"Notifications envoyées aux administrateurs pour la commande #{order.order_number}")
        except Exception as e:
            # Ne pas bloquer la création de commande si l'envoi de notification échoue
            print(f"Erreur lors de l'envoi des notifications: {str(e)}")
        
        return jsonify({
            'message': 'Commande créée avec succès',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la création de la commande: {str(e)}'}), 500

@orders_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    """Récupérer les commandes (utilisateur ou admin)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Paramètres de pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Filtres
        status = request.args.get('status')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Base query
        if user.has_permission('view_all_orders'):
            # Admin peut voir toutes les commandes
            query = Order.query
            user_id_filter = request.args.get('user_id', type=int)
            if user_id_filter:
                query = query.filter(Order.user_id == user_id_filter)
        else:
            # Client ne voit que ses commandes
            query = Order.query.filter(Order.user_id == current_user_id)
        
        # Appliquer les filtres
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
            'orders': [order.to_dict() for order in orders.items],
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

@orders_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
@require_permission('update_order_status')
def update_order_status(order_id):
    """Mettre à jour le statut d'une commande (admin uniquement)"""
    try:
        from main_fixed import db
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation des données
        if 'status' not in data:
            return jsonify({'error': 'Le statut est requis'}), 400
            
        new_status = data['status']
        comment = data.get('comment', '')
        
        # Vérifier les statuts valides
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
        if new_status not in valid_statuses:
            return jsonify({'error': f'Statut invalide. Valeurs acceptées: {", ".join(valid_statuses)}'}), 400
        
        # Récupérer la commande
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Commande introuvable'}), 404
            
        # Vérifier si le statut est différent
        if order.status == new_status:
            return jsonify({'message': 'Aucun changement de statut nécessaire'}), 200
            
        # Récupérer l'utilisateur admin
        admin = User.query.get(current_user_id)
        
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
        
        # Ajouter un log administrateur
        admin_log = AdminLog(
            admin_id=current_user_id,
            action=f'update_order_status',
            details=f'Commande #{order.order_number}: {old_status} -> {new_status}',
            ip_address=request.remote_addr
        )
        db.session.add(admin_log)
        
        # Enregistrer les modifications
        db.session.commit()
        
        # Envoyer une notification au client
        try:
            # Récupérer l'utilisateur client
            client = User.query.get(order.user_id)
            
            # Envoyer un email de notification
            EmailService.send_order_status_change_notification(
                client_email=client.email,
                order=order,
                old_status=old_status,
                new_status=new_status,
                comment=comment
            )
            
            print(f"Notification envoyée au client pour la commande #{order.order_number} (changement de statut)")
        except Exception as e:
            # Ne pas bloquer la mise à jour si l'envoi de notification échoue
            print(f"Erreur lors de l'envoi de la notification: {str(e)}")
        
        return jsonify({
            'message': 'Statut de la commande mis à jour avec succès',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour du statut: {str(e)}'}), 500

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Récupérer les détails d'une commande spécifique"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Récupérer la commande
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Commande introuvable'}), 404
            
        # Vérifier les permissions
        if order.user_id != current_user_id and not user.has_permission('view_all_orders'):
            return jsonify({'error': 'Permission insuffisante'}), 403
            
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
        return jsonify({'error': f'Erreur lors de la récupération des détails de la commande: {str(e)}'}), 500

