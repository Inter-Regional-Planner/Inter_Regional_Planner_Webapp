// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { usePlanner } from "../planner/PlannerContext";

function Navbar() {
  const { isAuthenticated, user, clearAuth } = usePlanner();

  const handleLogout = () => {
    clearAuth();
    // Redirect to home after logout
    window.location.href = '/';
  };

  return (
    <header className="nav-wrapper">
      <nav className="nav">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="nav-logo-mark"></span>
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
          {isAuthenticated() ? (
            <>
              <span className="nav-user-greeting">
                Hi, {user?.name || 'User'}
              </span>
              <button 
                onClick={handleLogout} 
                className="nav-primary-btn"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-secondary-btn">
                Sign up
              </Link>
              <Link to="/login" className="nav-primary-btn">
                Log in
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
