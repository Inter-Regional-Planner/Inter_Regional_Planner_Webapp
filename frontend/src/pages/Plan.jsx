import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlanner } from '../planner/PlannerContext';

export default function Plan() {
  const { homeCountry, targetCountry, category, plan } = usePlanner();
  const [checkedItems, setCheckedItems] = useState({});

  // Load from localStorage
  useEffect(() => {
    const key = getStorageKey(homeCountry, targetCountry, category);
    const saved = localStorage.getItem(key);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, [homeCountry, targetCountry, category]);

  useEffect(() => {
    const key = getStorageKey(homeCountry, targetCountry, category);
    localStorage.setItem(key, JSON.stringify(checkedItems));
  }, [checkedItems, homeCountry, targetCountry, category]);

  if (!homeCountry || !targetCountry || !category) {
    return (
      <section>
        <h1>My Plan</h1>
        <p>
          You haven&apos;t generated a plan yet. Start by using the{' '}
          <Link to="/wizard">Plan My Move</Link> wizard.
        </p>
      </section>
    );
  }

  if (!plan) {
    return (
      <section>
        <h1>My Plan</h1>
        <p>
          We&apos;re missing your plan data. Please go back to the{' '}
          <Link to="/wizard">wizard</Link> and generate it again.
        </p>
      </section>
    );
  }

  const checklist = plan.checklist || [];
  const notes = plan.notes || [];

  function toggleItem(item) {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  }

  return (
    <section>
      <h1>My Move Plan</h1>

      <p>
        From <strong>{homeCountry}</strong> → <strong>{targetCountry}</strong>{' '}
        | Category: <strong>{category}</strong>
      </p>

      <h2>Summary</h2>
      <p>{plan.summary}</p>

      <h2>Important Notes</h2>
      <ul>
        {notes.map((note, idx) => (
          <li key={idx}>{note}</li>
        ))}
      </ul>

      <h2>Document Checklist</h2>
      {checklist.length === 0 ? (
        <p>No checklist available.</p>
      ) : (
        <ul className="checklist">
          {checklist.map(item => (
            <li key={item}>
              <label>
                <input
                  type="checkbox"
                  checked={!!checkedItems[item]}
                  onChange={() => toggleItem(item)}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {plan.competentAuthorityHint && (
        <>
          <h2>Competent Authority</h2>
          <p>{plan.competentAuthorityHint}</p>
        </>
      )}

      <p className="disclaimer">
        This planner is a guide only. Always confirm requirements with official
        government or CARICOM sources.
      </p>
    </section>
  );
}

function getStorageKey(from, to, category) {
  return `csme-plan-${from}-${to}-${category}`;
}
