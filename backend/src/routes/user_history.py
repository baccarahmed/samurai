from flask import Blueprint, request, jsonify
from src.models.user_history import UserHistory
from src.routes.auth import token_required
from src.extensions import db

user_history_bp = Blueprint("user_history_bp", __name__)

@user_history_bp.route("/user/history", methods=["GET"])
@token_required
def get_user_history(current_user):
    """Récupérer l'historique d'un utilisateur"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        action_type = request.args.get('action_type', None)
        
        query = UserHistory.query.filter_by(user_id=current_user.id)
        
        if action_type:
            query = query.filter_by(action_type=action_type)
        
        history = query.order_by(UserHistory.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'history': [item.to_dict() for item in history.items],
            'total': history.total,
            'pages': history.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_history_bp.route("/user/history/stats", methods=["GET"])
@token_required
def get_user_history_stats(current_user):
    """Récupérer les statistiques de l'historique utilisateur"""
    try:
        from sqlalchemy import func
        
        # Statistiques par type d'action
        action_stats = db.session.query(
            UserHistory.action_type,
            func.count(UserHistory.id).label('count')
        ).filter_by(user_id=current_user.id).group_by(UserHistory.action_type).all()
        
        # Actions récentes (7 derniers jours)
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_actions = UserHistory.query.filter_by(user_id=current_user.id).filter(
            UserHistory.created_at >= week_ago
        ).count()
        
        # Total des actions
        total_actions = UserHistory.query.filter_by(user_id=current_user.id).count()
        
        return jsonify({
            'action_stats': [{'action_type': stat.action_type, 'count': stat.count} for stat in action_stats],
            'recent_actions': recent_actions,
            'total_actions': total_actions
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_history_bp.route("/user/history/clear", methods=["DELETE"])
@token_required
def clear_user_history(current_user):
    """Effacer l'historique d'un utilisateur"""
    try:
        UserHistory.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return jsonify({'message': 'Historique effacé avec succès'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 