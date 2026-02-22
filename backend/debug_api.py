from src.main_fixed import app
from src.extensions import db
from flask import jsonify
import traceback
import json

def debug_orders_api():
    with app.app_context():
        try:
            # Importer les modèles nécessaires
            from src.models.order import Order, OrderItem, OrderStatusHistory
            from src.models.user import User
            
            # Vérifier l'utilisateur admin
            admin = User.query.filter_by(email='admin@samurai-nutrition.com').first()
            print(f"Admin trouvé: {admin.id if admin else 'Non trouvé'}")
            
            # Récupérer toutes les commandes
            orders = Order.query.all()
            print(f"Nombre de commandes: {len(orders)}")
            
            # Tester la sérialisation manuelle
            orders_dict_list = []
            for order in orders:
                try:
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
                            print(f"Error converting item {item.id} to dict: {str(item_error)}")
                            traceback.print_exc()
                            continue
                    
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
                            print(f"Error converting history {history.id} to dict: {str(history_error)}")
                            traceback.print_exc()
                            continue
                    
                    orders_dict_list.append(order_dict)
                    print(f"Commande {order.id} convertie avec succès")
                except Exception as e:
                    print(f"Error converting order {order.id} to dict: {str(e)}")
                    traceback.print_exc()
                    continue
            
            # Créer une réponse similaire à celle de l'API
            response_data = {
                'orders': orders_dict_list,
                'pagination': {
                    'page': 1,
                    'per_page': 10,
                    'total': len(orders),
                    'pages': 1,
                    'has_next': False,
                    'has_prev': False
                }
            }
            
            # Tester la sérialisation JSON
            try:
                json_response = jsonify(response_data)
                print("\nSérialisation JSON réussie!")
                return json_response
            except Exception as json_error:
                print(f"\nErreur lors de la sérialisation JSON: {str(json_error)}")
                traceback.print_exc()
                
        except Exception as e:
            print(f"\nErreur générale: {str(e)}")
            traceback.print_exc()

if __name__ == '__main__':
    debug_orders_api()