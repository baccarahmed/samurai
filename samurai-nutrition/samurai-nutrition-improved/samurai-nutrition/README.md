# SAMURAï Nutrition - Application E-commerce

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-✅%20Fonctionnel-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3-green.svg)

## 🏆 Application E-commerce de Nutrition Sportive

Application web complète pour la vente de suppléments nutritionnels destinés aux athlètes et passionnés de fitness.

### ✨ Fonctionnalités Principales

- 🔐 **Authentification** - Connexion et inscription sécurisées
- 🛍️ **Catalogue Produits** - Navigation et recherche avancées
- 🛒 **Panier d'Achat** - Gestion des commandes
- ❤️ **Liste de Souhaits** - Sauvegarde des produits favoris
- 📱 **Design Responsive** - Compatible mobile et desktop
- 🎨 **Interface Moderne** - Design professionnel avec TailwindCSS

### 🚀 Démarrage Rapide

```bash
# 1. Backend
cd backend/src
pip3 install -r ../requirements.txt
python3 main.py

# 2. Frontend (nouveau terminal)
cd frontend
npm install --legacy-peer-deps
npm run dev

# 3. Accéder à l'application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### 📚 Documentation

- **[Guide de Déploiement](GUIDE_DEPLOIEMENT.md)** - Instructions complètes d'installation
- **[Corrections Appliquées](CORRECTIONS_APPLIQUEES.md)** - Détail des améliorations
- **[Résultats de Tests](test_results.md)** - Validation des fonctionnalités

### 🛠️ Technologies

#### Frontend
- **React 18** - Framework JavaScript moderne
- **Vite** - Build tool rapide
- **React Router** - Navigation SPA
- **TailwindCSS** - Framework CSS utilitaire
- **Shadcn/UI** - Composants UI modernes
- **Lucide Icons** - Icônes vectorielles

#### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM pour base de données
- **JWT** - Authentification par tokens
- **SQLite** - Base de données (développement)
- **CORS** - Support cross-origin

### 🔧 Architecture

```
Frontend (React)     Backend (Flask)     Database (SQLite)
     |                      |                    |
  Port 5173            Port 5000           nutrition.db
     |                      |                    |
     └─────── API ──────────┴────────────────────┘
           (REST JSON)
```

### 📋 Prérequis

- **Node.js** ≥ 18.0
- **Python** ≥ 3.8
- **npm** ≥ 8.0
- **pip3** (gestionnaire Python)

### 🧪 Tests

#### Fonctionnalités Testées
- ✅ Navigation entre pages
- ✅ Authentification (connexion/inscription)
- ✅ API Backend fonctionnelle
- ✅ Interface responsive
- ✅ Menu utilisateur opérationnel

#### Comptes de Test
- **Email** : `john@example.com`
- **Mot de passe** : `password123`

### 🔐 Sécurité

- Hachage des mots de passe avec bcrypt
- Authentification JWT sécurisée
- Validation des entrées utilisateur
- Protection CORS configurée

### 📱 Responsive Design

L'application s'adapte automatiquement à tous les écrans :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

### 🎨 Interface Utilisateur

#### Thèmes
- 🌞 Mode Clair
- 🌙 Mode Sombre
- 🎯 Basculement automatique

#### Composants
- Header avec navigation
- Formulaires d'authentification
- Cartes produits
- Panier d'achat
- Footer informatif

### 🚧 Statut du Projet

#### ✅ Complété
- [x] Système d'authentification
- [x] Navigation React Router
- [x] Interface utilisateur
- [x] API Backend
- [x] Base de données
- [x] Design responsive

#### 🔄 En Cours
- [x] Système de paiement
- [x] Gestion des commandes
- [x] Interface d'administration
- [ ] Tests automatisés

#### 📅 Planifié
- [ ] Notifications push
- [ ] Chat support client
- [ ] Analytics avancées
- [ ] Application mobile

### 📞 Support

Pour toute question ou problème :

1. Consulter le [Guide de Déploiement](GUIDE_DEPLOIEMENT.md)
2. Vérifier la section dépannage
3. Examiner les logs dans les terminaux
4. S'assurer que les ports 5000 et 5173 sont libres

### 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

### 👥 Contributeurs

- **Développement Initial** : Équipe Samurai Nutrition
- **Corrections et Améliorations** : Manus AI Assistant

### 🔄 Changelog

#### Version 1.0.0 (30 juillet 2025)
- ✅ Correction du système de routage React Router
- ✅ Réparation du menu utilisateur
- ✅ Résolution des conflits de dépendances
- ✅ Interface d'authentification complète
- ✅ Tests fonctionnels validés

---

**🎯 Prêt pour la Production** | **📱 Mobile-First** | **🔐 Sécurisé** | **⚡ Performant**

