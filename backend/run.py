#!/usr/bin/env python3
"""
Script de démarrage pour l'application Samurai Nutrition
"""

import sys
import os

# Configuration de l'encodage
import locale
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

# Ajouter le répertoire courant au PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# from src.main import create_app, db  # Comment out this line
from src.main_fixed import app, db  # Use this line instead

if __name__ == '__main__':
    # Since we're importing the app directly, we don't need to create it
    with app.app_context():
        # Create the tables
        db.create_all()
        
        print("🚀 Serveur Samurai Nutrition demarre!")
        print("📊 Dashboard admin: http://localhost:5000/api/admin/dashboard")
        print("👤 Compte admin: admin@samurai-nutrition.com / admin123")
        print("👤 Compte client: john@example.com / password123")
    
    # Démarrer le serveur
    app.run(host='0.0.0.0', port=5000, debug=True)