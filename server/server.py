from http.client import responses

from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
import util

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/get_location_name')
def get_location_name():
    response = jsonify({
        "locations": util.get_location_name()
    })
    return response

@app.route('/get_ber_rating')
def get_ber_rating():
    response = jsonify({
        'ber_rating': util.get_ber_rating()
    })
    return response

@app.route('/get_property_type')
def get_property_type():
    response = jsonify({
        'property_type': util.get_property_type()
    })
    return response

@app.route('/predict_price', methods=['POST'])
def predict_price():
    try:
        if request.is_json:
            data = request.get_json()
            location = data['location']
            floor_area = float(data['floor_area'])
            number_of_bathrooms = int(data['number_of_bathrooms'])
            number_of_bedrooms = int(data['number_of_bedrooms'])
            property_type = data['property_type']
            ber_rating = data['ber_rating']
        else:
            location = request.form['location']
            floor_area = float(request.form['floor_area'])
            number_of_bathrooms = int(request.form['number_of_bathrooms'])
            number_of_bedrooms = int(request.form['number_of_bedrooms'])
            property_type = request.form['property_type']
            ber_rating = request.form['ber_rating']

        estimated_price = util.get_estimated_price(location, floor_area, number_of_bathrooms, number_of_bedrooms, property_type, ber_rating)

        response = jsonify({'estimated_price': estimated_price}) # Corrected line
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    print("Starting Python Flask Server For House Price Prediction...")
    util.load_saved_artifact()
    app.run()