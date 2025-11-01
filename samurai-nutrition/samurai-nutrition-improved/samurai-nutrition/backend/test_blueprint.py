from src.main_fixed import app
from src.extensions import db
from flask import jsonify, request
import traceback
import json
import logging
from flask_jwt_extended import create_access_token

# Configuration du logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('test_blueprint')

def test_blueprint_registration():
    with app.app_context():
        try:
            # Vérifier les routes enregistrées dans l'application
            logger.info("Routes enregistrées dans l'application:")
            for rule in app.url_map.iter_rules():
                logger.info(f"  {rule} -> {rule.endpoint}")
            
            # Vérifier spécifiquement la route des commandes
            orders_route = None
            for rule in app.url_map.iter_rules():
                if str(rule) == '/api/orders' and 'GET' in rule.methods:
                    orders_route = rule
                    logger.info(f"Route des commandes trouvée: {rule} -> {rule.endpoint}")
                    break
            
            if not orders_route:
                logger.error("La route /api/orders n'est pas enregistrée!")
            
            # Vérifier si le Blueprint est correctement importé
            from src.routes.orders import orders_bp
            logger.info(f"Blueprint des commandes: {orders_bp.name}")
            logger.info(f"URL prefix du Blueprint: {orders_bp.url_prefix}")
            
            # Vérifier les routes du Blueprint
            logger.info("Routes dans le Blueprint des commandes:")
            for rule in orders_bp.deferred_functions:
                logger.info(f"  {rule}")
            
            return {"success": True, "message": "Vérification des routes terminée"}
                
        except Exception as e:
            logger.error(f"Erreur: {str(e)}")
            logger.error(traceback.format_exc())
            return {"error": str(e)}

if __name__ == '__main__':
    logger.info("=== TEST DE L'ENREGISTREMENT DES ROUTES ===")
    test_blueprint_registration()