import os 
from dotenv import load_dotenv 
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message 

app = Flask(__name__)
CORS(app)

load_dotenv() 

# Configuration du serveur mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  
app.config['MAIL_PORT'] = 587               
app.config['MAIL_USE_TLS'] = True           
app.config['MAIL_USE_SSL'] = False          
app.config['MAIL_USERNAME'] = 'predictirlande123@gmail.com'
app.config['MAIL_PASSWORD'] = os.environ.get('GMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = 'predictirlande123@gmail.com'

mail = Mail(app) 

@app.route('/predict_price', methods=['POST'])
def predict_price():
    if not request.is_json:
        return jsonify({"error": "La requête doit être du JSON"}), 400

    data = request.get_json()
    
    # Récupération des données
    location = data.get('location')
    floor_area = data.get('floor_area')
    number_of_bathrooms = data.get('number_of_bathrooms')
    number_of_bedrooms = data.get('number_of_bedrooms')
    property_type = data.get('property_type')
    ber_rating = data.get('ber_rating')

    # Vérification des données requises
    if not all([location, floor_area, number_of_bathrooms, number_of_bedrooms, property_type, ber_rating]):
        return jsonify({"error": "Tous les champs sont requis"}), 400

    try:
        # Ici, vous devrez implémenter votre logique de prédiction
        # Pour l'instant, nous retournons une estimation basée sur des règles simples
        base_price = 300000  # Prix de base
        
        # Ajustements selon les caractéristiques
        location_multiplier = {
            "Dublin": 1.5,
            "Cork": 1.2,
            "Galway": 1.1,
            "Limerick": 1.0,
            "Waterford": 0.9
        }.get(location, 1.0)
        
        property_type_multiplier = {
            "House": 1.0,
            "Apartment": 0.9,
            "Studio": 0.8,
            "Villa": 1.2
        }.get(property_type, 1.0)
        
        # Calcul du prix estimé
        estimated_price = base_price * location_multiplier * property_type_multiplier
        estimated_price *= (1 + (number_of_bedrooms - 2) * 0.1)  # +10% par chambre supplémentaire
        estimated_price *= (1 + (number_of_bathrooms - 1) * 0.05)  # +5% par salle de bain supplémentaire
        estimated_price *= (1 + (floor_area - 100) / 1000)  # Ajustement selon la surface
        
        # Ajustement selon le BER rating (A1 = +20%, G = -20%)
        ber_multiplier = {
            "A1": 1.2,
            "A2": 1.15,
            "A3": 1.1,
            "B1": 1.05,
            "B2": 1.0,
            "B3": 0.95,
            "C1": 0.9,
            "C2": 0.85,
            "C3": 0.8,
            "D1": 0.75,
            "D2": 0.7,
            "E1": 0.65,
            "E2": 0.6,
            "F": 0.55,
            "G": 0.5
        }.get(ber_rating, 1.0)
        
        estimated_price *= ber_multiplier
        
        return jsonify({
            "estimated_price": round(estimated_price, 2)
        }), 200

    except Exception as e:
        app.logger.error(f"Erreur lors de la prédiction: {e}")
        return jsonify({"error": "Erreur lors de la prédiction du prix"}), 500

@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    if not request.is_json:
        return jsonify({"message": "Erreur: La requête doit être du JSON"}), 400

    data = request.get_json()

    firstName = data.get('firstName')
    lastName = data.get('lastName')
    user_email = data.get('email') 
    target = data.get('target')
    message_body = data.get('place')

    if not firstName or not lastName or not user_email or not message_body:
        return jsonify({"message": "Erreur: Champs manquants"}), 400

    print(f"Received data: Prénom={firstName}, Nom={lastName}, Email={user_email}, Cible={target}, Message={message_body}")
    
    try:
        msg = Message(
            subject=f"Nouveau message de {firstName} {lastName}",
            recipients=['predictirlande123@gmail.com']
        )
        
        msg.body = f"""
        Vous avez reçu un message de {firstName} {lastName}.

        Email de l'expéditeur: {user_email}
        Type de demande: {target}

        Message:
        {message_body}
        """
        
        msg.reply_to = user_email
        mail.send(msg) 
        print("Email envoyé avec succès !") 
        return jsonify({"message": "Message reçu et email envoyé avec succès !"}), 200

    except Exception as e:
        app.logger.error(f"Erreur lors de l'envoi de l'email: {e}")
        print(f"Erreur lors de l'envoi de l'email: {e}") 
        return jsonify({"message": "Erreur interne lors de l'envoi de l'email."}), 500

if __name__ == '__main__':
    if not app.config['MAIL_PASSWORD']:
       print("ERREUR: Le mot de passe d'application Gmail n'est pas défini.")
       print("Définissez la variable d'environnement GMAIL_PASSWORD.")
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=True)