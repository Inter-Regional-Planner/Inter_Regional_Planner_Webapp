// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { PlannerProvider } from "./planner/PlannerContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Wizard from "./pages/Wizard";
import Plan from "./pages/Plan";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CsmeBasics from "./pages/CsmeBasics";

function App() {
  return (
    <PlannerProvider>
      <div className="app-root">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* Planner flow */}
            <Route path="/plan-my-move" element={<Wizard />} />
            <Route path="/my-plan" element={<Plan />} />

            {/* Extra pages */}
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/csme-basics" element={<CsmeBasics />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PlannerProvider>
  );
}

export default App;