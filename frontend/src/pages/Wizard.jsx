// src/pages/Wizard.jsx
// src/pages/Wizard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanner } from "../planner/PlannerContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function Wizard() {
  const navigate = useNavigate();
  const {
    homeCountry,
    setHomeCountry,
    targetCountry,
    setTargetCountry,
    category,
    setCategory,
    setPlan,
    isAuthenticated,
    savePlanToDatabase,
  } = usePlanner();

  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load country + category options
  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);
        setError("");

        const [countriesRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/api/countries`),
          fetch(`${API_BASE}/api/categories`),
        ]);

        const countriesData = await countriesRes.json().catch(() => []);
        const categoriesData = await categoriesRes.json().catch(() => []);

        if (!countriesRes.ok || !categoriesRes.ok) {
          console.error("Options error:", { countriesData, categoriesData });
          throw new Error("Failed to load options");
        }

        setCountries(Array.isArray(countriesData) ? countriesData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        console.error("loadOptions error:", err);
        setError("Unable to load options right now. Please refresh or try again later.");
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!homeCountry || !targetCountry || !category) {
      setError("Please select your home country, destination, and category.");
      return;
    }

    if (homeCountry === targetCountry) {
      setError("Home country and destination country cannot be the same.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fromCountry: homeCountry, // Country.code like "TT"
        toCountry: targetCountry, // Country.code like "BB"
        category: String(category), // Category.code
      };

      const res = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Plan error response:", data);
        throw new Error(data.details || data.error || "Failed to generate plan.");
      }

      setPlan(data);

      if (isAuthenticated()) {
        await savePlanToDatabase({
          ...payload,
          ...data,
        });
      }

      navigate("/my-plan");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Something went wrong while generating your plan.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingOptions) {
    return (
      <div className="page page-wizard">
        <section className="section">
          <h1>Plan My Move</h1>
          <p>Loading countries and categories...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page page-wizard">
      <section className="section">
        <h1>Plan My Move</h1>
        <p className="section-subtitle">
          Tell us about your move so we can create a personalized guidance plan.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="wizard-form">
          <div className="wizard-step">
            <label className="form-label">
              <span className="wizard-label-text">Where are you moving FROM?</span>
              <select
                value={homeCountry}
                onChange={(e) => setHomeCountry(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select your home country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="wizard-step">
            <label className="form-label">
              <span className="wizard-label-text">Where are you moving TO?</span>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select destination country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="wizard-step">
            <label className="form-label">
              <span className="wizard-label-text">What is your professional category?</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select your category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Generating Plan..." : "Generate My Plan"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Wizard;
