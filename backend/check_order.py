from src.extensions import db
from src.models.order import Order
from flask import Flask
import os

# Initialisation de l'application Flask
app = Flask(__name__)

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///nutrition.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialisation des extensions
db.init_app(app)

def check_order(order_id):
    """Vérifier si une commande existe dans la base de données"""
    with app.app_context():
        order = Order.query.get(order_id)
        if order:
            print(f"✅ La commande {order_id} existe dans la base de données")
            print(f"   - Utilisateur: {order.user_id}")
            print(f"   - Statut: {order.status}")
            print(f"   - Date: {order.created_at}")
            print(f"   - Nombre d'articles: {len(order.order_items)}")
        else:
            print(f"❌ La commande {order_id} n'existe pas dans la base de données")

if __name__ == "__main__":
    # Vérifier la commande avec l'ID 35
    check_order(35)
    
    # Vérifier également quelques autres IDs pour voir si d'autres commandes existent
    for i in range(1, 5):
        check_order(i)