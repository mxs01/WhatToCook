import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/client";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/recipes");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response: { data?: { detail?: string } } }).response?.data
          ?.detail
      ) {
        setError(
          (err as { response: { data: { detail: string } } }).response.data
            .detail,
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      {/* Navigation */}
      <nav className="flex w-full items-center justify-between px-8 py-6 md:px-12">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-text-main"
          style={{ transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
        >
          WhatToCook
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-primary-500 px-5 py-2 text-sm font-medium text-white"
          style={{
            boxShadow: "0 4px 14px rgba(0,163,136,0.3)",
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          Get Started
        </Link>
      </nav>

      {/* Centered form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div
          className="w-full max-w-md rounded-3xl bg-white p-10"
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.03), 0 20px 50px -12px rgba(0,0,0,0.08)",
          }}
        >
          <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-text-main">
            Welcome back
          </h1>
          <p className="mb-8 text-center text-sm text-text-muted">
            Sign in to your WhatToCook account
          </p>

          {error && (
            <div
              className="mb-6 rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "rgba(212,140,132,0.1)",
                color: "#D48C84",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text-main"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-[#F5F5F7] px-4 py-3 text-sm text-text-main placeholder-text-muted outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                style={{ transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text-main"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-[#F5F5F7] px-4 py-3 text-sm text-text-main placeholder-text-muted outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                style={{ transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                placeholder="Min. 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 disabled:opacity-50"
              style={{
                boxShadow: "0 8px 24px rgba(0,163,136,0.25)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-500 transition-colors hover:text-primary-600"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
