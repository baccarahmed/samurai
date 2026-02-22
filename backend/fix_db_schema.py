from src.extensions import db
from src.models.product import Product
from src.main_fixed import app
import json
from sqlalchemy import text

with app.app_context():
    # Vérifier si les colonnes existent déjà
    inspector = db.inspect(db.engine)
    columns = inspector.get_columns('products')
    column_names = [col['name'] for col in columns]
    
    # Afficher les colonnes existantes
    print("Colonnes existantes dans la table products:")
    print(column_names)
    
    # Vérifier si les nouvelles colonnes sont présentes
    missing_columns = []
    for col in ['product_benefits', 'directions', 'ingredients', 'nutrition_facts']:
        if col not in column_names:
            missing_columns.append(col)
    
    if missing_columns:
        print(f"Colonnes manquantes: {missing_columns}")
        print("Mise à jour du schéma de la base de données...")
        
        # Créer les nouvelles colonnes
        with db.engine.connect() as conn:
            for col in missing_columns:
                conn.execute(text(f"ALTER TABLE products ADD COLUMN {col} TEXT"))
                conn.commit()
        
        print("Schéma mis à jour avec succès.")
    else:
        print("Toutes les colonnes nécessaires sont présentes.")
    
    # Vérifier les données d'un produit
    product = Product.query.get(1)
    if product:
        print("\nDonnées du produit avant mise à jour:")
        print(f"ID: {product.id}, Nom: {product.name}")
        print(f"product_benefits: {product.product_benefits}")
        print(f"directions: {product.directions}")
        print(f"ingredients: {product.ingredients}")
        print(f"nutrition_facts: {product.nutrition_facts}")
        
        # Mettre à jour les valeurs nulles pour éviter les erreurs
        if product.product_benefits is None:
            product.product_benefits = "Avantages du produit non spécifiés"
        
        if product.directions is None:
            product.directions = "Mode d'emploi non spécifié"
        
        if product.ingredients is None:
            product.ingredients = "Ingrédients non spécifiés"
        
        if product.nutrition_facts is None:
            product.nutrition_facts = {}
        
        db.session.commit()
        
        print("\nDonnées du produit après mise à jour:")
        print(f"ID: {product.id}, Nom: {product.name}")
        print(f"product_benefits: {product.product_benefits}")
        print(f"directions: {product.directions}")
        print(f"ingredients: {product.ingredients}")
        print(f"nutrition_facts: {product.nutrition_facts}")
    else:
        print("Aucun produit trouvé avec l'ID 1.")