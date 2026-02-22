from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from src.extensions import db
from src.models.bundle import Bundle
from src.routes.admin import require_admin

bundles_bp = Blueprint('bundles', __name__)

@bundles_bp.route('/bundles', methods=['GET'])
def list_bundles():
    try:
        db.create_all()
        bundles = Bundle.query.order_by(Bundle.created_at.asc()).all()
        return jsonify([b.to_dict() for b in bundles]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bundles_bp.route('/admin/bundles', methods=['POST'])
@jwt_required()
@require_admin()
def create_bundle():
    try:
        data = request.get_json() or {}
        slug = (data.get('id') or data.get('slug') or data.get('name', '')).strip().lower().replace(' ', '-')
        if not slug:
            return jsonify({'error': 'slug or name required'}), 400
        existing = Bundle.query.filter_by(slug=slug).first()
        if existing:
            return jsonify({'error': 'Bundle with this slug already exists'}), 409
        fixed_price = data.get('fixedPrice')
        fixed_price_value = float(fixed_price) if fixed_price not in (None, '',) else None
        bundle = Bundle(
            slug=slug,
            name=data.get('name', slug),
            description=data.get('description', ''),
            discount_percent=float(data.get('discountPercent') or 0),
            fixed_price=fixed_price_value,
            image_url=data.get('imageUrl'),
            items=data.get('items') or []
        )
        db.session.add(bundle)
        db.session.commit()
        return jsonify(bundle.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bundles_bp.route('/admin/bundles/<string:slug>', methods=['PUT'])
@jwt_required()
@require_admin()
def update_bundle(slug):
    try:
        bundle = Bundle.query.filter_by(slug=slug).first()
        if not bundle:
            return jsonify({'error': 'Bundle not found'}), 404
        data = request.get_json() or {}
        bundle.name = data.get('name', bundle.name)
        bundle.description = data.get('description', bundle.description)
        if 'discountPercent' in data:
            bundle.discount_percent = float(data.get('discountPercent') or 0)
        if 'fixedPrice' in data:
            fixed_price = data.get('fixedPrice')
            bundle.fixed_price = float(fixed_price) if fixed_price not in (None, '',) else None
        if 'imageUrl' in data:
            bundle.image_url = data.get('imageUrl')
        if 'items' in data:
            bundle.items = data.get('items') or []
        db.session.commit()
        return jsonify(bundle.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bundles_bp.route('/admin/bundles/<string:slug>', methods=['DELETE'])
@jwt_required()
@require_admin()
def delete_bundle(slug):
    try:
        bundle = Bundle.query.filter_by(slug=slug).first()
        if not bundle:
            return jsonify({'error': 'Bundle not found'}), 404
        db.session.delete(bundle)
        db.session.commit()
        return jsonify({'message': 'Bundle deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
