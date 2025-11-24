import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <div className="navbar-logo">
          <NavLink to="/" onClick={closeMenu}>
            <img src="/logo.png" alt="kesiolabs_logo" />
          </NavLink>
        </div>

        {/* HAMBURGER (mobil) */}
        <button
          className={`nav-toggle ${isOpen ? "is-open" : ""}`}
          onClick={toggleMenu}
          aria-label="Menüyü aç/kapat"
        >
          <span />
          <span />
          <span />
        </button>

        {/* MENÜ */}
        <div className={`navbar-links ${isOpen ? "is-open" : ""}`}>
          <NavLink
            className="nav-item"
            to="/"
            onClick={closeMenu}
          >
            <span className="nav-text">Ana Sayfa</span>
          </NavLink>
          <span className="nav-divider" />

          <NavLink
            className="nav-item"
            to="/Hakkimizda"
            onClick={closeMenu}
          >
            <span className="nav-text">Hakkımızda</span>
          </NavLink>
          <span className="nav-divider" />

          <NavLink
            className="nav-item"
            to="/BoyleCalisir"
            onClick={closeMenu}
          >
            <span className="nav-text">Böyle Çalışır</span>
          </NavLink>
          <span className="nav-divider" />

          <NavLink
            className="nav-item"
            to="/TeklifAl"
            onClick={closeMenu}
          >
            <span className="nav-text">Teklif Al</span>
          </NavLink>
          <span className="nav-divider" />

          <NavLink
            className="nav-item"
            to="/Blog"
            onClick={closeMenu}
          >
            <span className="nav-text">Blog</span>
          </NavLink>
        </div>

      </div>
    </nav>
  );
}
