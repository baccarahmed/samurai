import os
import shutil
import sys

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

def fix_orders_inconsistency():
    """Résoudre l'incohérence entre orders.py et orders_fixed.py"""
    print_separator()
    print("RÉSOLUTION DE L'INCOHÉRENCE ENTRE ORDERS.PY ET ORDERS_FIXED.PY")
    
    # Chemins des fichiers
    orders_py_path = "src/routes/orders.py"
    orders_fixed_py_path = "src/routes/orders_fixed.py"
    
    # Vérifier l'existence des fichiers
    if not os.path.exists(orders_py_path):
        print(f"❌ Fichier {orders_py_path} introuvable")
        return False
    
    if not os.path.exists(orders_fixed_py_path):
        print(f"❌ Fichier {orders_fixed_py_path} introuvable")
        return False
    
    # Créer des sauvegardes
    if not backup_file(orders_py_path) or not backup_file(orders_fixed_py_path):
        return False
    
    print("\nAnalyse des fichiers...")
    
    # Lire le contenu des fichiers
    try:
        with open(orders_py_path, 'r', encoding='utf-8', errors='ignore') as f:
            orders_content = f.read()
        
        with open(orders_fixed_py_path, 'r', encoding='utf-8', errors='ignore') as f:
            orders_fixed_content = f.read()
        
        print("✅ Fichiers lus avec succès")
    except Exception as e:
        print(f"❌ Erreur lors de la lecture des fichiers: {str(e)}")
        return False
    
    # Extraire l'implémentation de get_order de orders_fixed.py
    get_order_fixed_start = orders_fixed_content.find("@orders_bp.route('/orders/<int:order_id>', methods=['GET'])")
    if get_order_fixed_start == -1:
        print("❌ Impossible de trouver l'endpoint GET /orders/<int:order_id> dans orders_fixed.py")
        return False
    
    # Trouver la fin de la fonction
    get_order_fixed_end = orders_fixed_content.find("@orders_bp.route", get_order_fixed_start + 1)
    if get_order_fixed_end == -1:
        # Si c'est la dernière fonction, prendre jusqu'à la fin du fichier
        get_order_fixed_implementation = orders_fixed_content[get_order_fixed_start:]
    else:
        get_order_fixed_implementation = orders_fixed_content[get_order_fixed_start:get_order_fixed_end]
    
    print("✅ Implémentation de get_order extraite de orders_fixed.py")
    
    # Remplacer l'implémentation dans orders.py
    get_order_start = orders_content.find("@orders_bp.route('/orders/<int:order_id>', methods=['GET'])")
    if get_order_start == -1:
        print("❌ Impossible de trouver l'endpoint GET /orders/<int:order_id> dans orders.py")
        return False
    
    # Trouver la fin de la fonction
    get_order_end = orders_content.find("@orders_bp.route", get_order_start + 1)
    if get_order_end == -1:
        # Si c'est la dernière fonction, prendre jusqu'à la fin du fichier
        new_orders_content = orders_content[:get_order_start] + get_order_fixed_implementation
    else:
        new_orders_content = orders_content[:get_order_start] + get_order_fixed_implementation + orders_content[get_order_end:]
    
    # Écrire le nouveau contenu dans orders.py
    try:
        with open(orders_py_path, 'w', encoding='utf-8') as f:
            f.write(new_orders_content)
        print("✅ Implémentation de get_order mise à jour dans orders.py")
    except Exception as e:
        print(f"❌ Erreur lors de l'écriture dans {orders_py_path}: {str(e)}")
        return False
    
    print_separator()
    print("RÉSUMÉ DES MODIFICATIONS")
    print("1. Sauvegarde des fichiers originaux (.bak)")
    print("2. Extraction de l'implémentation de get_order depuis orders_fixed.py")
    print("3. Mise à jour de l'implémentation dans orders.py")
    print("\n✅ L'incohérence a été résolue avec succès!")
    print("\nPour tester les modifications:")
    print("1. Redémarrez le serveur Flask")
    print("2. Exécutez le script test_orders_consistency.py")
    
    return True

def main():
    fix_orders_inconsistency()

if __name__ == "__main__":
    main()