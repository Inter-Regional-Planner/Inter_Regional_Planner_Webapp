// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    country: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          email: form.email,
          password: form.password,
          country: form.country || null,
          dob: form.dob || null, // "YYYY-MM-DD"
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up.");
      }

      // Save auth info (simple version)
      localStorage.setItem("irp_token", data.token);
      localStorage.setItem("irp_user", JSON.stringify(data.user));

      // Go to Plan My Move (or My Plan – your choice)
      navigate("/plan-my-move");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong while signing up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-auth">
      <div className="auth-card wide">
        <h1>Sign up</h1>
        <p className="auth-subtext">
          Save your move plans, track your checklist, and access them from
          anywhere in the Caribbean.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="signup-grid">
            <label className="form-label">
              Name
              <input
                type="text"
                name="name"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-label">
              Surname
              <input
                type="text"
                name="surname"
                className="form-input"
                value={form.surname}
                onChange={handleChange}
              />
            </label>

            <label className="form-label">
              Country
              <input
                type="text"
                name="country"
                className="form-input"
                value={form.country}
                onChange={handleChange}
                placeholder="Trinidad and Tobago"
              />
            </label>

            <label className="form-label">
              Date of Birth
              <input
                type="date"
                name="dob"
                className="form-input"
                value={form.dob}
                onChange={handleChange}
              />
            </label>

            <label className="form-label full-row">
              Email
              <input
                type="email"
                name="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-label">
              Password
              <input
                type="password"
                name="password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-label">
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary full-width"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Submit"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="auth-footer-text">
          Or continue as{" "}
          <Link to="/plan-my-move" className="auth-guest-link">
            Guest
          </Link>
        </p>
      </div>
    </div>
  );
}
