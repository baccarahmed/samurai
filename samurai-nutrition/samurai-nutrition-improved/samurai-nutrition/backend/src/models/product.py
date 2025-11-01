from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from src.extensions import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    original_price = Column(DECIMAL(10, 2))
    image_url = Column(String(500))
    category = Column(String(100))
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=10)
    sku = Column(String(100), unique=True)
    weight = Column(DECIMAL(8, 2))
    dimensions = Column(String(100))
    # Fix the default value to use a string or float instead of DECIMAL object
    rating = Column(DECIMAL(3, 2), default=0.0)  # Changed from DECIMAL('0.0') to 0.0
    review_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    featured = Column(Boolean, default=False)
    
    # Nouveaux champs pour les sections détaillées
    product_benefits = Column(Text)  # Liste des avantages du produit
    directions = Column(Text)  # Mode d'emploi
    ingredients = Column(Text)  # Liste des ingrédients
    nutrition_facts = Column(JSON)  # Informations nutritionnelles au format JSON
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    order_items = relationship("OrderItem")
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price) if self.price else 0.0,
            'original_price': float(self.original_price) if self.original_price else None,
            'image_url': self.image_url,
            'category': self.category,
            'stock_quantity': self.stock_quantity,
            'low_stock_threshold': self.low_stock_threshold,
            'sku': self.sku,
            'weight': float(self.weight) if self.weight else None,
            'dimensions': self.dimensions,
            'rating': float(self.rating) if self.rating else 0.0,
            'review_count': self.review_count,
            'is_active': self.is_active,
            'featured': self.featured,
            'product_benefits': self.product_benefits,
            'directions': self.directions,
            'ingredients': self.ingredients,
            'nutrition_facts': self.nutrition_facts,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def is_in_stock(self, quantity=1):
        """Vérifie si le produit est en stock pour la quantité demandée"""
        return self.is_active and self.stock_quantity >= quantity
    
    def is_low_stock(self):
        """Vérifie si le produit est en stock faible"""
        return self.stock_quantity <= self.low_stock_threshold
    
    def update_stock(self, quantity_change):
        """Met à jour le stock du produit"""
        self.stock_quantity += quantity_change
        self.updated_at = datetime.utcnow()
        return self
    
    def reserve_stock(self, quantity):
        """Réserve du stock pour une commande"""
        if self.is_in_stock(quantity):
            self.stock_quantity -= quantity
            self.updated_at = datetime.utcnow()
            return True
        return False
    
    def calculate_discount_percentage(self):
        """Calcule le pourcentage de réduction"""
        if self.original_price and self.original_price > self.price:
            return round(((self.original_price - self.price) / self.original_price) * 100, 2)
        return 0

