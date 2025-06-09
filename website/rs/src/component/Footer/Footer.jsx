import { Link } from "react-router-dom";
import "./Footer.css";

import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-element1">
          <h4>PredictIreland</h4>
          <p>
            Our state-of-the-art technology helps you make informed real estate
            decisions in Ireland.
          </p>
        </div>
        <div className="footer-element">
          <h4>Useful links</h4>

          <a href="">
            <p>Home</p>
          </a>

          <a href="#Map-price">
            <p>Price Map</p>
          </a>

          <a>
            <p>Trend (Coming soon)</p>
          </a>

          <Link to="/contact">
            <p>Contact</p>
          </Link>
        </div>
        <div className="footer-element">
          <h4>Contact</h4>
          <p>predictireland123@gmail.com</p>
          <p>+353 1 234 5678</p>
          <p>22 Lower Buckingham Street, Dublin</p>
        </div>
      </div>
      <hr />
      <p id="footer-end">© 2025 PredictIreland All rights reserved.</p>
    </footer>
  );
}
