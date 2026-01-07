"use client";

import { useState, useEffect } from "react";
import { graphqlRequest } from "../lib/graphql/client";
import { MeDocument, SignupDocument, LoginDocument, LogoutDocument } from "../lib/types/generated";
import type { MeQuery, SignupMutation, LoginMutation } from "../lib/types/generated";
import type { User } from "../lib/types/user";

export default function Home() {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await graphqlRequest<MeQuery>(MeDocument);
      setUser(data.me ?? null);
    } catch {
      setUser(null);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await graphqlRequest<SignupMutation>(SignupDocument, {
        email: signupEmail,
        password: signupPassword,
      });

      if (!data.signup.emailVerified) {
        setMessage("Please check your email to verify your account");
      } else {
        setMessage("Signup successful!");
      }
      setUser(data.signup);
      setSignupEmail("");
      setSignupPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await graphqlRequest<LoginMutation>(LoginDocument, {
        email: loginEmail,
        password: loginPassword,
      });

      setMessage("Login successful!");
      setUser(data.login.user);
      setLoginEmail("");
      setLoginPassword("");
      await checkAuth();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMe = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await graphqlRequest<MeQuery>(MeDocument);
      setUser(data.me ?? null);
      setMessage("User data retrieved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to get user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage("");

    try {
      await graphqlRequest(LogoutDocument);
      setMessage("Logged out");
      setUser(null);
      await checkAuth();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>RaM App - Auth Test</h1>

      {message && <div>{message}</div>}
      {user && (
        <div>
          <h2>Current User</h2>
          <div>ID: {user.id}</div>
          <div>Email: {user.email}</div>
          <div>Email Verified: {user.emailVerified ? "Yes" : "No"}</div>
        </div>
      )}

      <div>
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            Signup
          </button>
        </form>
      </div>

      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            Login
          </button>
        </form>
      </div>

      <div>
        <button onClick={handleMe} disabled={loading}>
          Get Me
        </button>
        <button onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </div>
    </div>
  );
}

