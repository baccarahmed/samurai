#!/usr/bin/env python3
"""
Script de migration de base de données pour Samurai Nutrition
Ajoute les nouvelles tables et colonnes pour la gestion des commandes et l'administration
"""

import os
import sys
from datetime import datetime
from sqlalchemy import text

# Ajouter le répertoire backend au path pour les imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.main_fixed import app
from src.extensions import db
from src.models.user import User
from src.models.product import Product
from src.models.order import Order, OrderItem, OrderStatusHistory, AdminLog

def backup_database():
    """Crée une sauvegarde de la base de données actuelle"""
    import shutil
    db_path = 'nutrition.db'
    if os.path.exists(db_path):
        backup_path = f'nutrition_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
        shutil.copy2(db_path, backup_path)
        print(f"✅ Sauvegarde créée: {backup_path}")
        return backup_path
    return None

def check_table_exists(table_name):
    """Vérifie si une table existe"""
    result = db.session.execute(text(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=:table_name"
    ), {'table_name': table_name})
    return result.fetchone() is not None

def check_column_exists(table_name, column_name):
    """Vérifie si une colonne existe dans une table"""
    result = db.session.execute(text(f"PRAGMA table_info({table_name})"))
    columns = [row[1] for row in result.fetchall()]
    return column_name in columns

def add_column_if_not_exists(table_name, column_name, column_definition):
    """Ajoute une colonne si elle n'existe pas"""
    if not check_column_exists(table_name, column_name):
        try:
            db.session.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"))
            db.session.commit()
            print(f"✅ Colonne {column_name} ajoutée à {table_name}")
        except Exception as e:
            print(f"❌ Erreur lors de l'ajout de {column_name} à {table_name}: {e}")
            db.session.rollback()
    else:
        print(f"ℹ️  Colonne {column_name} existe déjà dans {table_name}")

