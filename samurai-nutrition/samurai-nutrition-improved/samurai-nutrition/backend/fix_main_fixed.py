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

def fix_main_fixed():
    """Ajouter l'endpoint /orders/<int:order_id> directement dans main_fixed.py"""
    print_separator()
    print("AJOUT DE L'ENDPOINT /ORDERS/<INT:ORDER_ID> DANS MAIN_FIXED.PY")
    
    # Chemins des fichiers
    main_fixed_py_path = "src/main_fixed.py"
    
    # Vérifier l'existence des fichiers
    if not os.path.exists(main_fixed_py_path):
        print(f"❌ Fichier {main_fixed_py_path} introuvable")
        return False
    
    # Créer des sauvegardes
    if not backup_file(main_fixed_py_path):
        return False
    
    print("\nAnalyse des fichiers...")
    
    # Lire le contenu des fichiers
    try:
        with open(main_fixed_py_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        print("✅ Fichier lu avec succès")
    except Exception as e:
        print(f"❌ Erreur lors de la lecture des fichiers: {str(e)}")
        return False
    
    # Créer le code de l'endpoint
    endpoint_code = '''
@app.route('/api/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_direct(order_id):
    """Récupérer les détails d'une commande spécifique (endpoint direct)"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Récupérer la commande
        order = Order.query.get(order_id)
        if not order:
            return jsonify({"message": "Commande non trouvée"}), 404
            
        # Vérifier les permissions
        if order.user_id != current_user_id and not user.has_permission('view_all_orders'):
            return jsonify({"message": "Permission insuffisante"}), 403
            
        # Récupérer les détails complets
        order_data = order.to_dict()
        
        # Ajouter les articles de la commande
        order_data['items'] = [item.to_dict() for item in order.order_items]
        
        # Ajouter l'historique des statuts
        order_data['status_history'] = [history.to_dict() for history in order.status_history]
        
        return jsonify({
            'order': order_data
        }), 200
        
    except Exception as e:
        print(f"Error in get_order_direct: {str(e)}")
        return jsonify({"error": f"Erreur lors de la récupération des détails de la commande: {str(e)}"}), 500
'''
    
    # Trouver un bon endroit pour insérer l'endpoint
    insert_position = content.find("@app.route('/api/health', methods=['GET'])")
    if insert_position == -1:
        print("❌ Impossible de trouver un point d'insertion approprié")
        return False
    
    # Insérer l'endpoint
    new_content = content[:insert_position] + endpoint_code + "\n" + content[insert_position:]
    
    # Ajouter l'import de jwt_required s'il n'est pas déjà présent
    if "from flask_jwt_extended import jwt_required" not in new_content:
        import_position = new_content.find("from flask_jwt_extended import")
        if import_position != -1:
            # Trouver la fin de la ligne d'import
            import_end = new_content.find("\n", import_position)
            if import_end != -1:
                new_import = new_content[:import_end] + ", jwt_required" + new_content[import_end:]
                new_content = new_import
    
    # Écrire le nouveau contenu dans main_fixed.py
    try:
        with open(main_fixed_py_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Endpoint ajouté avec succès dans main_fixed.py")
    except Exception as e:
        print(f"❌ Erreur lors de l'écriture dans {main_fixed_py_path}: {str(e)}")
        return False
    
    # Restaurer run.py pour utiliser main_fixed.py
    run_py_path = "run.py"
    if os.path.exists(run_py_path + ".bak"):
        try:
            shutil.copy2(run_py_path + ".bak", run_py_path)
            print("✅ Fichier run.py restauré pour utiliser main_fixed.py")
        except Exception as e:
            print(f"❌ Erreur lors de la restauration de run.py: {str(e)}")
    
    print_separator()
    print("RÉSUMÉ DES MODIFICATIONS")
    print("1. Sauvegarde du fichier original (.bak)")
    print("2. Ajout de l'endpoint /orders/<int:order_id> directement dans main_fixed.py")
    print("3. Restauration de run.py pour utiliser main_fixed.py")
    print("\n✅ Les modifications ont été appliquées avec succès!")
    print("\nPour tester les modifications:")
    print("1. Redémarrez le serveur Flask")
    print("2. Exécutez le script test_orders_consistency.py")
    
    return True

def main():
    fix_main_fixed()

if __name__ == "__main__":
    main()