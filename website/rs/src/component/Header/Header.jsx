import "./Header.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav className="navbar">
        <div className="left-side">
          <span>🏡</span>
          <h2>PredictIreland</h2>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>

        <ul className={`right-side ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="#" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>
            <a href="#Map-price" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Price map
            </a>
            <a href="#" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Trend (Coming soon)
            </a>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="headline-container">
        <div className="center">
          <h1>Property price prediction in Ireland</h1>
          <p>
            Find out the estimated value of any property in Ireland using our
            advanced machine learning algorithm.
          </p>
        </div>
      </div>
    </header>
  );
}
