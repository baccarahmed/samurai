import os
import shutil

def print_separator():
    print("\n" + "-" * 80 + "\n")

def backup_file(file_path):
    """Créer une sauvegarde du fichier"""
    backup_path = f"{file_path}.bak"
    try:
        shutil.copy2(file_path, backup_path)
        print(f"✅ Sauvegarde créée: {backup_path}")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de la création de la sauvegarde: {str(e)}")
        return False

def fix_run_py():
    """Modifier run.py pour utiliser src.main au lieu de src.main_fixed"""
    print_separator()
    print("MODIFICATION DE RUN.PY POUR UTILISER SRC.MAIN")
    
    # Chemin du fichier
    run_py_path = "run.py"
    
    # Vérifier l'existence du fichier
    if not os.path.exists(run_py_path):
        print(f"❌ Fichier {run_py_path} introuvable")
        return False
    
    # Créer une sauvegarde
    if not backup_file(run_py_path):
        return False
    
    print("\nAnalyse du fichier...")
    
    # Lire le contenu du fichier
    try:
        with open(run_py_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        print("✅ Fichier lu avec succès")
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du fichier: {str(e)}")
        return False
    
    # Remplacer l'import
    if "from src.main_fixed import app, db" in content:
        new_content = content.replace(
            "# from src.main import create_app, db  # Comment out this line\nfrom src.main_fixed import app, db  # Use this line instead",
            "from src.main import create_app, db  # Use this line\n# from src.main_fixed import app, db  # Comment out this line"
        )
        
        # Ajouter le code pour créer l'application
        if "if __name__ == '__main__':\n" in new_content:
            app_creation = "\nif __name__ == '__main__':\n    app = create_app()\n"
            new_content = new_content.replace("if __name__ == '__main__':\n", app_creation)
        
        # Écrire le nouveau contenu
        try:
            with open(run_py_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("✅ Fichier run.py modifié avec succès")
        except Exception as e:
            print(f"❌ Erreur lors de l'écriture dans {run_py_path}: {str(e)}")
            return False
    else:
        print("❌ Import de src.main_fixed non trouvé dans run.py")
        return False
    
    print_separator()
    print("RÉSUMÉ DES MODIFICATIONS")
    print("1. Sauvegarde du fichier original (.bak)")
    print("2. Modification de run.py pour utiliser src.main au lieu de src.main_fixed")
    print("3. Ajout du code pour créer l'application avec create_app()")
    print("\n✅ Les modifications ont été appliquées avec succès!")
    print("\nPour tester les modifications:")
    print("1. Redémarrez le serveur Flask")
    print("2. Exécutez le script test_orders_consistency.py")
    
    return True

def main():
    fix_run_py()

if __name__ == "__main__":
    main()