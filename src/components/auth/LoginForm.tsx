import React, { useState } from "react";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

interface Props {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("student1");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginApi({ username, password });
      login(res.token, res.username, res.role);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <p className="text-muted">
        Demo users: <strong>student1 / password</strong>, <strong>instructor1 / password</strong>
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
