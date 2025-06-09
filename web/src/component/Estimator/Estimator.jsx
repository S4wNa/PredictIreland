import { groups } from "./constants.js";

import "./Estimator.css";
import { useState, useEffect } from "react";

export default function Estimator() {
  const [form, setForm] = useState({
    localisation: "",
    bedrooms: "",
    bathrooms: "",
    floorArea: "",
    propertyType: "",
    berRating: "",
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger les données initiales (optionnelle)
  useEffect(() => {
    // Vous pouvez charger les options depuis votre API ici
    // fetchLocations();
    // fetchPropertyTypes();
    // fetchBerRatings();
  }, []);

  const handleChange = (e, id) => {
    let value = e.target.value;

    // Pour floorArea
    if (id === "floorArea" && value !== "") {
      if (!isNaN(Number(value)) && Number(value) <= 1200) {
        value = Number(value);
      } else {
        return; // N'accepte pas les valeurs invalides
      }
    }

    // Pour bedrooms et bathrooms
    if ((id === "bedrooms" || id === "bathrooms") && value !== "") {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 7) {
        value = numValue;
      } else {
        return; // N'accepte pas les valeurs invalides
      }
    }

    // Mettre à jour l'état du formulaire
    setForm({ ...form, [id]: value });
  };

  // Fonction pour prédire le prix en appelant l'API Flask
  const calculateEstimate = async () => {
    // Vérifier si les valeurs par défaut sont encore sélectionnées
    if (
      form.localisation === "Select a city" ||
      form.localisation === "" ||
      form.propertyType === "Select a property" ||
      form.propertyType === "" ||
      form.berRating === "Select a rank" ||
      form.berRating === "" ||
      form.bedrooms === "" ||
      form.bathrooms === "" ||
      form.floorArea === ""
    ) {
      alert("Veuillez remplir tous les champs correctement");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Préparation des données pour l'API
      const requestData = {
        location: form.localisation,
        floor_area: form.floorArea,
        number_of_bathrooms: form.bathrooms,
        number_of_bedrooms: form.bedrooms,
        property_type: form.propertyType,
        ber_rating: form.berRating,
      };

      // Appel à l'API Flask
      const response = await fetch("http://127.0.0.1:5000/predict_price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Mise à jour du prix estimé
      if (data.estimated_price) {
        const price = parseFloat(data.estimated_price);
        setEstimatedPrice(price.toLocaleString());

        // Calculer une fourchette de prix (±5%)
        const min = Math.round(price * 0.95);
        const max = Math.round(price * 1.05);
        setPriceRange({
          min: min.toLocaleString(),
          max: max.toLocaleString(),
        });
      } else {
        throw new Error("Pas de prix retourné par l'API");
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de la prédiction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="estimator-container" id="estimato">
        <h2>Estimate the price of a property</h2>

        <div className="second-container">
          {groups.map((group, index) => (
            <div key={index} className="box-estimator">
              <label htmlFor={group.id}>{group.label}</label>
              {group.type === "select" ? (
                <select
                  id={group.id}
                  value={form[group.id]}
                  onChange={(e) => handleChange(e, group.id)}
                >
                  {group.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={group.id === "floorArea" ? "text" : "number"}
                  id={group.id}
                  value={form[group.id]}
                  placeholder={`Enter ${group.label}`}
                  onChange={(e) => handleChange(e, group.id)}
                  min={group.type === "input" ? group.min : undefined}
                  max={group.type === "input" ? group.max : undefined}
                />
              )}
            </div>
          ))}
        </div>
        <button onClick={calculateEstimate} disabled={isLoading}>
          {isLoading ? "Calculating..." : "Estimate the price"}
        </button>
      </div>
      <div className="estimated-price">
        <h2>Price estimate</h2>
        {error && <p className="error">{error}</p>}
        {estimatedPrice && (
          <>
            <span>Estimated Price: {estimatedPrice} €</span>
            <p id="price-range">
              Price range: €{priceRange.min} - €{priceRange.max}
            </p>
            <p>
              This estimate is based on current market data and the
              characteristics of the property.
            </p>
          </>
        )}
        {!estimatedPrice && !isLoading && !error && (
          <p>
            Fill in the form and click "Estimate the price" to get a prediction.
          </p>
        )}
      </div>
    </section>
  );
}
