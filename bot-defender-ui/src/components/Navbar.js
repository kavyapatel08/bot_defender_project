import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Shield, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => setIsOpen(!isOpen);

  // Check if we are on the main landing page to show scroll links
  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <RouterLink to="/" className="navbar-logo">
          <Shield size={28} color="#00ff88" />
          <span>Bot Defender</span>
        </RouterLink>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          {isHomePage ? (
            <>
              <li className="nav-item">
                <ScrollLink activeClass="active-link" to="home" spy={true} smooth={true} offset={-80} duration={500} className="nav-links" onClick={toggleMenu}>Home</ScrollLink>
              </li>
              <li className="nav-item">
                <ScrollLink activeClass="active-link" to="how-it-works" spy={true} smooth={true} offset={-80} duration={500} className="nav-links" onClick={toggleMenu}>How It Works</ScrollLink>
              </li>
              <li className="nav-item">
                <ScrollLink activeClass="active-link" to="about" spy={true} smooth={true} offset={-80} duration={500} className="nav-links" onClick={toggleMenu}>About Me</ScrollLink>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <RouterLink to="/" className="nav-links" onClick={toggleMenu}>← Back to Home</RouterLink>
            </li>
          )}
          <li className="nav-item">
            <RouterLink to="/login" className="nav-links-mobile" onClick={toggleMenu}>Login / Sign Up</RouterLink>
          </li>
        </ul>

        <div className="nav-btn">
          <RouterLink to="/login" className="btn-primary">Login / Sign Up</RouterLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;