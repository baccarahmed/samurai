from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# Configuration CORS complète
cors = CORS(app, 
           origins="*",
           allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
           methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
           supports_credentials=True)

@app.before_request
def handle_preflight():
    """Gérer les requêtes preflight CORS"""
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', "true")
        return response

@app.after_request
def after_request(response):
    """Ajouter les en-têtes CORS à toutes les réponses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    """Test endpoint pour login"""
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.get_json() or {}
    return jsonify({
        'message': 'Test login endpoint',
        'data': data,
        'status': 'success'
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'healthy', 'cors': 'enabled'})

if __name__ == '__main__':
    print("🚀 Serveur de test CORS démarré sur http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
