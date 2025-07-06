import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { API_URL } from "../config";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const url = isLogin
              ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/register`;

    const body = isLogin
      ? { email: form.email, password: form.password }
      : { username: form.username, email: form.email, password: form.password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return setMsg(data.msg);

      if (isLogin) {
        localStorage.setItem("token", data.token);
        setMsg("Login successful!");
        navigate("/dashboard");
      } else {
        setMsg("Registered! You can now login.");
        setIsLogin(true);
      }
    } catch {
      setMsg("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {msg && <p className="msg">{msg}</p>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={form.username}
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "New user? Register here" : "Already have an account? Login instead"}
      </p>
    </div>
  );
}

export default AuthPage;