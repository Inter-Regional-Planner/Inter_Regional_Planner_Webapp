// src/pages/Login.jsx
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="page page-auth">
      <div className="auth-card">
        <h1>Log in</h1>
        <p className="auth-subtext">
          Access your saved plans and track your migration progress.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Demo only: auth not implemented yet.");
          }}
        >
          <label className="form-label">
            Email
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
            />
          </label>

          <label className="form-label">
            Password
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" className="btn-primary full-width">
            Log in
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
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

export default Login;
