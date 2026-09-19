"use client";

import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/services/api";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Populate the form once the user loads (context starts as null on first render)
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      const updated = await api.updateProfile({ name, email });
      updateUser(updated);
      setSuccess(true);
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
    <DashboardShell>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">
        Profile
      </h1>
      <p className="text-ink-soft mb-9">Update your name and email.</p>

      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-card border border-ink/10 rounded-sm p-7 space-y-4"
      >
        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/15 rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-teal transition-colors bg-paper"
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
          />
        </div>

        {error && (
          <p className="text-brick text-sm bg-brick/5 border border-brick/20 rounded-sm px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-teal-dark text-sm bg-teal/5 border border-teal/20 rounded-sm px-3 py-2">
            Profile updated.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-teal text-paper px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-teal-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </DashboardShell>
  );
}
