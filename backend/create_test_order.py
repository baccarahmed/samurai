from src.main_fixed import app, db
from src.models.user import User
from src.models.order import Order, OrderItem
from src.models.product import Product
import datetime

def create_test_order():
    with app.app_context():
        # Récupérer l'utilisateur John
        user = User.query.filter_by(email='john@example.com').first()
        
        if not user:
            print("Utilisateur john@example.com non trouvé")
            return
        
        # Récupérer un produit pour la commande
        product = Product.query.first()
        
        if not product:
            print("Aucun produit trouvé dans la base de données")
            return
        
        # Créer une commande
        order = Order(
            user_id=user.id,
            status="pending",
            order_number=f"TEST-{user.id}-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}",
            total_amount=product.price * 2,
            created_at=datetime.datetime.now(),
            shipping_address="123 Test Street, Test City, 12345, Test Country",
            billing_address="123 Test Street, Test City, 12345, Test Country",
            payment_method="card"
        )
        
        db.session.add(order)
        db.session.flush()  # Pour obtenir l'ID de la commande
        
        # Ajouter un article à la commande
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            product_sku=product.sku if hasattr(product, 'sku') else 'SKU-' + str(product.id),
            quantity=2,
            unit_price=product.price,
            total_price=product.price * 2
        )
        
        db.session.add(order_item)
        db.session.commit()
        
        print(f"Commande créée pour {user.first_name} {user.last_name} avec ID: {order.id}")
        print(f"Montant total: {order.total_amount}")

if __name__ == "__main__":
    create_test_order()