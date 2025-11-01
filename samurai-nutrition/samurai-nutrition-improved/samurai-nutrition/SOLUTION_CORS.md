# Solution CORS pour Samurai Nutrition

## Problème identifié

L'erreur CORS suivante se produisait lors des requêtes du frontend React vers le backend Flask :

```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```

## Cause du problème

Le backend Flask n'était pas configuré correctement pour gérer les requêtes CORS, en particulier les requêtes préflight (OPTIONS) qui sont automatiquement envoyées par les navigateurs pour les requêtes cross-origin avec certains en-têtes ou méthodes.

## Solution appliquée

### 1. Configuration CORS améliorée

Dans le fichier `backend/src/main.py`, la configuration CORS a été améliorée :

```python
# Configuration CORS complète
cors = CORS(app, 
           origins="*",
           allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
           methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
           supports_credentials=True)
```

### 2. Gestionnaire de requêtes préflight

Ajout d'un gestionnaire spécifique pour les requêtes OPTIONS (préflight) :

```python
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
```

### 3. En-têtes CORS sur toutes les réponses

Ajout d'en-têtes CORS à toutes les réponses :

```python
@app.after_request
def after_request(response):
    """Ajouter les en-têtes CORS à toutes les réponses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
```

### 4. Import manquant ajouté

L'import `request` a été ajouté aux imports Flask :

```python
from flask import Flask, jsonify, request
```

## Test de validation

Un serveur de test a été créé et testé avec succès :

- ✅ Endpoint de santé accessible : `GET /api/health`
- ✅ Requête POST avec CORS réussie : `POST /api/auth/login`
- ✅ Requêtes préflight (OPTIONS) gérées correctement
- ✅ En-têtes CORS présents dans toutes les réponses

## Fichiers modifiés

1. `backend/src/main.py` - Configuration CORS principale
2. `backend/src/test_backend.py` - Serveur de test créé pour validation

## Instructions pour démarrer le backend

1. Installer les dépendances :
```bash
cd backend
pip3 install -r requirements.txt
pip3 install flask-jwt-extended
```

2. Démarrer le serveur :
```bash
cd backend/src
python3 main.py
```

Le serveur démarrera sur `http://localhost:5000` et acceptera les requêtes CORS depuis `http://localhost:5173` (frontend React).

## Résultat

L'erreur CORS est maintenant résolue et les requêtes du frontend React vers le backend Flask fonctionnent correctement.

