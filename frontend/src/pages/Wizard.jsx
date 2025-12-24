// src/pages/Wizard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanner } from "../planner/PlannerContext";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function Wizard() {
  const navigate = useNavigate();
  const { setSelection, setPlan } = usePlanner();

  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [category, setCategory] = useState("");
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

        setCountries(countriesData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("loadOptions error:", err);
        setError(
          "Unable to load options right now. Please refresh or try again later."
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fromCountry || !toCountry || !category) {
      setError("Please select your home country, destination, and category.");
      return;
    }

    try {
      setSubmitting(true);

      // Save selection in context for the My Plan page
      setSelection({
        fromCountry,
        toCountry,
        category,
      });

      // If user is logged in, include their id
      const currentUser = JSON.parse(
        localStorage.getItem("irp_user") || "null"
      );
      const userId = currentUser?.id || null;

      const res = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCountry,
          toCountry,
          category,
          userId, // backend treats null as guest
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Plan error response:", data);
        throw new Error(data.error || "Failed to generate plan.");
      }

      // Save plan in context and go to My Plan page
      setPlan(data);
      navigate("/my-plan");
    } catch (err) {
      console.error("Plan generation error:", err);
      setError(
        err.message ||
          "We couldn’t generate your plan right now. Please check your inputs and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-wizard">
      {/* Header */}
      <section className="section">
        <h1 className="section-title">Plan My Move</h1>
        <p className="section-subtitle">
          Tell us where you&apos;re coming from, where you&apos;d like to work,
          and your professional category. We&apos;ll generate a simple,
          personalized guide based on CSME Free Movement of Skills.
        </p>
      </section>

      {/* Layout: form + help panel */}
      <section className="section">
        <div className="planner-grid">
          {/* Left: form */}
          <div className="planner-card">
            {loadingOptions ? (
              <p>Loading options…</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <p className="form-error">{error}</p>}

                <label className="form-label">
                  I am from
                  <select
                    className="form-input"
                    value={fromCountry}
                    onChange={(e) => setFromCountry(e.target.value)}
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="form-label">
                  I want to work in
                  <select
                    className="form-input"
                    value={toCountry}
                    onChange={(e) => setToCountry(e.target.value)}
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="form-label">
                  My category
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={submitting}
                >
                  {submitting ? "Generating plan…" : "Generate My Plan"}
                </button>
              </form>
            )}
          </div>

          {/* Right: explainer */}
          <div className="planner-card secondary">
            <h2>What you&apos;ll receive</h2>
            <ul className="planner-list">
              <li>Eligibility summary based on your move.</li>
              <li>Country- and category-specific requirements.</li>
              <li>Document checklist with explanations.</li>
              <li>Estimated timeline for key steps.</li>
              <li>Links to official websites and authorities.</li>
            </ul>

            <h3>Tips</h3>
            <ul className="planner-list">
              <li>Make sure your category matches your actual qualification.</li>
              <li>
                You can rerun the planner with different combinations to compare
                options.
              </li>
              <li>
                Keep copies of all documents and receipts for immigration and
                Skills Certificate applications.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Wizard;

