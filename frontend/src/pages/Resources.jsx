// src/pages/Resources.jsx
import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadResources() {
      try {
        setLoading(true);
        setError("");

        // assumes your backend exposes GET /api/resources
        const res = await fetch(`${API_BASE}/api/resources`);

        if (!res.ok) {
          throw new Error("Failed to load resources");
        }

        const data = await res.json();
        setResources(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(
          "We couldn’t load the resources right now. Please refresh or try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  const filtered = resources.filter((item) => {
    const name = (item.name || item.country || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q);
  });

  return (
    <div className="page page-resources">
      {/* Header */}
      <section className="section">
        <h1 className="section-title">Resources</h1>
        <p className="section-subtitle">
          Explore immigration websites, competent authorities, forms, and
          country-specific notes to support your move across the Caribbean.
        </p>
      </section>

      {/* Search + content */}
      <section className="section">
        {/* Search bar */}
        <div className="resources-search">
          <input
            type="text"
            className="form-input"
            placeholder="Search by country or territory…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading resources…</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : filtered.length === 0 ? (
          <p>No resources found for that search.</p>
        ) : (
          <div className="resources-grid">
            {filtered.map((item) => {
              const name = item.name || item.country || "Country";
              const immigration = item.immigrationUrl || item.immigration;
              const authority =
                item.competentAuthorityUrl || item.competentAuthority;
              const forms = item.formsUrl || item.forms;
              const notes = item.notes || item.description;

              return (
                <article
                  key={item.id || item.code || name}
                  className="resource-card"
                >
                  <header className="resource-header">
                    <h2>{name}</h2>
                    {item.code && (
                      <span className="resource-tag">{item.code}</span>
                    )}
                  </header>

                  {notes && <p className="resource-notes">{notes}</p>}

                  <ul className="resource-links">
                    {immigration && (
                      <li>
                        <a
                          href={immigration}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Immigration website
                        </a>
                      </li>
                    )}
                    {authority && (
                      <li>
                        <a href={authority} target="_blank" rel="noreferrer">
                          Competent Authority
                        </a>
                      </li>
                    )}
                    {forms && (
                      <li>
                        <a href={forms} target="_blank" rel="noreferrer">
                          Forms / application portal
                        </a>
                      </li>
                    )}
                    {!immigration && !authority && !forms && (
                      <li className="resource-missing">
                        Official links not yet available. Please search the
                        destination country’s Ministry of Labour or Immigration
                        website for the most up-to-date information.
                      </li>
                    )}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Resources;
