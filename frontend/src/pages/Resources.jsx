import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function Resources() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const res = await fetch(`${API_BASE}/api/resources`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load resources");
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const code = (c.code || "").toLowerCase();
      return name.includes(query) || code.includes(query);
    });
  }, [items, q]);

  return (
    <div className="section">
      <h1 className="section-title">Resources</h1>
      <p className="section-subtitle">
        Explore immigration websites, competent authorities, forms, and notes.
      </p>

      <input
        className="form-input"
        placeholder="Search by country or territory..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {error && <p className="form-error">{error}</p>}

      <div style={{ marginTop: "1rem" }}>
        {filtered.map((c) => (
          <div key={c.code} className="planner-card" style={{ marginBottom: "1rem" }}>
            <h2 style={{ marginTop: 0 }}>{c.name} <span style={{ color: "#6b7280" }}>({c.code})</span></h2>

            <ul>
              {c.immigrationUrl && (
                <li>
                  <a href={c.immigrationUrl} target="_blank" rel="noreferrer">
                    Immigration website
                  </a>
                </li>
              )}
              {c.competentAuthorityUrl && (
                <li>
                  <a href={c.competentAuthorityUrl} target="_blank" rel="noreferrer">
                    Competent Authority
                  </a>
                </li>
              )}
              {c.formsUrl && (
                <li>
                  <a href={c.formsUrl} target="_blank" rel="noreferrer">
                    Forms / Online services
                  </a>
                </li>
              )}
            </ul>

            {c.notes && <p style={{ color: "#4b5563" }}>{c.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
