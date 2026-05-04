import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar glass-morphism">
      <div className="container nav-container">
        <Link to="/" className="logo">
          Port<span>folio</span>
        </Link>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#hero" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#skills" onClick={() => setIsOpen(false)}>Skills</a>
          <a href="#projects" onClick={() => setIsOpen(false)}>Projects</a>
          <a href="#certificates" onClick={() => setIsOpen(false)}>Certificates</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
        </div>

        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          <div className={`bar ${isOpen ? 'active' : ''}`}></div>
          <div className={`bar ${isOpen ? 'active' : ''}`}></div>
          <div className={`bar ${isOpen ? 'active' : ''}`}></div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
