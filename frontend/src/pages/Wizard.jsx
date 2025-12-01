import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanner } from '../planner/PlannerContext';

/*const API_BASE = 'http://localhost:4000';
So locally it will still use localhost:4000, but in production you can set VITE_API_BASE_URL to the Render URL.*/
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


export default function Wizard() {
  const {
    homeCountry,
    targetCountry,
    category,
    setHomeCountry,
    setTargetCountry,
    setCategory,
    setPlan
  } = usePlanner();

  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [countriesRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/api/countries`),
          fetch(`${API_BASE}/api/categories`)
        ]);

        const countriesJson = await countriesRes.json();
        const categoriesJson = await categoriesRes.json();

        setCountries(countriesJson);
        setCategories(categoriesJson);
      } catch (err) {
        console.error(err);
        setError('Unable to load options. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!homeCountry || !targetCountry || !category) {
      setError('Please select a home country, target country and category.');
      return;
    }

    try {
      const url = new URL(`${API_BASE}/api/rules`);
      url.searchParams.set('from', homeCountry);
      url.searchParams.set('to', targetCountry);
      url.searchParams.set('category', category);

      const res = await fetch(url.toString());
      const data = await res.json();
      setPlan(data);
      navigate('/plan');
    } catch (err) {
      console.error(err);
      setError('Unable to generate your plan right now.');
    }
  }

  if (loading) {
    return <p>Loading options...</p>;
  }

  return (
    <section>
      <h1>Plan My Move</h1>
      <p>
        Select your home country, the country you want to move to, and your
        professional category. We’ll generate a simple, personalized guide.
      </p>

      {error && <p className="error">{error}</p>}

      <form className="wizard-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="homeCountry">I am from</label>
          <select
            id="homeCountry"
            value={homeCountry}
            onChange={e => setHomeCountry(e.target.value)}
          >
            <option value="">Select country</option>
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="targetCountry">I want to work in</label>
          <select
            id="targetCountry"
            value={targetCountry}
            onChange={e => setTargetCountry(e.target.value)}
          >
            <option value="">Select country</option>
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">My category</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="primary-btn">
          Generate My Plan
        </button>
      </form>
    </section>
  );
}
