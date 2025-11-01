from src.main_fixed import app, db
from src.models.user import User

def create_test_user():
    with app.app_context():
        # Vérifier si l'utilisateur existe déjà
        user = User.query.filter_by(email='john@example.com').first()
        
        if user:
            print(f"L'utilisateur john@example.com existe déjà avec l'ID: {user.id}")
            print(f"Rôle: {user.role}")
            
            # Réinitialiser le mot de passe
            user.set_password('password123')
            db.session.commit()
            print("Mot de passe réinitialisé à 'password123'")
        else:
            # Créer un nouvel utilisateur
            new_user = User(
                first_name="John",
                last_name="Doe",
                email="john@example.com",
                role="customer"
            )
            new_user.set_password("password123")
            
            db.session.add(new_user)
            db.session.commit()
            print(f"Nouvel utilisateur créé avec l'ID: {new_user.id}")

if __name__ == "__main__":
    create_test_user()