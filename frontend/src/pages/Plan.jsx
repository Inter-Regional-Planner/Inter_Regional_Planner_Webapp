// src/pages/Plan.jsx
import { useEffect, useState } from "react";
import { usePlanner } from "../planner/PlannerContext";
import { Link } from "react-router-dom";

function Plan() {
  const { selection, plan } = usePlanner();
  const [checklistState, setChecklistState] = useState({});

  // Build a stable key to store checklist completion in localStorage
  const storageKey = selection
    ? `csme-plan-${selection.fromCountry}-${selection.toCountry}-${selection.category}`
    : "csme-plan-generic";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setChecklistState(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checklistState));
    } catch {
      // ignore
    }
  }, [checklistState, storageKey]);

  if (!selection || !plan) {
    return (
      <div className="page page-myplan">
        <section className="section">
          <h1>Your Move Plan</h1>
          <p>
            We couldn&apos;t find a current plan. Please start by using{" "}
            <Link to="/plan-my-move">Plan my Move</Link> to generate a new one.
          </p>
        </section>
      </div>
    );
  }

  const checklist = plan.checklist || [];
  const timeline = plan.timeline || {};
  const officialLinks = plan.officialLinks || {};
  const notes = plan.notes || plan.countryNotes || "";

  function toggleChecklistItem(id) {
    setChecklistState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  const completedCount = checklist.filter(
    (item) => checklistState[item.id]
  ).length;

  return (
    <div className="page page-plan">
      {/* Header */}
      <section className="section">
        <h1 className="section-title">Your Move Plan</h1>
        <p className="section-subtitle">
          Personalized guidance for moving from{" "}
          <strong>{selection.fromCountry}</strong> to{" "}
          <strong>{selection.toCountry}</strong> as a{" "}
          <strong>{selection.category}</strong> under CSME.
        </p>
      </section>

      {/* Overview cards */}
      <section className="section">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Overview</h3>
            <p>{plan.summary || "This is your high-level migration plan."}</p>
            <ul>
              <li>
                <strong>From:</strong> {selection.fromCountry}
              </li>
              <li>
                <strong>To:</strong> {selection.toCountry}
              </li>
              <li>
                <strong>Category:</strong> {selection.category}
              </li>
            </ul>
          </div>

          <div className="feature-card">
            <h3>Key Notes</h3>
            <p>
              {notes ||
                "Review the specific rules in your destination country and ensure your documents match the required formats."}
            </p>
          </div>

          <div className="feature-card">
            <h3>Progress</h3>
            <p>
              {checklist.length > 0 ? (
                <>
                  You have completed{" "}
                  <strong>
                    {completedCount} / {checklist.length}
                  </strong>{" "}
                  checklist items.
                </>
              ) : (
                "Checklist items will appear here once they are available for this plan."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Checklist + timeline */}
      <section className="section">
        <div className="about-two-column">
          {/* Checklist */}
          <div className="step-card">
            <h2>Document Checklist</h2>
            <p>
              Use this list to keep track of what you&apos;ve already prepared.
            </p>
            {checklist.length === 0 ? (
              <p>No checklist items were provided for this plan.</p>
            ) : (
              <ul className="planner-list">
                {checklist.map((item) => (
                  <li key={item.id} className="checklist-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!checklistState[item.id]}
                        onChange={() => toggleChecklistItem(item.id)}
                      />{" "}
                      <span className="checklist-label">{item.label}</span>
                    </label>
                    {item.description && (
                      <p className="checklist-description">
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Timeline */}
          <div className="step-card">
            <h2>Estimated Timeline</h2>
            <p>
              These are rough estimates to help you plan ahead. Actual times may
              vary by country and institution.
            </p>
            <ul className="planner-list">
              {timeline.documents && (
                <li>
                  <strong>Gather documents:</strong> {timeline.documents}
                </li>
              )}
              {timeline.skillsCertificate && (
                <li>
                  <strong>Apply for Skills Certificate:</strong>{" "}
                  {timeline.skillsCertificate}
                </li>
              )}
              {timeline.verification && (
                <li>
                  <strong>Verification in host country:</strong>{" "}
                  {timeline.verification}
                </li>
              )}
              {!timeline.documents &&
                !timeline.skillsCertificate &&
                !timeline.verification && (
                  <li>
                    Timeline details will be added as we expand coverage for
                    more routes.
                  </li>
                )}
            </ul>
          </div>
        </div>
      </section>

      {/* Official links */}
      <section className="section">
        <div className="step-card">
          <h2>Official Links & Next Steps</h2>
          <p>
            Always confirm requirements with the official government websites
            and competent authorities in both your home and destination
            countries.
          </p>

          <ul className="planner-list">
            {officialLinks.immigration && (
              <li>
                <a
                  href={officialLinks.immigration}
                  target="_blank"
                  rel="noreferrer"
                >
                  Immigration website (destination country)
                </a>
              </li>
            )}
            {officialLinks.competentAuthority && (
              <li>
                <a
                  href={officialLinks.competentAuthority}
                  target="_blank"
                  rel="noreferrer"
                >
                  Competent Authority for Skills Certificates
                </a>
              </li>
            )}
            {officialLinks.forms && (
              <li>
                <a href={officialLinks.forms} target="_blank" rel="noreferrer">
                  Forms or application portal
                </a>
              </li>
            )}
            {!officialLinks.immigration &&
              !officialLinks.competentAuthority &&
              !officialLinks.forms && (
                <li>
                  Official links are not yet available for this combination.
                  Please search for the Ministry of Labour or Immigration
                  website in your destination country.
                </li>
              )}
          </ul>

          <div style={{ marginTop: "1rem" }}>
            <Link to="/plan-my-move" className="btn-secondary">
              Try Another Country or Category
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Plan;

