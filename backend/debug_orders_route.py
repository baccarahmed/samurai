from src.main_fixed import app
from src.extensions import db
from flask import jsonify, request
import traceback
import json
import logging
import sys
from flask_jwt_extended import create_access_token
from src.extensions import db

# Configuration du logging pour afficher dans la console
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('debug_orders_route')

def debug_get_orders():
    """Créer une nouvelle fonction get_orders pour le débogage"""
    from src.routes.orders import orders_bp
    from flask_jwt_extended import jwt_required, get_jwt_identity
    from src.models.user import User
    from src.models.order import Order
    from sqlalchemy import desc
    
    @orders_bp.route('/orders_debug', methods=['GET'])
    @jwt_required()
    def debug_get_orders_route():
        """Version de débogage de la fonction get_orders"""
        logger.info("=== DÉBUT DE LA FONCTION DEBUG_GET_ORDERS ===")
        try:
            current_user_id = get_jwt_identity()
            logger.info(f"Current user ID: {current_user_id}")
            
            user = User.query.get(current_user_id)
            if not user:
                logger.error(f"User not found for ID: {current_user_id}")
                return jsonify({'error': 'Utilisateur non trouvé'}), 404
            
            logger.info(f"User role: {user.role}")
            
            # Paramètres de pagination
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            logger.info(f"Pagination: page={page}, per_page={per_page}")
            
            # Filtres
            status = request.args.get('status')
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')
            logger.info(f"Filtres: status={status}, start_date={start_date}, end_date={end_date}")
            
            # Base query
            try:
                if user.has_permission('view_all_orders'):
                    # Admin peut voir toutes les commandes
                    query = Order.query
                    user_id_filter = request.args.get('user_id', type=int)
                    if user_id_filter:
                        query = query.filter(Order.user_id == user_id_filter)
                    logger.info("Admin user - viewing all orders")
                else:
                    # Client ne voit que ses commandes
                    query = Order.query.filter(Order.user_id == current_user_id)
                    logger.info(f"Regular user - viewing own orders only")
            except Exception as e:
                logger.error(f"Error in permission check: {str(e)}")
                logger.error(traceback.format_exc())
                return jsonify({'error': f'Erreur lors de la vérification des permissions: {str(e)}'}), 500
            
            # Tri par date de création (plus récent en premier)
            try:
                query = query.order_by(desc(Order.created_at))
                logger.info("Applied sorting by created_at desc")
            except Exception as e:
                logger.error(f"Error applying sorting: {str(e)}")
                logger.error(traceback.format_exc())
                return jsonify({'error': f'Erreur lors du tri: {str(e)}'}), 500
            
            # Pagination - Updated for SQLAlchemy 2.0
            try:
                logger.info(f"Attempting pagination with page={page}, per_page={per_page}")
                try:
                    # Try the db.paginate method first (SQLAlchemy 2.0)
                    pagination = db.paginate(query, page=page, per_page=per_page, error_out=False)
                    logger.info("Using db.paginate method (SQLAlchemy 2.0)")
                except Exception as e1:
                    logger.error(f"db.paginate failed with error: {str(e1)}")
                    logger.error(traceback.format_exc())
                    # Fall back to query.paginate method (older SQLAlchemy)
                    try:
                        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
                        logger.info("Falling back to query.paginate method (older SQLAlchemy)")
                    except Exception as e2:
                        logger.error(f"query.paginate also failed with error: {str(e2)}")
                        logger.error(traceback.format_exc())
                        raise Exception(f"Pagination failed with both methods: {str(e1)} and {str(e2)}")
                
                orders_list = pagination.items
                logger.info(f"Successfully paginated, got {len(orders_list)} orders")
                
                # Convert orders to dict one by one to catch any serialization errors
                orders_dict_list = []
                for order in orders_list:
                    try:
                        logger.info(f"Processing order ID: {order.id}")
                        # Récupérer les attributs de base de la commande sans les relations
                        order_dict = {
                            'id': order.id,
                            'user_id': order.user_id,
                            'order_number': order.order_number,
                            'total_amount': float(order.total_amount) if order.total_amount else 0.0,
                            'status': order.status,
                            'shipping_address': order.shipping_address,
                            'billing_address': order.billing_address,
                            'payment_method': order.payment_method,
                            'shipping_method': order.shipping_method,
                            'shipping_cost': float(order.shipping_cost) if order.shipping_cost else 0.0,
                            'tax_amount': float(order.tax_amount) if order.tax_amount else 0.0,
                            'discount_amount': float(order.discount_amount) if order.discount_amount else 0.0,
                            'payment_status': order.payment_status,
                            'notes': order.notes,
                            'created_at': order.created_at.isoformat() if order.created_at else None,
                            'updated_at': order.updated_at.isoformat() if order.updated_at else None,
                        }
                        
                        # Vérifier si order_items existe
                        if hasattr(order, 'order_items'):
                            logger.info(f"Order {order.id} has order_items attribute with {len(order.order_items)} items")
                            # Ajouter les éléments de la commande
                            order_dict['items'] = []
                            for item in order.order_items:
                                try:
                                    item_dict = {
                                        'id': item.id,
                                        'order_id': item.order_id,
                                        'product_id': item.product_id,
                                        'product_name': item.product_name,
                                        'product_sku': item.product_sku,
                                        'quantity': item.quantity,
                                        'unit_price': float(item.unit_price) if item.unit_price else 0.0,
                                        'total_price': float(item.total_price) if item.total_price else 0.0
                                    }
                                    order_dict['items'].append(item_dict)
                                except Exception as item_error:
                                    logger.error(f"Error converting item {item.id} to dict: {str(item_error)}")
                                    logger.error(traceback.format_exc())
                                    continue
                        else:
                            logger.error(f"Order {order.id} does not have order_items attribute")
                            order_dict['items'] = []
                        
                        # Vérifier si status_history existe
                        if hasattr(order, 'status_history'):
                            logger.info(f"Order {order.id} has status_history attribute with {len(order.status_history)} items")
                            # Ajouter l'historique des statuts
                            order_dict['status_history'] = []
                            for history in order.status_history:
                                try:
                                    history_dict = {
                                        'id': history.id,
                                        'order_id': history.order_id,
                                        'status': history.status,
                                        'comment': history.comment,
                                        'created_by': history.created_by,
                                        'created_at': history.created_at.isoformat() if history.created_at else None
                                    }
                                    order_dict['status_history'].append(history_dict)
                                except Exception as history_error:
                                    logger.error(f"Error converting history {history.id} to dict: {str(history_error)}")
                                    logger.error(traceback.format_exc())
                                    continue
                        else:
                            logger.error(f"Order {order.id} does not have status_history attribute")
                            order_dict['status_history'] = []
                        
                        orders_dict_list.append(order_dict)
                        logger.info(f"Successfully processed order ID: {order.id}")
                    except Exception as order_error:
                        logger.error(f"Error processing order {order.id}: {str(order_error)}")
                        logger.error(traceback.format_exc())
                        continue
                
                # Construire la réponse paginée
                response_data = {
                    'orders': orders_dict_list,
                    'total': pagination.total,
                    'pages': pagination.pages,
                    'current_page': page,
                    'has_next': pagination.has_next,
                    'has_prev': pagination.has_prev
                }
                
                # Tester la sérialisation JSON
                try:
                    json_data = json.dumps(response_data)
                    logger.info("JSON serialization successful")
                except Exception as json_error:
                    logger.error(f"JSON serialization error: {str(json_error)}")
                    logger.error(traceback.format_exc())
                    return jsonify({'error': f'Erreur lors de la sérialisation JSON: {str(json_error)}'}), 500
                
                return jsonify(response_data), 200
                
            except Exception as pagination_error:
                logger.error(f"Error in pagination: {str(pagination_error)}")
                logger.error(traceback.format_exc())
                return jsonify({'error': f'Erreur lors de la pagination: {str(pagination_error)}'}), 500
                
        except Exception as e:
            logger.error(f"Exception in debug_get_orders: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({'message': f'Erreur détaillée: {str(e)}'}), 500
    
    logger.info("Route de débogage /api/orders_debug créée")
    return debug_get_orders_route

def test_orders_route():
    with app.app_context():
        try:
            # Importer les modèles nécessaires
            from src.models.user import User
            from src.routes.orders import orders_bp, get_orders
            
            # Créer la route de débogage
            debug_route = debug_get_orders()
            logger.info("Route de débogage créée")
            
            # Vérifier l'utilisateur admin
            admin = User.query.filter_by(email='admin@samurai-nutrition.com').first()
            logger.info(f"Admin trouvé: {admin.id if admin else 'Non trouvé'}")
            
            # Créer un token JWT pour l'admin
            access_token = create_access_token(identity=admin.id)
            logger.info(f"Token créé")
            
            # Tester directement avec le client de test Flask
            logger.info("Test avec le client de test Flask")
            with app.test_client() as client:
                # Faire la requête avec le token
                headers = {'Authorization': f'Bearer {access_token}'}
                
                # Tester la route /api/orders
                logger.info("Test de la route /api/orders")
                response = client.get('/api/orders', headers=headers)
                
                logger.info(f"Statut de la réponse: {response.status_code}")
                logger.info(f"En-têtes de la réponse: {response.headers}")
                
                try:
                    data = response.get_json()
                    logger.info(f"Contenu JSON: {json.dumps(data, indent=2)}")
                except Exception as json_error:
                    logger.error(f"Erreur lors du décodage JSON: {str(json_error)}")
                    logger.info(f"Contenu brut: {response.data.decode('utf-8')}")
                
                # Tester la route de débogage
                logger.info("Test de la route /api/orders_debug")
                debug_response = client.get('/api/orders_debug', headers=headers)
                
                logger.info(f"Statut de la réponse de débogage: {debug_response.status_code}")
                logger.info(f"En-têtes de la réponse de débogage: {debug_response.headers}")
                
                try:
                    debug_data = debug_response.get_json()
                    logger.info(f"Contenu JSON de débogage: {json.dumps(debug_data, indent=2)}")
                except Exception as json_error:
                    logger.error(f"Erreur lors du décodage JSON de débogage: {str(json_error)}")
                    logger.info(f"Contenu brut de débogage: {debug_response.data.decode('utf-8')}")
                
                return response
                
        except Exception as e:
            logger.error(f"Erreur: {str(e)}")
            logger.error(traceback.format_exc())
            return {"error": str(e)}

if __name__ == '__main__':
    logger.info("=== DÉBOGAGE DE LA ROUTE /api/orders ===")
    test_orders_route()