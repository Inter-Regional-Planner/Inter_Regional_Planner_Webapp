// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
/*import "./Navbar.css"; // optional, or just rely on index.css*/

function Navbar() {
  return (
    <header className="nav-wrapper">
      <nav className="nav">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          {/* You can replace with an <img src="/logo.svg" /> */}
          <span className="nav-logo-mark">IR</span>
          <span className="nav-logo-text">Movement Planner</span>
        </Link>

        {/* Center links */}
        <div className="nav-links">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/plan-my-move" className="nav-link">
            Plan my Move
          </NavLink>
          <NavLink to="/my-plan" className="nav-link">
            My Plan
          </NavLink>
          <NavLink to="/resources" className="nav-link">
            Resources
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          <Link to="/signup" className="nav-secondary-btn">
            Sign in
          </Link>
          <Link to="/login" className="nav-primary-btn">
            Log in
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
