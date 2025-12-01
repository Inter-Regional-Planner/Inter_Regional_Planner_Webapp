import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section>
      <h1>Inter Regional Movement Planner</h1>
      <p>
        A simple planning tool to help CARICOM nationals understand how to move
        to another Caribbean country for work under the CARICOM Single Market and
        Economy (CSME).
      </p>
      <p>
        Answer a few questions and we’ll generate a personalized checklist and
        summary of next steps for you.
      </p>
      <Link className="primary-btn" to="/wizard">
        Start My Move Plan
      </Link>
    </section>
  );
}
