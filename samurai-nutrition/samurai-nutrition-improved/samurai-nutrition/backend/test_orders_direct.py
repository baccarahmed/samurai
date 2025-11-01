from src.main_fixed import app
from src.extensions import db
import traceback
import json
import sys
from flask import Flask, request
from unittest.mock import patch, MagicMock

# Fonction pour tester directement la logique de récupération des commandes
def test_orders_direct():
    with app.app_context():
        try:
            # Importer les modules nécessaires
            print("Importing necessary modules...")
            try:
                from src.routes.orders import get_orders
                print("Successfully imported get_orders function")
            except ImportError as e:
                print(f"Error importing get_orders: {str(e)}")
                traceback.print_exc()
                return
                
            try:
                from src.models.order import Order
                from src.models.user import User
                print("Successfully imported Order and User models")
            except ImportError as e:
                print(f"Error importing models: {str(e)}")
                traceback.print_exc()
                
            # Check if the models are properly defined
            print(f"Order model attributes: {dir(Order)}")
            print(f"User model attributes: {dir(User)}")
            
            # Check if the database is properly set up
            try:
                print(f"Database tables: {db.metadata.tables.keys()}")
                order_count = Order.query.count()
                print(f"Number of orders in database: {order_count}")
            except Exception as e:
                print(f"Error accessing database: {str(e)}")
                traceback.print_exc()
            
            # Créer un contexte de requête simulé
            print("\nSetting up test request context...")
            with app.test_request_context('/api/orders', method='GET'):
                # Simuler un utilisateur authentifié avec des permissions admin
                print("Mocking JWT authentication...")
                with patch('flask_jwt_extended.view_decorators.verify_jwt_in_request'):
                    with patch('flask_jwt_extended.utils.get_jwt_identity', return_value=1):
                        with patch('flask_jwt_extended.utils.get_jwt', return_value={"sub": 1}):
                            # Vérifier si l'utilisateur existe
                            try:
                                admin_user = User.query.get(1)
                                if admin_user:
                                    print(f"Found admin user: {admin_user.email}, role: {admin_user.role}")
                                    print(f"Admin permissions: {admin_user.has_permission('view_orders') if hasattr(admin_user, 'has_permission') else 'has_permission method not found'}")
                                else:
                                    print("Warning: Admin user with ID 1 not found in database")
                            except Exception as e:
                                print(f"Error checking admin user: {str(e)}")
                                traceback.print_exc()
                        
                            # Appeler la fonction get_orders avec debug détaillé
                            print("\nCalling get_orders function...")
                            try:
                                # Ajouter des paramètres de requête
                                # Flask's request.args is an ImmutableMultiDict, not a regular dict
                                from werkzeug.datastructures import ImmutableMultiDict
                                request.args = ImmutableMultiDict([('page', '1'), ('per_page', '10')])
                                
                                # Appeler la fonction avec gestion d'erreur détaillée
                                try:
                                    response = get_orders()
                                    print("\nResponse from get_orders:")
                                    if isinstance(response, tuple):
                                        print(f"Status code: {response[1]}")
                                        print(f"Content: {response[0].data.decode('utf-8')}")
                                    else:
                                        print(f"Status code: 200")
                                        print(f"Content: {response.data.decode('utf-8')}")
                                except Exception as e:
                                    print(f"\nError calling get_orders: {str(e)}")
                                    print(f"Error type: {type(e).__name__}")
                                    print("\nDetailed traceback:")
                                    traceback.print_exc()
                                
                                    # Analyse détaillée de l'erreur
                                    print("\nDetailed error analysis:")
                                    try:
                                        # Vérifier si l'erreur est liée à la pagination
                                        if "paginate" in str(e).lower():
                                            print("Error appears to be related to pagination")
                                            try:
                                                # Tester la pagination directement
                                                orders = Order.query.all()
                                                print(f"Total orders in database: {len(orders)}")
                                                print(f"First order: {orders[0].to_dict() if orders and hasattr(orders[0], 'to_dict') else 'to_dict method not found'}")
                                            except Exception as db_err:
                                                print(f"Error testing pagination: {str(db_err)}")
                                        
                                        # Vérifier si l'erreur est liée à la sérialisation
                                        elif "json" in str(e).lower() or "dict" in str(e).lower() or "serial" in str(e).lower():
                                            print("Error appears to be related to serialization")
                                            try:
                                                # Tester la sérialisation directement
                                                orders = Order.query.limit(1).all()
                                                if orders:
                                                    print(f"Order attributes: {dir(orders[0])}")
                                                    if hasattr(orders[0], 'to_dict'):
                                                        try:
                                                            order_dict = orders[0].to_dict()
                                                            print(f"Order dict: {order_dict}")
                                                        except Exception as dict_err:
                                                            print(f"Error in to_dict method: {str(dict_err)}")
                                                            traceback.print_exc()
                                            except Exception as ser_err:
                                                print(f"Error testing serialization: {str(ser_err)}")
                                    except Exception as analysis_err:
                                        print(f"Error during error analysis: {str(analysis_err)}")
                            except Exception as outer_err:
                                print(f"Outer error in get_orders test: {str(outer_err)}")
                                traceback.print_exc()
        except Exception as e:
            print(f"\nErreur lors du test de la route: {str(e)}")
            traceback.print_exc()

# Exécuter le test
if __name__ == '__main__':
    test_orders_direct()