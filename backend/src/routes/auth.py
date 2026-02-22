from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, decode_token
from src.models.user import User
from src.models.user_history import UserHistory
from src.extensions import db
from functools import wraps

auth_bp = Blueprint("auth_bp", __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            return jsonify({'message': 'Utilisateur non trouvé'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not email or not password or not first_name or not last_name:
        return jsonify({'message': 'Tous les champs sont requis'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Cet email est déjà utilisé'}), 409

    user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role='user'
    )
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()

    # Enregistrer l'action dans l'historique
    UserHistory.log_action(
        user_id=user.id,
        action_type='register',
        action_description=f'Inscription de {first_name} {last_name}',
        ip_address=request.remote_addr,
        user_agent=request.headers.get('User-Agent')
    )

    token = create_access_token(identity=user.id)
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role
        }
    }), 201

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email et mot de passe requis'}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        token = create_access_token(identity=user.id)
        
        # Enregistrer l'action dans l'historique
        UserHistory.log_action(
            user_id=user.id,
            action_type='login',
            action_description=f'Connexion de {user.first_name} {user.last_name}',
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        }), 200
    else:
        return jsonify({'message': 'Email ou mot de passe incorrect'}), 401

@auth_bp.route('/auth/verify-token', methods=['POST'])
def verify_token():
    data = request.get_json()
    token = data.get('token')

    if not token:
        print("Token missing in request")
        return jsonify({'message': 'Token requis'}), 400

    try:
        # Print token for debugging (remove in production)
        print(f"Verifying token: {token[:10]}...")
        
        # Use jwt_required decorator's internal functions instead
        from flask_jwt_extended import decode_token, get_jwt_identity
        payload = decode_token(token)
        user_id = payload['sub']
        
        print(f"Token decoded successfully, user_id: {user_id}")
        user = User.query.get(user_id)
        
        if not user:
            print(f"User not found for ID: {user_id}")
            return jsonify({'message': 'Utilisateur non trouvé'}), 401

        return jsonify({
            'valid': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        }), 200
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        return jsonify({'message': 'Token invalide', 'error': str(e)}), 401

