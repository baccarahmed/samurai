from src.main_fixed import app
from src.extensions import db
from src.models.order import Order, OrderItem, OrderStatusHistory
from src.models.user import User
from src.models.product import Product
from sqlalchemy import inspect
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
    
    # Afficher les 5 premières commandes en détail
    if order_count > 0:
        print("\nDétail des 5 premières commandes:")
        orders = db.session.query(Order).limit(5).all()
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
    if user_count > 0:
        print("\nDétail des 3 premiers utilisateurs:")
        users = db.session.query(User).limit(3).all()
        for user in users:
            print(f"\nUtilisateur ID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Rôle: {user.role}")
            print(f"Date de création: {user.created_at}")
    
    # Vérifier s'il y a des produits dans la base de données
    product_count = db.session.query(Product).count()
    print(f"\nNombre de produits: {product_count}")
    if product_count > 0:
        print("\nDétail des 3 premiers produits:")
        products = db.session.query(Product).limit(3).all()
        for product in products:
            print(f"\nProduit ID: {product.id}")
            print(f"Nom: {product.name}")
            print(f"Prix: {product.price}")
            print(f"Stock quantity: {product.stock_quantity}")