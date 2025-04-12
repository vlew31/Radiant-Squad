import "../styles/Navbar.css";
import { useState } from "react";

interface NavbarProps {
  currentPath: string;
}

export const Navbar = ({ currentPath }: NavbarProps) => {
  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          Radiant Squad
        </a>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a 
              href="/" 
              className={`navbar-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </a>
          </li>
          <li className="navbar-item">
            <a 
              href="/upload" 
              className={`navbar-link ${isActive("/upload") ? "active" : ""}`}
            >
              Upload Images
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}; 