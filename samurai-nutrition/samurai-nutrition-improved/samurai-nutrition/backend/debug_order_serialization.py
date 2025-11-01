import logging
import traceback
import json
import sys
from src.models.order import Order
from src.extensions import db
from src.main_fixed import app

# Configuration du logging pour afficher dans la console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger('debug_order_serialization')

def test_order_serialization():
    """Teste directement la sérialisation des commandes"""
    with app.app_context():
        try:
            # Récupérer une commande
            order = Order.query.first()
            if not order:
                logger.error("Aucune commande trouvée dans la base de données")
                return
            
            logger.info(f"Commande trouvée: ID={order.id}")
            
            # Vérifier les attributs de la commande
            logger.info(f"Attributs de la commande:")
            logger.info(f"  - id: {order.id}")
            logger.info(f"  - user_id: {order.user_id}")
            logger.info(f"  - total_amount: {order.total_amount}")
            logger.info(f"  - status: {order.status}")
            logger.info(f"  - created_at: {order.created_at}")
            
            # Vérifier les éléments de la commande
            if hasattr(order, 'order_items'):
                logger.info(f"La commande a {len(order.order_items)} éléments:")
                for i, item in enumerate(order.order_items):
                    logger.info(f"  Élément {i+1}:")
                    logger.info(f"    - id: {item.id}")
                    logger.info(f"    - product_name: {item.product_name}")
                    logger.info(f"    - quantity: {item.quantity}")
                    logger.info(f"    - total_price: {item.total_price}")
            else:
                logger.error("La commande n'a pas d'attribut 'order_items'")
            
            # Vérifier l'historique des statuts
            if hasattr(order, 'status_history'):
                logger.info(f"La commande a {len(order.status_history)} entrées d'historique:")
                for i, history in enumerate(order.status_history):
                    logger.info(f"  Historique {i+1}:")
                    logger.info(f"    - id: {history.id}")
                    logger.info(f"    - status: {history.status}")
                    logger.info(f"    - created_at: {history.created_at}")
            else:
                logger.error("La commande n'a pas d'attribut 'status_history'")
            
            # Tester la sérialisation manuelle
            try:
                logger.info("Tentative de sérialisation manuelle...")
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
                if hasattr(order, 'order_items'):
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
                            logger.error(f"Erreur lors de la sérialisation de l'élément {item.id}: {str(item_error)}")
                            logger.error(traceback.format_exc())
                
                # Ajouter l'historique des statuts
                order_dict['status_history'] = []
                if hasattr(order, 'status_history'):
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
                            logger.error(f"Erreur lors de la sérialisation de l'historique {history.id}: {str(history_error)}")
                            logger.error(traceback.format_exc())
                
                # Tester la sérialisation JSON
                try:
                    json_data = json.dumps(order_dict)
                    logger.info("Sérialisation JSON réussie!")
                    logger.info(f"JSON: {json_data[:200]}...")
                except Exception as json_error:
                    logger.error(f"Erreur lors de la sérialisation JSON: {str(json_error)}")
                    logger.error(traceback.format_exc())
                    
                # Tester la méthode to_dict si elle existe
                if hasattr(order, 'to_dict'):
                    try:
                        logger.info("Tentative d'utilisation de la méthode to_dict()...")
                        order_dict_method = order.to_dict()
                        logger.info("Méthode to_dict() réussie!")
                        
                        # Tester la sérialisation JSON
                        try:
                            json_data = json.dumps(order_dict_method)
                            logger.info("Sérialisation JSON de to_dict() réussie!")
                            logger.info(f"JSON de to_dict(): {json_data[:200]}...")
                        except Exception as json_error:
                            logger.error(f"Erreur lors de la sérialisation JSON de to_dict(): {str(json_error)}")
                            logger.error(traceback.format_exc())
                    except Exception as to_dict_error:
                        logger.error(f"Erreur lors de l'appel de to_dict(): {str(to_dict_error)}")
                        logger.error(traceback.format_exc())
                else:
                    logger.error("La commande n'a pas de méthode to_dict()")
                    
            except Exception as serialization_error:
                logger.error(f"Erreur lors de la sérialisation manuelle: {str(serialization_error)}")
                logger.error(traceback.format_exc())
                
        except Exception as e:
            logger.error(f"Exception dans test_order_serialization: {str(e)}")
            logger.error(traceback.format_exc())

if __name__ == '__main__':
    test_order_serialization()