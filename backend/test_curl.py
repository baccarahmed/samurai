import subprocess
import json

def test_with_curl():
    # Étape 1: Obtenir un token d'authentification
    login_cmd = [
        'curl', '-s',
        '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', '{"email":"admin@samurai-nutrition.com","password":"admin123"}',
        'http://localhost:5000/api/auth/login'
    ]
    
    try:
        login_result = subprocess.run(login_cmd, capture_output=True, text=True, check=True)
        login_data = json.loads(login_result.stdout)
        token = login_data.get('token')
        
        if not token:
            print("Échec de l'authentification: Pas de token reçu")
            print(f"Réponse: {login_result.stdout}")
            return
            
        print(f"Authentification réussie, token obtenu")
        
        # Étape 2: Appeler la route des commandes avec le token
        orders_cmd = [
            'curl', '-v',  # Verbose pour voir les en-têtes
            '-H', f'Authorization: Bearer {token}',
            'http://localhost:5000/api/orders'
        ]
        
        orders_result = subprocess.run(orders_cmd, capture_output=True, text=True)
        
        print("\n=== HEADERS ET STATUT ===\n")
        print(orders_result.stderr)  # curl affiche les en-têtes dans stderr
        
        print("\n=== RÉPONSE ===\n")
        print(orders_result.stdout)
        
        # Essayer de parser la réponse JSON
        try:
            response_data = json.loads(orders_result.stdout)
            print("\n=== RÉPONSE PARSÉE ===\n")
            print(json.dumps(response_data, indent=2))
        except json.JSONDecodeError:
            print("\n=== IMPOSSIBLE DE PARSER LA RÉPONSE COMME JSON ===\n")
    
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'exécution de curl: {e}")
        print(f"Sortie: {e.stdout}")
        print(f"Erreur: {e.stderr}")
    except json.JSONDecodeError as e:
        print(f"Erreur lors du décodage JSON: {e}")

if __name__ == "__main__":
    test_with_curl()