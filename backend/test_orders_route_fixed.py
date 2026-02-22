import os
import sys
import logging
import json
from datetime import datetime

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Ajouter le répertoire parent au chemin de recherche Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importer les modules nécessaires
from src.main_fixed import app
from src.models.user import User
from src.extensions import db
from flask_jwt_extended import create_access_token

def test_orders_route():
    """Tester la route /api/orders après les corrections"""
    try:
        # Utiliser l'application Flask importée
        
        # Créer un contexte d'application
        with app.app_context():
            logger.info("Création d'un utilisateur admin pour le test")
            # Créer un utilisateur admin pour le test
            admin_user = User.query.filter_by(email="admin@example.com").first()
            if not admin_user:
                admin_user = User(
                    email="admin@example.com",
                    first_name="Admin",
                    last_name="User",
                    role="admin"
                )
                admin_user.set_password("password123")
                db.session.add(admin_user)
                db.session.commit()
                logger.info(f"Utilisateur admin créé avec ID: {admin_user.id}")
            else:
                logger.info(f"Utilisateur admin existant avec ID: {admin_user.id}")
            
            # Créer un token JWT pour l'utilisateur admin
            access_token = create_access_token(identity=admin_user.id)
            
            # Créer un client de test
            with app.test_client() as client:
                # Configurer l'en-tête d'autorisation avec le token JWT
                headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
                
                # Faire une requête GET à la route /api/orders
                logger.info("Envoi d'une requête GET à /api/orders")
                response = client.get('/api/orders', headers=headers)
                
                # Afficher les informations de la réponse
                logger.info(f"Code de statut: {response.status_code}")
                logger.info(f"En-têtes: {response.headers}")
                
                # Afficher le contenu JSON de la réponse
                if response.content_type == 'application/json':
                    try:
                        data = response.get_json()
                        logger.info(f"Contenu JSON: {json.dumps(data, indent=2)}")
                        
                        # Vérifier si la réponse contient des commandes
                        if 'orders' in data:
                            logger.info(f"Nombre de commandes: {len(data['orders'])}")
                            if len(data['orders']) > 0:
                                logger.info(f"Première commande: {json.dumps(data['orders'][0], indent=2)}")
                        else:
                            logger.info("Aucune commande trouvée dans la réponse")
                            
                        # Vérifier si la réponse contient des informations de pagination
                        if 'pagination' in data:
                            logger.info(f"Pagination: {json.dumps(data['pagination'], indent=2)}")
                    except Exception as e:
                        logger.error(f"Erreur lors de la lecture du JSON: {str(e)}")
                        logger.error(f"Contenu brut: {response.data}")
                else:
                    logger.info(f"Contenu non-JSON: {response.data}")
                
                return response.status_code
    except Exception as e:
        logger.error(f"Erreur lors du test: {str(e)}")
        import traceback
        traceback.print_exc()
        return 500

if __name__ == "__main__":
    status_code = test_orders_route()
    logger.info(f"Test terminé avec le code de statut: {status_code}")