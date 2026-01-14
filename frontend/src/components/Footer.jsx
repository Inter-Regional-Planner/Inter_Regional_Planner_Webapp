// src/components/Footer.jsx
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo"></div>
          <p className="footer-tagline">
            Inter Regional Movement Planner — Bridging islands, building
            futures.
          </p>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4>Use cases</h4>
            <ul>
              <li>Students & Graduates</li>
              <li>Skilled Professionals</li>
              <li>Regional Job Seekers</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li>CSME Basics</li>
              <li>Planner Wizard</li>
              <li>Country Resources</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>Help & FAQ</li>
              <li>Contact</li>
              <li>Privacy & Terms</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
