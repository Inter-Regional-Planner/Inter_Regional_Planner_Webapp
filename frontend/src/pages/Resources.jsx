import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:4000';

export default function Resources() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/countries`);
        const json = await res.json();
        setCountries(json);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <section>
      <h1>Resources</h1>
      <p>
        Use this page as a starting point for doing deeper research on your
        target country. Always rely on official government and CARICOM websites
        for final decisions.
      </p>

      <h2>Participating CSME Member States (Sample List)</h2>
      <ul>
        {countries.map(c => (
          <li key={c.code}>
            <strong>{c.name}</strong> ({c.code})
          </li>
        ))}
      </ul>

      <h2>What to Research</h2>
      <ul>
        <li>Which institution is the Competent Authority for your category</li>
        <li>Latest immigration rules and entry requirements</li>
        <li>Updated Skills Certificate application forms and fees</li>
        <li>Any changes in approved categories for free movement of skills</li>
      </ul>

      <p>
        You can also search for &quot;CARICOM Skills Certificate&quot; together
        with the name of your host country in an online search engine to locate
        official documentation.
      </p>
    </section>
  );
}
