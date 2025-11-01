# Guide de Déploiement Local - Application Samurai Nutrition

## 📋 Vue d'ensemble

Cette application est une plateforme e-commerce complète pour la nutrition sportive, composée de :
- **Frontend** : React 18 avec Vite, TailwindCSS et Shadcn/UI
- **Backend** : Flask avec SQLAlchemy et JWT
- **Base de données** : SQLite (développement)

## ✅ Corrections Apportées

### 1. Système de Routage
- **Problème** : Navigation manuelle défaillante
- **Solution** : Implémentation de React Router DOM
- **Résultat** : Navigation fluide entre les pages

### 2. Menu Utilisateur
- **Problème** : Menu déroulant non fonctionnel
- **Solution** : Correction des composants DropdownMenu avec React Router
- **Résultat** : Accès direct aux pages d'authentification

### 3. Dépendances
- **Problème** : Conflits de versions React 19
- **Solution** : Ajustement des versions et installation avec `--legacy-peer-deps`
- **Résultat** : Build stable et fonctionnel

## 🚀 Prérequis

### Logiciels Requis
- **Node.js** : Version 18.0 ou supérieure
- **npm** : Version 8.0 ou supérieure  
- **Python** : Version 3.8 ou supérieure
- **pip** : Gestionnaire de paquets Python

### Vérification des Prérequis
```bash
node --version    # Doit afficher v18.x.x ou supérieur
npm --version     # Doit afficher 8.x.x ou supérieur
python3 --version # Doit afficher 3.8.x ou supérieur
pip3 --version    # Doit être installé
```

## 📦 Installation

### 1. Cloner ou Extraire le Projet
```bash
# Si vous avez un dépôt Git
git clone <url-du-depot>
cd samurai-nutrition

# Ou extraire l'archive fournie
unzip samurai-nutrition-modified.zip
cd samurai-nutrition
```

### 2. Configuration du Backend

#### Installation des Dépendances Python
```bash
cd backend
pip3 install -r requirements.txt
```

#### Initialisation de la Base de Données
```bash
cd src
python3 -c "
from main import app, db
with app.app_context():
    db.create_all()
    print('Base de données initialisée avec succès')
"
```

### 3. Configuration du Frontend

#### Installation des Dépendances Node.js
```bash
cd ../frontend
npm install --legacy-peer-deps
```

> **Note** : Le flag `--legacy-peer-deps` est nécessaire pour résoudre les conflits de dépendances avec React 19.

## 🏃‍♂️ Démarrage de l'Application

### 1. Démarrer le Backend (Terminal 1)
```bash
cd backend/src
python3 main.py
```

**Sortie attendue :**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 2. Démarrer le Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

**Sortie attendue :**
```
  VITE v6.3.5  ready in 847 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://169.254.0.21:5173/
```

### 3. Accéder à l'Application
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Documentation API** : http://localhost:5000/api/docs (si disponible)

## 🧪 Test de l'Application

### 1. Test de Navigation
1. Ouvrir http://localhost:5173
2. Cliquer sur l'icône utilisateur dans l'en-tête
3. Sélectionner "Login / Register"
4. Vérifier que la page d'authentification s'affiche

### 2. Test d'Authentification

#### Connexion avec Utilisateur Existant
- **Email** : `john@example.com`
- **Mot de passe** : `password123`

#### Création de Nouveau Compte
1. Cliquer sur l'onglet "Inscription"
2. Remplir tous les champs requis
3. Accepter les conditions d'utilisation
4. Cliquer sur "Créer le compte"

### 3. Test des Fonctionnalités
- ✅ Navigation entre les pages
- ✅ Authentification (connexion/inscription)
- ✅ Affichage des produits
- ✅ Panier d'achat
- ✅ Liste de souhaits
- ✅ Interface responsive

## 🔧 Configuration Avancée

### Variables d'Environnement Backend
Créer un fichier `.env` dans le dossier `backend/` :
```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///nutrition.db
JWT_SECRET_KEY=your-jwt-secret-here
FLASK_ENV=development
```

### Configuration de Production
Pour un déploiement en production :

1. **Backend** :
   - Utiliser PostgreSQL au lieu de SQLite
   - Configurer CORS pour le domaine de production
   - Activer HTTPS

2. **Frontend** :
   - Construire l'application : `npm run build`
   - Servir les fichiers statiques avec nginx ou Apache

## 🐛 Dépannage

### Problèmes Courants

#### 1. Erreur "Module not found"
```bash
# Réinstaller les dépendances
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 2. Erreur de connexion à l'API
- Vérifier que le backend est démarré sur le port 5000
- Vérifier les URLs dans le code frontend (http://localhost:5000)

#### 3. Erreur de base de données
```bash
cd backend/src
python3 -c "
from main import app, db
with app.app_context():
    db.drop_all()
    db.create_all()
    print('Base de données réinitialisée')
"
```

#### 4. Port déjà utilisé
```bash
# Trouver le processus utilisant le port
lsof -i :5173  # Pour le frontend
lsof -i :5000  # Pour le backend

# Tuer le processus
kill -9 <PID>
```

### Logs de Débogage

#### Backend
Les logs s'affichent directement dans le terminal où Flask est lancé.

#### Frontend
Ouvrir les outils de développement du navigateur (F12) et consulter :
- **Console** : Pour les erreurs JavaScript
- **Network** : Pour les requêtes API
- **Application** : Pour le localStorage et les cookies

## 📁 Structure du Projet

```
samurai-nutrition/
├── backend/
│   ├── src/
│   │   ├── main.py              # Point d'entrée Flask
│   │   ├── models/              # Modèles de base de données
│   │   │   ├── user.py
│   │   │   └── product.py
│   │   └── routes/              # Routes API
│   │       └── auth.py
│   └── requirements.txt         # Dépendances Python
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Composant principal avec React Router
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── Header.jsx      # En-tête avec navigation
│   │   │   └── AuthPage.jsx    # Page d'authentification
│   │   └── pages/              # Pages de l'application
│   ├── package.json            # Dépendances Node.js
│   └── vite.config.js          # Configuration Vite
└── GUIDE_DEPLOIEMENT.md        # Ce guide
```

## 🔐 Sécurité

### Recommandations
1. **Mots de passe** : Utiliser des mots de passe forts en production
2. **JWT** : Configurer une clé secrète robuste
3. **CORS** : Restreindre les domaines autorisés
4. **HTTPS** : Obligatoire en production
5. **Validation** : Valider toutes les entrées utilisateur

### Données de Test
L'application inclut des utilisateurs et produits de test pour faciliter le développement.

## 📞 Support

En cas de problème :
1. Vérifier les logs dans les terminaux
2. Consulter la section dépannage ci-dessus
3. Vérifier que tous les prérequis sont installés
4. S'assurer que les ports 5000 et 5173 sont libres

## 🎯 Fonctionnalités Principales

### ✅ Implémentées et Testées
- Authentification utilisateur (connexion/inscription)
- Navigation avec React Router
- Interface responsive
- Gestion des produits
- Panier d'achat
- API REST fonctionnelle

### 🚧 En Développement
- Système de paiement
- Gestion des commandes
- Interface d'administration
- Notifications en temps réel

---

**Version** : 1.0.0 (Corrigée)  
**Date** : 30 juillet 2025  
**Statut** : ✅ Fonctionnel et Testé

