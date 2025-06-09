import React from "react";
import "./Tool.css";

export default function Tool() {
  return (
    <section>
      <div className="tool-container">
        <h2>Why use our tool?</h2>

        <div className="tools">
          <div className="tool">
            <span>📊</span>
            <h4>Accuracy</h4>
            <p>
              Our machine learning model has been trained on millions of real
              estate transactions in Ireland.
            </p>
          </div>
          <div className="tool">
            <span>🔍</span>
            <h4>Detailed analysis</h4>
            <p>
              Get insights into the factors that influence the price of your
              property.
            </p>
          </div>
          <div className="tool">
            <span>📈</span>
            <h4>Market trends</h4>
            <p>
              Access historical trends and future forecasts for your area of
              interest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
