#!/usr/bin/env python3
"""
Script d'initialisation des données pour Samurai Nutrition
"""

import sys
import os

# Ajouter le répertoire courant au PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.main_fixed import app, db  # Updated import
from src.models.user import User
from src.models.product import Product

def create_sample_data():
    """Créer des données d'exemple pour le développement"""
    try:
        # Vérifier si des données existent déjà
        if User.query.count() > 0:
            print("Des données existent déjà, initialisation ignorée.")
            return
        
        print("Création des données d'exemple...")
        
        # Créer un utilisateur admin
        admin = User(
            first_name="Admin",
            last_name="Samurai",
            email="admin@samurai-nutrition.com",
            role="admin",
            is_active=True
        )
        admin.set_password("admin123")
        db.session.add(admin)
        
        # Créer un utilisateur client
        client = User(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            role="customer",
            is_active=True
        )
        client.set_password("password123")
        db.session.add(client)
        
        # Créer des produits d'exemple
        products_data = [
            {
                'name': 'Whey Protein Isolate',
                'description': 'Protéine de lactosérum isolée de haute qualité',
                'price': 49.99,
                'original_price': 59.99,
                'category': 'Protéines',
                'stock_quantity': 100,
                'sku': 'WPI001',
                'weight': 2.0,
                'featured': True,
                'image_url': '/images/whey-protein.jpg'
            },
            {
                'name': 'Créatine Monohydrate',
                'description': 'Créatine pure pour améliorer les performances',
                'price': 24.99,
                'category': 'Performance',
                'stock_quantity': 150,
                'sku': 'CRE001',
                'weight': 0.5,
                'image_url': '/images/creatine.jpg'
            },
            {
                'name': 'BCAA 2:1:1',
                'description': 'Acides aminés ramifiés pour la récupération',
                'price': 34.99,
                'category': 'Récupération',
                'stock_quantity': 75,
                'sku': 'BCAA001',
                'weight': 0.4,
                'image_url': '/images/bcaa.jpg'
            },
            {
                'name': 'Pre-Workout Energy',
                'description': 'Booster d\'énergie avant l\'entraînement',
                'price': 39.99,
                'category': 'Pre-Workout',
                'stock_quantity': 50,
                'sku': 'PWO001',
                'weight': 0.3,
                'featured': True,
                'image_url': '/images/pre-workout.jpg'
            },
            {
                'name': 'Multivitamines Sport',
                'description': 'Complexe vitaminique pour sportifs',
                'price': 19.99,
                'category': 'Vitamines',
                'stock_quantity': 200,
                'sku': 'VIT001',
                'weight': 0.2,
                'image_url': '/images/multivitamines.jpg'
            }
        ]
        
        for product_data in products_data:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print("✅ Données d'exemple créées avec succès!")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des données d'exemple: {e}")
        db.session.rollback()

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        # Créer les tables
        db.create_all()
        print("✅ Tables créées avec succès!")
        
        # Créer des données d'exemple
        create_sample_data()
        
        print("\n🎉 Initialisation terminée!")
        print("👤 Compte admin: admin@samurai-nutrition.com / admin123")
        print("👤 Compte client: john@example.com / password123")