def migrate_users_table():
    """Migre la table users avec les nouveaux champs"""
    print("\n🔄 Migration de la table users...")
    
    # Ajouter les nouvelles colonnes
    new_columns = [
        ('role', 'VARCHAR(20) DEFAULT "customer"'),
        ('phone', 'VARCHAR(20)'),
        ('address', 'TEXT'),
        ('city', 'VARCHAR(100)'),
        ('postal_code', 'VARCHAR(20)'),
        ('country', 'VARCHAR(100)'),
        ('last_login', 'TIMESTAMP'),
        ('is_active', 'BOOLEAN DEFAULT TRUE'),
        ('updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    ]
    
    for column_name, column_def in new_columns:
        add_column_if_not_exists('users', column_name, column_def)

def migrate_products_table():
    """Migre la table products avec les nouveaux champs"""
    print("\n🔄 Migration de la table products...")
    
    # Ajouter les nouvelles colonnes
    new_columns = [
        ('original_price', 'DECIMAL(10,2)'),
        ('low_stock_threshold', 'INTEGER DEFAULT 10'),
        ('sku', 'VARCHAR(100) UNIQUE'),
        ('weight', 'DECIMAL(8,2)'),
        ('dimensions', 'VARCHAR(100)'),
        ('rating', 'DECIMAL(3,2) DEFAULT 0.0'),
        ('review_count', 'INTEGER DEFAULT 0'),
        ('featured', 'BOOLEAN DEFAULT FALSE'),
        ('updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    ]
    
    for column_name, column_def in new_columns:
        add_column_if_not_exists('products', column_name, column_def)

def migrate_bundles_table():
    """Migre la table bundles pour ajouter les nouveaux champs"""
    print("\n🔄 Migration de la table bundles...")
    add_column_if_not_exists('bundles', 'fixed_price', 'DECIMAL(10,2)')
    add_column_if_not_exists('bundles', 'image_url', 'VARCHAR(512)')

def create_new_tables():
    """Crée les nouvelles tables"""
    print("\n🔄 Création des nouvelles tables...")
    
    try:
        # Créer toutes les tables définies dans les modèles
        db.create_all()
        print("✅ Toutes les tables ont été créées/mises à jour")
    except Exception as e:
        print(f"❌ Erreur lors de la création des tables: {e}")
        db.session.rollback()

def create_admin_user():
    """Crée un utilisateur administrateur par défaut"""
    print("\n🔄 Création de l'utilisateur administrateur...")
    
    admin_email = "admin@samurai-nutrition.com"
    existing_admin = User.query.filter_by(email=admin_email).first()
    
    if not existing_admin:
        admin_user = User(
            first_name="Admin",
            last_name="Samurai",
            email=admin_email,
            role="admin",
            is_active=True
        )
        admin_user.set_password("admin123")  # Mot de passe temporaire
        
        try:
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Utilisateur admin créé: {admin_email} / admin123")
            print("⚠️  IMPORTANT: Changez le mot de passe après la première connexion!")
        except Exception as e:
            print(f"❌ Erreur lors de la création de l'admin: {e}")
            db.session.rollback()
    else:
        # Mettre à jour le rôle si nécessaire
        if existing_admin.role != 'admin':
            existing_admin.role = 'admin'
            db.session.commit()
            print(f"✅ Rôle admin mis à jour pour: {admin_email}")
        else:
            print(f"ℹ️  Utilisateur admin existe déjà: {admin_email}")

def update_existing_products():
    """Met à jour les produits existants avec des SKU"""
    print("\n🔄 Mise à jour des produits existants...")
    
    products = Product.query.filter_by(sku=None).all()
    for i, product in enumerate(products, 1):
        if not product.sku:
            product.sku = f"SN{product.id:06d}"
            if not product.stock_quantity:
                product.stock_quantity = 100  # Stock par défaut
        
    try:
        db.session.commit()
        print(f"✅ {len(products)} produits mis à jour avec des SKU")
    except Exception as e:
        print(f"❌ Erreur lors de la mise à jour des produits: {e}")
        db.session.rollback()

def verify_migration():
    """Vérifie que la migration s'est bien déroulée"""
    print("\n🔍 Vérification de la migration...")
    
    # Vérifier les tables
    tables_to_check = ['users', 'products', 'orders', 'order_items', 'order_status_history', 'admin_logs']
    for table in tables_to_check:
        if check_table_exists(table):
            print(f"✅ Table {table} existe")
        else:
            print(f"❌ Table {table} manquante")
    
    # Vérifier quelques colonnes clés
    key_columns = [
        ('users', 'role'),
        ('users', 'is_active'),
        ('products', 'sku'),
        ('products', 'stock_quantity'),
        ('orders', 'order_number'),
        ('order_items', 'product_name')
    ]
    
    for table, column in key_columns:
        if check_column_exists(table, column):
            print(f"✅ Colonne {table}.{column} existe")
        else:
            print(f"❌ Colonne {table}.{column} manquante")
    
    # Compter les enregistrements
    try:
        user_count = User.query.count()
        product_count = Product.query.count()
        order_count = Order.query.count()
        
        print(f"\n📊 Statistiques:")
        print(f"   - Utilisateurs: {user_count}")
        print(f"   - Produits: {product_count}")
        print(f"   - Commandes: {order_count}")
        
    except Exception as e:
        print(f"❌ Erreur lors du comptage: {e}")

def main():
    """Fonction principale de migration"""
    print("🚀 Début de la migration de base de données Samurai Nutrition")
    print("=" * 60)
    
    with app.app_context():
        try:
            # 1. Sauvegarde
            backup_path = backup_database()
            
            # 2. Migration des tables existantes
            migrate_users_table()
            migrate_products_table()
            migrate_bundles_table()
            
            # 3. Création des nouvelles tables
            create_new_tables()
            
            # 4. Création de l'utilisateur admin
            create_admin_user()
            
            # 5. Mise à jour des données existantes
            update_existing_products()
            
            # 6. Vérification
            verify_migration()
            
            print("\n" + "=" * 60)
            print("✅ Migration terminée avec succès!")
            print("\n📝 Prochaines étapes:")
            print("   1. Testez l'application")
            print("   2. Changez le mot de passe admin")
            print("   3. Configurez les produits avec des stocks")
            
            if backup_path:
                print(f"   4. Supprimez la sauvegarde si tout fonctionne: {backup_path}")
            
        except Exception as e:
            print(f"\n❌ Erreur critique lors de la migration: {e}")
            print("🔄 Restaurez la sauvegarde si nécessaire")
            return 1
    
    return 0

def add_columns_to_order_items():
    try:
        # Vérifier si la colonne product_name existe déjà
        db.session.execute(text("SELECT product_name FROM order_items LIMIT 1"))
        print("La colonne product_name existe déjà")
    except Exception:
        # Ajouter la colonne product_name
        db.session.execute(text("ALTER TABLE order_items ADD COLUMN product_name VARCHAR(255) DEFAULT 'Unknown Product' NOT NULL"))
        print("Colonne product_name ajoutée")
    
    try:
        # Vérifier si la colonne product_sku existe déjà
        db.session.execute(text("SELECT product_sku FROM order_items LIMIT 1"))
        print("La colonne product_sku existe déjà")
    except Exception:
        # Ajouter la colonne product_sku
        db.session.execute(text("ALTER TABLE order_items ADD COLUMN product_sku VARCHAR(50) DEFAULT 'Unknown SKU' NOT NULL"))
        print("Colonne product_sku ajoutée")
    
    db.session.commit()
    print("Migration terminée avec succès")

def add_created_by_to_order_status_history():
    try:
        # Vérifier si la colonne created_by existe déjà
        db.session.execute(text("SELECT created_by FROM order_status_history LIMIT 1"))
        print("La colonne created_by existe déjà dans order_status_history")
    except Exception:
        # Ajouter la colonne created_by
        db.session.execute(text("ALTER TABLE order_status_history ADD COLUMN created_by INTEGER REFERENCES users(id)"))
        print("Colonne created_by ajoutée à order_status_history")
    
    db.session.commit()
    print("Migration de order_status_history terminée avec succès")

if __name__ == "__main__":
    with app.app_context():
        add_columns_to_order_items()
        add_created_by_to_order_status_history()  # Ajoutez cette ligne
    exit_code = main()
    sys.exit(exit_code)
