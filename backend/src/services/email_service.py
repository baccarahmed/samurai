from flask import current_app
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

class EmailService:
    @staticmethod
    def send_email(to_email, subject, body, is_html=False):
        """
        Envoie un email en utilisant SMTP
        
        Pour le développement, cette fonction simule l'envoi d'email
        en imprimant les détails dans la console.
        En production, elle devrait être configurée avec un vrai serveur SMTP.
        """
        try:
            # En mode développement, on simule l'envoi d'email
            print(f"\n===== SIMULATION D'ENVOI D'EMAIL =====")
            print(f"À: {to_email}")
            print(f"Sujet: {subject}")
            print(f"Corps: {body}")
            print(f"Format HTML: {is_html}")
            print(f"Date: {datetime.now()}")
            print("===== FIN DE LA SIMULATION =====\n")
            
            return True
            
            # En production, décommentez le code ci-dessous et configurez-le
            # avec les paramètres de votre serveur SMTP
            """
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = 'noreply@samurainutrition.com'
            msg['To'] = to_email
            
            if is_html:
                part = MIMEText(body, 'html')
            else:
                part = MIMEText(body, 'plain')
                
            msg.attach(part)
            
            server = smtplib.SMTP('smtp.example.com', 587)
            server.starttls()
            server.login('username', 'password')
            server.send_message(msg)
            server.quit()
            
            return True
            """
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'email: {str(e)}")
            return False
    
    @staticmethod
    def send_admin_notification(admin_email, subject, message):
        """
        Envoie une notification à un administrateur
        """
        return EmailService.send_email(
            to_email=admin_email,
            subject=f"[ADMIN] {subject}",
            body=message,
            is_html=True
        )
    
    @staticmethod
    def send_new_order_notification(admin_email, order):
        """
        Envoie une notification pour une nouvelle commande
        """
        subject = f"Nouvelle commande #{order.order_number}"
        
        # Création du corps du message en HTML
        items_html = ""
        for item in order.order_items:
            items_html += f"<li>{item.quantity} x {item.product_name} - {item.total_price}€</li>"
        
        body = f"""
        <html>
        <body>
            <h2>Nouvelle commande reçue</h2>
            <p><strong>Numéro de commande:</strong> {order.order_number}</p>
            <p><strong>Date:</strong> {order.created_at.strftime('%d/%m/%Y %H:%M')}</p>
            <p><strong>Client:</strong> {order.user.first_name} {order.user.last_name}</p>
            <p><strong>Montant total:</strong> {order.total_amount}€</p>
            <p><strong>Statut:</strong> {order.status}</p>
            
            <h3>Articles commandés:</h3>
            <ul>
                {items_html}
            </ul>
            
            <p>Connectez-vous au <a href="http://localhost:5173/admin/dashboard">tableau de bord</a> pour gérer cette commande.</p>
        </body>
        </html>
        """
        
        return EmailService.send_admin_notification(
            admin_email=admin_email,
            subject=subject,
            message=body
        )
    
    @staticmethod
    def send_order_status_change_notification(admin_email, order, old_status, new_status, comment):
        """
        Envoie une notification pour un changement de statut de commande
        """
        subject = f"Statut commande #{order.order_number} modifié: {old_status} → {new_status}"
        
        body = f"""
        <html>
        <body>
            <h2>Modification du statut de commande</h2>
            <p><strong>Numéro de commande:</strong> {order.order_number}</p>
            <p><strong>Client:</strong> {order.user.first_name} {order.user.last_name}</p>
            <p><strong>Ancien statut:</strong> {old_status}</p>
            <p><strong>Nouveau statut:</strong> {new_status}</p>
            <p><strong>Commentaire:</strong> {comment}</p>
            <p><strong>Date de modification:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
            
            <p>Connectez-vous au <a href="http://localhost:5173/admin/dashboard">tableau de bord</a> pour plus de détails.</p>
        </body>
        </html>
        """
        
        return EmailService.send_admin_notification(
            admin_email=admin_email,
            subject=subject,
            message=body
        )