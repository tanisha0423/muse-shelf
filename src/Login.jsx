import React, { useState } from "react";
import { supabase } from "./supabase/client";

export default function AuthForm() {
  // Mode: "login" or "signup"
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const clearAll = () => {
    setEmail("");
    setPassword("");
    setMessage(null);
    setError(null);
  };

  // Password rules validation
  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Za-z]/.test(pwd)) return "Password must contain at least one letter.";
    if (!/[^A-Za-z]/.test(pwd)) return "Password must contain at least one number or special character.";
    return null;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      setLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.signUp(
        { email, password },
        { redirectTo: window.location.origin }
      );
      if (error) {
        if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("user already exists")) {
          setError("User already exists. Please login instead.");
        } else {
          setError(error.message);
        }
      } else {
        setMessage("Success! Check your email to confirm your registration.");
        clearAll();
      }
    } catch (err) {
      setError("Sign up failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Invalid email or password.");
      } else {
        setMessage("Logged in successfully!");
        clearAll();
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    clearAll();
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleClear = () => {
    clearAll();
  };

  return (
    <div className="auth-form-container">
      <h1>{mode === "login" ? "Login" : "Sign Up"}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        disabled={loading}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        disabled={loading}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button-group">
        {mode === "login" ? (
          <button onClick={handleLogin} disabled={loading || !email || !password}>
            {loading ? "Loading..." : "Login"}
          </button>
        ) : (
          <button onClick={handleSignUp} disabled={loading || !email || !password}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        )}
        <button onClick={handleClear} disabled={loading}>
          Clear
        </button>
      </div>
      <button className="toggle-mode" onClick={toggleMode} disabled={loading}>
        {mode === "login"
          ? "Don't have an account? Sign up"
          : "Already have an account? Login"}
      </button>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
    </div>
  );
}
