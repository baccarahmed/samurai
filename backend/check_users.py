from src.main_fixed import app, db
from src.models.user import User

def check_users():
    with app.app_context():
        print("\n=== VÉRIFICATION DES UTILISATEURS DANS LA BASE DE DONNÉES ===")
        users = User.query.all()
        
        print(f"Nombre total d'utilisateurs: {len(users)}")
        
        for user in users:
            print(f"\nID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Nom: {user.first_name} {user.last_name}")
            print(f"Rôle: {user.role}")

if __name__ == "__main__":
    check_users()