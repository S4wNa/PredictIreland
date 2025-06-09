import React from "react";
import "./index.css";

import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";

import Estimator from "./component/Estimator/Estimator";
import Tool from "./component/Tool/Tool";
import Map from "./component/Map/Map";
import ContactPage from "./pages/Contact";

import { Routes, Route } from "react-router-dom";

const Layout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Estimator />
            <Tool />
            <Map />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={<ContactPage />}
      />
    </Routes>
  );
}
