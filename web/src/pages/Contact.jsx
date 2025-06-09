import React from "react";
import "./Contact.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useState } from "react";

export default function ContactPage() {
  const [value, setValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    target: "",
    place: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setValue({ ...value, [e.target.name]: e.target.value });
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const contactRoute = "/api/contact";
    const fullUrl = `${backendUrl}${contactRoute}`;

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Message envoyé avec succès !");
        setValue({
          firstName: "",
          lastName: "",
          email: "",
          target: "",
          place: "",
        });
      } else {
        setError(data.message || "Une erreur s'est produite lors de l'envoi du message.");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      setError("Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <nav className="navbar">
        <div className="left-side">
          <span>🏡</span>
          <h2>PredictIreland</h2>
        </div>

        <ul className="right-side">
          <li>
            <Link to="/" className="contact-nav-link">
              Home
            </Link>
            <Link to="/#Map-price" className="contact-nav-link">
              Price map
            </Link>
            <a href="#" className="contact-nav-link">
              Trend (Coming soon)
            </a>
            <Link to="/contact" className="contact-nav-link">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1>Reach out to us</h1>
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="firstName"></label>
          <input
            value={value.firstName}
            id="firstName"
            placeholder="First Name"
            type="text"
            name="firstName"
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <label htmlFor="lastName"></label>
          <input
            value={value.lastName}
            id="lastName"
            placeholder="Last Name"
            type="text"
            name="lastName"
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <label htmlFor="email"></label>
          <input
            value={value.email}
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <div className="target-container">
            <label htmlFor="target"></label>
            <input
              type="radio"
              id="company"
              value="company"
              name="target"
              checked={value.target === "company"}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            Company
            <input
              type="radio"
              id="personal"
              value="personal"
              checked={value.target === "personal"}
              name="target"
              onChange={handleChange}
              disabled={isSubmitting}
            />
            Personal
          </div>
          <label htmlFor="place"></label>
          <textarea
            id="place"
            name="place"
            onChange={handleChange}
            placeholder="What do you want to know"
            cols="20"
            rows="5"
            value={value.place}
            required
            disabled={isSubmitting}
          ></textarea>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SENDING..." : "SEND"}
          </button>
        </form>
      </div>
    </div>
  );
}
