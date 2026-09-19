"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/auth/AuthCard";
import GoogleButton from "@/components/auth/GoogleButton";

export default function RegisterPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await signup({ name, email, password });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Find the right product, without the guesswork."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/15 rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-teal transition-colors bg-paper"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-teal transition-colors bg-paper"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-teal transition-colors bg-paper"
            placeholder="At least 8 characters"
          />
        </div>

        {error && (
          <p className="text-brick text-sm bg-brick/5 border border-brick/20 rounded-sm px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal text-paper py-3 rounded-sm font-semibold hover:bg-teal-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-ink/10" />
        <span className="text-xs text-ink-soft font-mono">or</span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>

      <GoogleButton />
    </AuthCard>
  );
}
