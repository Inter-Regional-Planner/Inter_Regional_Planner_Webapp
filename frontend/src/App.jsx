import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CsmeBasics from './pages/CsmeBasics';
import Wizard from './pages/Wizard';
import Plan from './pages/Plan';
import Resources from './pages/Resources';

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <Link to="/">Inter Regional Movement Planner</Link>
        </div>
        <nav>
          <Link to="/csme-basics">CSME Basics</Link>
          <Link to="/wizard">Plan My Move</Link>
          <Link to="/plan">My Plan</Link>
          <Link to="/resources">Resources</Link>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/csme-basics" element={<CsmeBasics />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Built for CARICOM citizens exploring regional work opportunities.</p>
      </footer>
    </div>
  );
}

export default App;
