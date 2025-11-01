#!/usr/bin/env python3
"""
Script de diagnostic pour le serveur Samurai Nutrition
"""

import os
import sys
import subprocess
import time
import requests

def check_python_environment():
    """Vérifier l'environnement Python"""
    print("🐍 Vérification de l'environnement Python...")
    print(f"  - Version Python: {sys.version}")
    print(f"  - Répertoire de travail: {os.getcwd()}")
    print(f"  - PYTHONPATH: {sys.path[:3]}...")
    return True

def check_dependencies():
    """Vérifier les dépendances"""
    print("\n📦 Vérification des dépendances...")
    
    required_packages = [
        'flask',
        'flask_sqlalchemy',
        'flask_cors',
        'flask_jwt_extended',
        'requests'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} - MANQUANT")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️ Packages manquants: {missing_packages}")
        return False
    else:
        print("  ✅ Toutes les dépendances sont installées")
        return True

def check_backend_files():
    """Vérifier les fichiers backend"""
    print("\n📁 Vérification des fichiers backend...")
    
    required_files = [
        'backend/src/main.py',
        'backend/src/extensions.py',
        'backend/src/models/user.py',
        'backend/src/models/product.py',
        'backend/src/models/order.py',
        'backend/src/routes/auth.py',
        'backend/src/routes/admin.py',
        'backend/src/routes/orders.py',
        'backend/run.py',
        'backend/init_data.py'
    ]
    
    missing_files = []
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} - MANQUANT")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n⚠️ Fichiers manquants: {missing_files}")
        return False
    else:
        print("  ✅ Tous les fichiers backend sont présents")
        return True

def test_backend_import():
    """Tester l'import du backend"""
    print("\n🔧 Test d'import du backend...")
    
    try:
        # Ajouter le répertoire backend au PYTHONPATH
        backend_path = os.path.join(os.getcwd(), 'backend')
        sys.path.insert(0, backend_path)
        
        from src.main import create_app
        app = create_app()
        print("  ✅ Import du backend réussi")
        return True
    except Exception as e:
        print(f"  ❌ Erreur d'import: {e}")
        return False

def test_database_creation():
    """Tester la création de la base de données"""
    print("\n🗄️ Test de création de la base de données...")
    
    try:
        backend_path = os.path.join(os.getcwd(), 'backend')
        sys.path.insert(0, backend_path)
        
        from src.main import create_app, db
        app = create_app()
        
        with app.app_context():
            db.create_all()
            print("  ✅ Base de données créée avec succès")
        return True
    except Exception as e:
        print(f"  ❌ Erreur création base de données: {e}")
        return False

def test_server_startup():
    """Tester le démarrage du serveur"""
    print("\n🚀 Test de démarrage du serveur...")
    
    try:
        # Démarrer le serveur en arrière-plan
        backend_path = os.path.join(os.getcwd(), 'backend')
        process = subprocess.Popen(
            [sys.executable, 'run.py'],
            cwd=backend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Attendre un peu
        time.sleep(5)
        
        # Vérifier si le processus est toujours en cours
        if process.poll() is None:
            print("  ✅ Serveur démarré avec succès")
            
            # Tester l'API
            try:
                response = requests.get("http://localhost:5000/api/health", timeout=5)
                if response.status_code == 200:
                    print("  ✅ API accessible")
                    process.terminate()
                    return True
                else:
                    print(f"  ❌ API non accessible: {response.status_code}")
                    process.terminate()
                    return False
            except Exception as e:
                print(f"  ❌ Erreur connexion API: {e}")
                process.terminate()
                return False
        else:
            stdout, stderr = process.communicate()
            print(f"  ❌ Serveur arrêté: {stderr.decode()}")
            return False
            
    except Exception as e:
        print(f"  ❌ Erreur démarrage serveur: {e}")
        return False

def check_port_availability():
    """Vérifier la disponibilité du port 5000"""
    print("\n🔌 Vérification du port 5000...")
    
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', 5000))
        sock.close()
        
        if result == 0:
            print("  ⚠️ Le port 5000 est déjà utilisé")
            return False
        else:
            print("  ✅ Le port 5000 est disponible")
            return True
    except Exception as e:
        print(f"  ❌ Erreur vérification port: {e}")
        return False

def main():
    """Fonction principale de diagnostic"""
    print("🔍 DIAGNOSTIC COMPLET DU SYSTÈME SAMURAI NUTRITION")
    print("=" * 60)
    
    # Tests
    tests = [
        ("Environnement Python", check_python_environment),
        ("Dépendances", check_dependencies),
        ("Fichiers backend", check_backend_files),
        ("Import backend", test_backend_import),
        ("Base de données", test_database_creation),
        ("Port 5000", check_port_availability),
        ("Démarrage serveur", test_server_startup),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ Erreur dans {test_name}: {e}")
            results[test_name] = False
    
    # Résumé
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DU DIAGNOSTIC")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<20} {status}")
        if result:
            passed += 1
    
    print(f"\nRésultat: {passed}/{total} tests réussis")
    
    if passed == total:
        print("🎉 Tous les tests sont passés ! Le système est prêt.")
    else:
        print("⚠️ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 