
// src/pages/Home.jsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page page-home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Inter Regional Movement Planner</h1>
          <p className="hero-subtitle">Bridging Islands, Building Futures.</p>

          <div className="hero-actions">
            <Link to="/plan-my-move" className="btn-primary">
              Start My Move Plan
            </Link>
            <Link to="/csme-basics" className="btn-secondary">
              Learn About CSME
            </Link>
          </div>
        </div>
      </section>

      {/* Why use section */}
      <section className="section section-why">
        <h2 className="section-title">Why use the Movement Planner?</h2>
        <p className="section-subtitle">
          A smarter way to navigate work and mobility across CARICOM nations.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Built for CARICOM</h3>
            <p>Designed specifically for regional free movement and CSME.</p>
          </div>
          <div className="feature-card">
            <h3>Personalized Move Plan</h3>
            <p>
              Get customized steps based on your home country, destination, and
              profession.
            </p>
          </div>
          <div className="feature-card">
            <h3>Smart Checklist</h3>
            <p>Know exactly which documents you need, with explanations.</p>
          </div>
          <div className="feature-card">
            <h3>Action Timeline</h3>
            <p>
              See estimated timelines and suggested dates to keep you on track.
            </p>
          </div>
          <div className="feature-card">
            <h3>Country Requirements</h3>
            <p>View country-specific notes, links, and verification steps.</p>
          </div>
          <div className="feature-card">
            <h3>Save & Track Progress</h3>
            <p>Log in to save your plan and track your checklist over time.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-how">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Plan your move across the Caribbean in four simple steps.
        </p>

        <div className="steps-list">
          <div className="step-card">
            <h3>Step 1 — Tell Us Your Migration Details</h3>
            <p>
              Select your home country, destination country, and professional
              category:
            </p>
            <ul>
              <li>Choose where you&apos;re coming from</li>
              <li>Choose where you want to work</li>
              <li>
                Pick your category (Graduate, Nurse, Artisan, Teacher, etc.)
              </li>
            </ul>
          </div>

          <div className="step-card">
            <h3>Step 2 — Generate Your Personalized Migration Plan</h3>
            <p>
              Get a customized guide based on your exact country-to-country
              path, including:
            </p>
            <ul>
              <li>Eligibility summary</li>
              <li>Country-specific requirements</li>
              <li>Category-specific documents</li>
              <li>Verification steps</li>
            </ul>
          </div>

          <div className="step-card">
            <h3>Step 3 — Complete Your Interactive Checklist</h3>
            <p>Track everything you need with clear, actionable tasks:</p>
            <ul>
              <li>Document checklist with explanations</li>
              <li>Sample templates & document hints</li>
              <li>Status tracking with checkmarks</li>
              <li>“Add to calendar” suggestions (future feature)</li>
            </ul>
          </div>

          <div className="step-card">
            <h3>Step 4 — Explore Resources & Take Action</h3>
            <p>Access official websites, competent authorities, and links:</p>
            <ul>
              <li>Visit immigration websites</li>
              <li>Find competent authorities</li>
              <li>Download forms</li>
              <li>Read country-specific tips</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
