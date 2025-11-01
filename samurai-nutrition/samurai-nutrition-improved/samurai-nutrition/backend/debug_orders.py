from src.main_fixed import app
from src.extensions import db
from src.models.order import Order, OrderItem, OrderStatusHistory
from src.models.user import User
from src.models.product import Product
from sqlalchemy import inspect
import traceback
import json

with app.app_context():
    # Vérifier les tables dans la base de données
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print('Tables dans la base de données:', tables)
    
    # Afficher les colonnes pour chaque table liée aux commandes
    for table_name in ['orders', 'order_items', 'order_status_history']:
        if table_name in tables:
            print(f"\nColonnes de la table {table_name}:")
            for column in inspector.get_columns(table_name):
                print(f"  - {column['name']} ({column['type']})")
    
    # Vérifier le nombre de commandes
    order_count = db.session.query(Order).count()
    print('\nNombre de commandes:', order_count)
    
    # Afficher les 3 premières commandes en détail
    if order_count > 0:
        print("\nDétail des 3 premières commandes:")
        orders = db.session.query(Order).limit(3).all()
        for order in orders:
            print(f"\nCommande ID: {order.id}")
            print(f"Numéro de commande: {order.order_number}")
            print(f"Utilisateur ID: {order.user_id}")
            print(f"Statut: {order.status}")
            print(f"Montant total: {order.total_amount}")
            print(f"Date de création: {order.created_at}")
            print(f"Nombre d'articles: {len(order.order_items)}")
            for item in order.order_items:
                product = db.session.query(Product).get(item.product_id)
                product_name = product.name if product else "Produit inconnu"
                print(f"  - {item.quantity}x {product_name} (ID: {item.product_id})")
            print(f"Historique des statuts:")
            for status in order.status_history:
                print(f"  - {status.status} le {status.created_at}")
    
    # Vérifier s'il y a des utilisateurs dans la base de données
    user_count = db.session.query(User).count()
    print(f"\nNombre d'utilisateurs: {user_count}")
    
    # Si des commandes existent, essayer d'en récupérer une et la convertir en dictionnaire
    if order_count > 0:
        try:
            # Récupérer toutes les commandes et tester la conversion en dictionnaire
            orders = db.session.query(Order).all()
            print(f'Nombre total de commandes récupérées: {len(orders)}')
            
            # Tester chaque commande
            for i, order in enumerate(orders):
                print(f'\nTest de la commande {i+1} (ID: {order.id}):')
                print(f'- Status: {order.status}')
                print(f'- Items: {len(order.order_items)}')
                print(f'- Historique: {len(order.status_history)}')
                
                # Vérifier les items de la commande
                for j, item in enumerate(order.order_items):
                    print(f'  - Item {j+1}: product_id={item.product_id}, quantity={item.quantity}')
                    try:
                        item_dict = item.to_dict()
                        print(f'    Conversion de l\'item en dictionnaire réussie')
                    except Exception as e:
                        print(f'    ERREUR lors de la conversion de l\'item en dictionnaire: {str(e)}')
                        traceback.print_exc()
                
                # Vérifier l'historique des statuts
                for j, status in enumerate(order.status_history):
                    print(f'  - Historique {j+1}: status={status.status}')
                    try:
                        status_dict = status.to_dict()
                        print(f'    Conversion de l\'historique en dictionnaire réussie')
                    except Exception as e:
                        print(f'    ERREUR lors de la conversion de l\'historique en dictionnaire: {str(e)}')
                        traceback.print_exc()
                
                # Tester la conversion de la commande complète
                try:
                    order_dict = order.to_dict()
                    print(f'Conversion de la commande {order.id} en dictionnaire réussie')
                except Exception as e:
                    print(f'ERREUR lors de la conversion de la commande {order.id} en dictionnaire: {str(e)}')
                    traceback.print_exc()
        except Exception as e:
            print('Erreur lors de la récupération des commandes:', str(e))
            traceback.print_exc()