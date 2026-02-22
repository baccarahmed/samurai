from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.models.user import User
from src.extensions import db
from src.models.user_history import UserHistory

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    """Decorator to require authentication token using Flask-JWT-Extended"""
    @jwt_required()
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            return jsonify({'message': 'Utilisateur non trouvé'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin():
            return jsonify({'message': 'Accès administrateur requis'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'Le champ {field} est requis'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Un utilisateur avec cet email existe déjà'}), 400
        
        # Create new user - CORRECTION: Fixer le rôle à 'user' pour éviter l'auto-promotion
        user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            role='user'  # Toujours 'user', jamais depuis data
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Generate token with Flask-JWT-Extended
        token = create_access_token(identity=user.id)
        
        # Enregistrer l'action dans l'historique
        UserHistory.log_action(
            user_id=user.id,
            action_type='register',
            action_description=f'Inscription de {user.first_name} {user.last_name}',
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        
        return jsonify({
            'message': 'Utilisateur créé avec succès',
            'token': token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e))  # Ajout de logging
        return jsonify({'message': 'Erreur lors de la création de l\'utilisateur'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        from main_fixed import db
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email et mot de passe requis'}), 400
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Email ou mot de passe incorrect'}), 401
        
        # Generate token
        token = user.generate_token(current_app.config['SECRET_KEY'])
        
        return jsonify({
            'message': 'Connexion réussie',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Erreur lors de la connexion'}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user information"""
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """Verify if token is valid"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'valid': False, 'message': 'Token manquant'}), 400
        
        # Verify token
        payload = User.verify_token(token, current_app.config['SECRET_KEY'])
        if payload is None:
            return jsonify({'valid': False, 'message': 'Token invalide'}), 401
        
        # Check if user still exists
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'valid': False, 'message': 'Utilisateur non trouvé'}), 401
        
        return jsonify({
            'valid': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'valid': False, 'message': 'Erreur lors de la vérification'}), 500

