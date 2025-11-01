#!/usr/bin/env python3
"""
Script d'initialisation de la base de données
"""

import sys
import os
from src.main_fixed import app, db  # Updated import
from src.models.user import User
from src.models.product import Product
from src.models.wishlist_cart import Wishlist, WishlistItem, Cart, CartItem
from src.models.user_history import UserHistory
from werkzeug.security import generate_password_hash

def init_database():
    # No need to create app since we're importing it directly
    with app.app_context():
        # Supprimer et recréer toutes les tables
        db.drop_all()
        db.create_all()
        print("🗄️ Base de données initialisée")

        # Créer un utilisateur admin
        admin_user = User(
            email='admin@samurai-nutrition.com',
            first_name='Admin',
            last_name='Samurai',
            role='admin'
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)

        # Créer un utilisateur client de test
        client_user = User(
            email='client@test.com',
            first_name='John',
            last_name='Doe',
            role='user'
        )
        client_user.set_password('client123')
        db.session.add(client_user)

        # Commiter les utilisateurs d'abord
        db.session.commit()

        # Créer des produits
        products = [
            Product(
                name='Elite Whey Protein',
                description='Protéine de lactosérum de haute qualité pour la construction musculaire',
                price=49.99,
                category='Protéines',
                image_url='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400',
                stock_quantity=100,
                is_active=True
            ),
            Product(
                name='Pre-Workout Ignite',
                description='Formule pré-entraînement pour maximiser vos performances',
                price=39.99,
                category='Pré-entraînement',
                image_url='https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&w=400',
                stock_quantity=75,
                is_active=True
            ),
            Product(
                name='Recovery Matrix',
                description='Complexe de récupération post-entraînement',
                price=34.99,
                category='Récupération',
                image_url='https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&w=400',
                stock_quantity=50,
                is_active=True
            ),
            Product(
                name='Creatine Monohydrate',
                description='Créatine pure pour augmenter la force et la puissance',
                price=24.99,
                category='Performance',
                image_url='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400',
                stock_quantity=120,
                is_active=True
            ),
            Product(
                name='BCAA Complex',
                description='Acides aminés branchés pour la récupération musculaire',
                price=29.99,
                category='Aminos',
                image_url='https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&w=400',
                stock_quantity=80,
                is_active=True
            )
        ]

        for product in products:
            db.session.add(product)

        # Commiter les produits
        db.session.commit()
        print("👥 Utilisateurs créés")
        print("📦 Produits créés")

        # Créer des wishlists et paniers pour les utilisateurs
        admin_wishlist = Wishlist(user_id=admin_user.id)
        admin_cart = Cart(user_id=admin_user.id)
        client_wishlist = Wishlist(user_id=client_user.id)
        client_cart = Cart(user_id=client_user.id)

        db.session.add(admin_wishlist)
        db.session.add(admin_cart)
        db.session.add(client_wishlist)
        db.session.add(client_cart)

        # Commiter les wishlists et paniers
        db.session.commit()

        # Ajouter quelques produits aux wishlists et paniers
        wishlist_items = [
            WishlistItem(wishlist_id=client_wishlist.id, product_id=1),
            WishlistItem(wishlist_id=client_wishlist.id, product_id=2),
            WishlistItem(wishlist_id=client_wishlist.id, product_id=3)
        ]

        cart_items = [
            CartItem(cart_id=client_cart.id, product_id=1, quantity=2),
            CartItem(cart_id=client_cart.id, product_id=2, quantity=1)
        ]

        for item in wishlist_items:
            db.session.add(item)
        for item in cart_items:
            db.session.add(item)

        # Commiter les items
        db.session.commit()

        # Créer quelques entrées d'historique
        history_entries = [
            UserHistory(
                user_id=client_user.id,
                action_type='register',
                action_description='Inscription de John Doe',
                ip_address='127.0.0.1'
            ),
            UserHistory(
                user_id=client_user.id,
                action_type='login',
                action_description='Connexion de John Doe',
                ip_address='127.0.0.1'
            ),
            UserHistory(
                user_id=client_user.id,
                action_type='add_to_wishlist',
                action_description='Ajouté Elite Whey Protein à la wishlist',
                product_id=1,
                ip_address='127.0.0.1'
            ),
            UserHistory(
                user_id=client_user.id,
                action_type='add_to_cart',
                action_description='Ajouté Elite Whey Protein au panier',
                product_id=1,
                ip_address='127.0.0.1'
            )
        ]

        for entry in history_entries:
            db.session.add(entry)

        # Commiter l'historique
        db.session.commit()
        print("🛒 Wishlists et paniers créés")
        print("📊 Historique utilisateur créé")
        print("🎉 Base de données initialisée avec succès!")

if __name__ == '__main__':
    init_database()