import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "nouislider/dist/nouislider.css";
import noUiSlider from "nouislider";
import "./Map.css";

// Import des icônes Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default function Map() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const sliderRef = useRef(null);
  const [priceFilter, setPriceFilter] = useState([0, 1000000]);
  const sliderInitialized = useRef(false);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        [53.35014, -6.266155],
        7
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      // Correction du problème d'icône par défaut
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });

      // Ajout de marqueur de test
      const marker = L.marker([53.35014, -6.266155], { price: 500000 }).addTo(
        mapInstance.current
      );

      // Gestion de l'événement de clic sur le marqueur
      marker.on("click", () => {
        // Afficher un popup personnalisé
        L.popup()
          .setLatLng([53.35014, -6.266155])
          .setContent("<b>Hello world!</b>")
          .openOn(mapInstance.current);

        // ou
        // Effectuer d'autres actions
        console.log("Marqueur cliqué !");
      });
    }

    if (sliderRef.current && !sliderInitialized.current) {
      noUiSlider.create(sliderRef.current, {
        start: priceFilter,
        connect: true,
        range: {
          min: 0,
          max: 1000000,
        },
        step: 10000,
      });

      sliderRef.current.noUiSlider.on("update", (values) => {
        const newFilter = values.map(Number);
        setPriceFilter(newFilter);
        console.log("Filtre de prix :", newFilter);

        mapInstance.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const price = layer.options.price;
            if (price < newFilter[0] || price > newFilter[1]) {
              layer.setOpacity(0);
            } else {
              layer.setOpacity(1);
            }
          }
        });
      });
      sliderInitialized.current = true;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <section id="map-section">
      <h2 id="Map-price">Real estate price map</h2>
      <div
        id="map"
        ref={mapRef}
        style={{
          height: "500px",
          borderRadius: "12px",
        }}
      >
        <div
          ref={sliderRef}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "200px",
          }}
        ></div>
      </div>
    </section>
  );
}
