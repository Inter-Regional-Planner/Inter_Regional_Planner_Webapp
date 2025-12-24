// src/pages/About.jsx
function About() {
  return (
    <div className="page page-about">
      {/* Hero banner */}
      <section className="banner">
        <div className="banner-overlay" />
        <div className="banner-content">
          <h1>About the Platform</h1>
          <p>Empowering Caribbean Mobility Through Technology.</p>
        </div>
      </section>

      {/* What is the platform */}
      <section className="section section-about-main">
        <div className="about-two-column">
          <div>
            <h2>What is the Inter Regional Movement Planner?</h2>
            <p>
              A digital platform that helps Caribbean nationals understand how
              to work legally in other CARICOM countries under CSME. The
              Movement Planner is designed to make CSME free movement easier,
              clearer, and more accessible for every Caribbean national.
            </p>
            <p>It provides:</p>
            <ul>
              <li>Personalized move plans</li>
              <li>Document checklists</li>
              <li>Estimated timelines</li>
              <li>Official government links</li>
              <li>Competent Authority details</li>
              <li>Country-specific requirements</li>
              <li>Tools to track progress and save plans (for logged-in users)</li>
            </ul>
          </div>
          <div className="about-placeholder-card">
            {/* You can replace this with an image or illustration */}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-values">
        <h2>What We Stand For</h2>
        <div className="values-grid">
          <span>Clarity</span>
          <span>Empowerment</span>
          <span>Innovation</span>
          <span>Accessibility</span>
          <span>Unity</span>
        </div>
      </section>

      {/* Impact & Mission */}
      <section className="section section-impact">
        <p className="impact-quote">
          We envision a future where regional mobility is seamless,
          opportunities are borderless, and Caribbean professionals can
          confidently build their futures anywhere across the region.
        </p>

        <div className="about-two-column">
          <div className="about-placeholder-card" />
          <div>
            <h2>Mission Statement</h2>
            <p>
              We believe that Caribbean talent should be able to move freely
              across the region with clarity and confidence. The Inter Regional
              Movement Planner was created to bridge the gap between CARICOM
              policies and real-world user experience.
            </p>
            <p>Our mission is to provide:</p>
            <ul>
              <li>
                Clear, personalized guidance on how to work across CSME Member
                States
              </li>
              <li>
                Transparent requirements for each category and country
              </li>
              <li>
                Practical tools like checklists, timelines, and official links
              </li>
              <li>
                A simple digital space where anyone—student, professional, or
                employer—can understand and navigate regional mobility
              </li>
            </ul>
            <p>
              By translating policy into an intuitive digital planner, we aim to
              support economic opportunity, strengthen regional integration, and
              help build a more connected Caribbean workforce.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
