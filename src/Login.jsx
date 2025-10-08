import React, { useState } from "react";
import { supabase } from "./supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const clearMessages = () => {
    setMessage(null);
    setError(null);
  };

  const signUp = async () => {
    clearMessages();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setError("This email is already registered. Please login instead.");
        } else {
          throw error;
        }
      } else {
        setMessage("Success! Check your email to confirm.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    clearMessages();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage("Logged in successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>MuseShelf Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <div className="button-group">
        <button onClick={signIn} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        <button onClick={signUp} disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </div>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
    </div>
  );
}
