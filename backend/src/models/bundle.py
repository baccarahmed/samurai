from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from src.extensions import db


class Bundle(db.Model):
    __tablename__ = 'bundles'

    id = Column(Integer, primary_key=True)
    slug = Column(String(100), unique=True, nullable=False)  # public id used by frontend
    name = Column(String(255), nullable=False)
    description = Column(Text, default='')
    discount_percent = Column(Float, default=0.0)
    fixed_price = Column(Float, nullable=True)
    image_url = Column(String(512), nullable=True)
    items = Column(JSON, default=[])  # list of {category, keyword, productId?}

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.slug,
            'slug': self.slug,
            'name': self.name,
            'description': self.description,
            'discountPercent': self.discount_percent,
            'fixedPrice': self.fixed_price,
            'imageUrl': self.image_url,
            'items': self.items or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
