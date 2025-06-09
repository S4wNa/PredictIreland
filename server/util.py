import json
import pickle
import numpy as np
import pandas as pd

__ber_rating = None
__property_type = None
__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, floor_area, number_of_bathrooms, number_of_bedrooms, property_type, ber_rating):
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    # Créer un DataFrame avec une ligne de zéros et les noms de colonnes de X
    input_data = pd.DataFrame(np.zeros((1, len(__data_columns))), columns=__data_columns)

    # Remplir les valeurs des caractéristiques (en utilisant les noms de colonnes en minuscules)
    input_data['number of bedrooms'] = number_of_bedrooms
    input_data['number of bathrooms'] = number_of_bathrooms
    input_data['floor area (m2)'] = floor_area

    # Gérer la localisation (ville)
    if loc_index >= 0:
        input_data.iloc[0, loc_index] = 1

    # Gérer le type de propriété
    property_type_col = f'{property_type.lower()}' #convert to lower case
    if property_type_col in __data_columns:
        input_data[property_type_col] = 1

    # Gérer le classement BER
    ber_rating_col = f'{ber_rating.lower()}' #convert to lower case
    if ber_rating_col in __data_columns:
        input_data[ber_rating_col] = 1

    return round(__model.predict(input_data)[0], 2) # Corrected line

def get_location_name():
    return __locations

def get_ber_rating():
    return __ber_rating

def get_property_type():
    return __property_type

def load_saved_artifact():
    print("loading saved artifact...on")
    global __ber_rating
    global __property_type
    global __locations
    global __data_columns
    global __model

    with open("./artifact/irish_model2.json", 'r') as f:
        __data_columns = json.load(f)["data_columns"]
        __property_type = __data_columns[3:13]
        __locations = __data_columns[13:40]
        __ber_rating = __data_columns[40:]

    with open("./artifact/irish_model2.pickle", "rb") as f:
        __model = pickle.load(f)
        print("loading saved artifact...done")

if __name__ == '__main__':
    load_saved_artifact()
    print(get_location_name())
    print(get_estimated_price("dublin", 240,2,4, "House", "A2" ))
    print(get_estimated_price("galway", 200,3,5, "House", "A2" ))