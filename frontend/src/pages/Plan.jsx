// src/pages/Plan.jsx
import { useEffect, useState } from "react";
import { usePlanner } from "../planner/PlannerContext";
import { Link } from "react-router-dom";
import { exportPlanToPDF } from "../utils/pdfExport";

function Plan() {
  const { 
    homeCountry, 
    targetCountry, 
    category, 
    plan, 
    isAuthenticated,
    user,
    saveChecklistProgress 
  } = usePlanner();
  
  const [checklistState, setChecklistState] = useState({});
  const [userPlans, setUserPlans] = useState([]);

  // Build storage key for guest users
  const storageKey = homeCountry && targetCountry && category
    ? `csme-plan-${homeCountry}-${targetCountry}-${category}`
    : null;

  // Load checklist state
  useEffect(() => {
    if (plan?.checklist) {
      if (isAuthenticated() && plan.planId) {
        setChecklistState(plan.checklistJson || {});
      } else if (storageKey) {
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            setChecklistState(JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      }
    }
  }, [plan, isAuthenticated, storageKey]);

  // Load user's saved plans if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      loadUserPlans();
    }
  }, [isAuthenticated]);

  // Save checklist progress
  useEffect(() => {
    if (Object.keys(checklistState).length > 0) {
      if (isAuthenticated() && plan?.planId) {
        saveChecklistProgress(plan.planId, checklistState);
      } else if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(checklistState));
        } catch {
          // ignore
        }
      }
    }
  }, [checklistState, isAuthenticated, plan?.planId, storageKey, saveChecklistProgress]);

  const loadUserPlans = async () => {
    try {
      const token = localStorage.getItem('irp_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const plans = await response.json();
        setUserPlans(plans);
      }
    } catch (err) {
      console.error('Failed to load user plans:', err);
    }
  };

  const toggleChecklistItem = (id) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExportPDF = () => {
    if (!plan) return;
    
    exportPlanToPDF(
      plan, 
      homeCountry, 
      targetCountry, 
      category, 
      checklistState,
      isAuthenticated()
    );
  };

  // If no current plan, show welcome message
  if (!plan) {
    return (
      <div className="page page-myplan">
        <section className="section">
          <h1>Your Move Plan</h1>
          
          {isAuthenticated() && user && (
            <div className="user-profile-section">
              <div className="feature-card">
                <h3>Welcome back, {user.name}!</h3>
                <div className="user-info">
                  <p><strong>Email:</strong> {user.email}</p>
                  {user.country && <p><strong>Country:</strong> {user.country}</p>}
                </div>
                <p>You have {userPlans.length} saved plan{userPlans.length !== 1 ? 's' : ''}.</p>
              </div>
            </div>
          )}
          
          <p>
            Welcome! Create your personalized CSME move plan to get started.
          </p>
          <Link to="/plan-my-move" className="btn-primary">
            Create My First Plan
          </Link>
        </section>
      </div>
    );
  }

  const checklist = plan?.checklist || [];
  const timeline = plan?.timeline || {};
  const officialLinks = plan?.officialLinks || {};
  const notes = plan?.notes || "";
  const summary = plan?.summary || "";

  const completedCount = checklist.filter(
    (item) => checklistState[item.id]
  ).length;

  return (
    <div className="page page-plan">
      <section className="section">
        <h1 className="section-title">Your Move Plan</h1>
        
        {isAuthenticated() && user && (
          <div className="user-profile-section">
            <div className="feature-card">
              <h3>Welcome back, {user.name}!</h3>
              <div className="user-info">
                <p><strong>Email:</strong> {user.email}</p>
                {user.country && <p><strong>Country:</strong> {user.country}</p>}
              </div>
            </div>
          </div>
        )}
        
        {homeCountry && targetCountry && category && (
          <p className="section-subtitle">
            Personalized guidance for moving from{" "}
            <strong>{getCountryLabel(homeCountry)}</strong> to{" "}
            <strong>{getCountryLabel(targetCountry)}</strong> as a{" "}
            <strong>{getCategoryLabel(category)}</strong> under CSME.
          </p>
        )}
      </section>

      <section className="section">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Overview</h3>
            <p>{summary}</p>
            {homeCountry && (
              <ul>
                <li><strong>From:</strong> {getCountryLabel(homeCountry)}</li>
                <li><strong>To:</strong> {getCountryLabel(targetCountry)}</li>
                <li><strong>Category:</strong> {getCategoryLabel(category)}</li>
              </ul>
            )}
          </div>

          <div className="feature-card">
            <h3>Key Notes</h3>
            <p>{notes || "Review the specific rules in your destination country."}</p>
          </div>

          <div className="feature-card">
            <h3>Progress</h3>
            <p>
              {checklist.length > 0 ? (
                <>
                  You have completed{" "}
                  <strong>{completedCount} / {checklist.length}</strong> checklist items.
                </>
              ) : (
                "No checklist items available."
              )}
            </p>
            {isAuthenticated() && (
              <p className="save-indicator">✓ Progress saved automatically</p>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="about-two-column">
          <div className="step-card">
            <h2>Document Checklist</h2>
            <ul className="planner-list">
              {checklist.map((item) => (
                <li key={item.id} className="checklist-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!checklistState[item.id]}
                      onChange={() => toggleChecklistItem(item.id)}
                    />
                    <span className="checklist-label">{item.label}</span>
                  </label>
                  {item.description && (
                    <p className="checklist-description">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="step-card">
            <h2>Estimated Timeline</h2>
            <ul className="planner-list">
              {timeline.documents && (
                <li><strong>Gather documents:</strong> {timeline.documents}</li>
              )}
              {timeline.skillsCertificate && (
                <li><strong>Apply for Skills Certificate:</strong> {timeline.skillsCertificate}</li>
              )}
              {timeline.verification && (
                <li><strong>Verification:</strong> {timeline.verification}</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="step-card">
          <h2>Official Links & Next Steps</h2>
          <ul className="planner-list">
            {officialLinks.immigration && (
              <li>
                <a href={officialLinks.immigration} target="_blank" rel="noreferrer">
                  Immigration website (destination country)
                </a>
              </li>
            )}
            {officialLinks.competentAuthority && (
              <li>
                <a href={officialLinks.competentAuthority} target="_blank" rel="noreferrer">
                  Competent Authority for Skills Certificates
                </a>
              </li>
            )}
          </ul>

          <div className="plan-actions">
            <Link to="/plan-my-move" className="btn-secondary">
              Try Another Country or Category
            </Link>
            
            <button onClick={handleExportPDF} className="btn-secondary">
              Export as PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper functions for consistent labeling
const getCountryLabel = (code) => {
  const countries = {
    'TT': 'Trinidad and Tobago', 'BB': 'Barbados', 'JM': 'Jamaica',
    'GY': 'Guyana', 'LC': 'Saint Lucia', 'GD': 'Grenada',
    'DM': 'Dominica', 'VC': 'St. Vincent and the Grenadines',
    'KN': 'St. Kitts and Nevis', 'AG': 'Antigua and Barbuda',
    'SR': 'Suriname', 'BZ': 'Belize'
  };
  return countries[code] || code;
};

const getCategoryLabel = (id) => {
  const categories = {
    'university_graduate': 'University Graduate', 'artiste': 'Artiste',
    'musician': 'Musician', 'media_worker': 'Media Worker',
    'sportsperson': 'Sportsperson', 'nurse': 'Nurse',
    'teacher': 'Teacher', 'artisan': 'Artisan',
    'associate_degree': 'Holder of Associate Degree',
    'domestic_worker': 'Domestic Worker',
    'agricultural_worker': 'Agricultural Worker',
    'private_security_officer': 'Private Security Officer'
  };
  return categories[id] || id;
};

export default Plan;