"use client";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import DashboardShell from "@/components/dashboard/DashboardShell";
import * as settingsApi from "@/services/settingsApi";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<boolean | null>(null);
  const [savingPref, setSavingPref] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  useEffect(() => {
    settingsApi.getMyProfile().then((profile) => {
      setNotifications(profile.email_notifications);
    });
  }, []);

  async function handleToggleNotifications() {
    if (notifications === null) return;
    const next = !notifications;
    setNotifications(next);
    setSavingPref(true);
    try {
      await settingsApi.updateNotificationPref(next);
    } catch {
      setNotifications(!next);
    } finally {
      setSavingPref(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match.");
      return;
    }

    setPwSubmitting(true);
    try {
      await settingsApi.changePassword(currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        const detail = err.response.data.detail;
        setPwError(detail);
        if (detail.includes("signed up with Google")) setHasPassword(false);
      } else {
        setPwError("Something went wrong. Please try again.");
      }
    } finally {
      setPwSubmitting(false);
    }
  }

  return (
    <DashboardShell>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">
        Settings
      </h1>
      <p className="text-ink-soft mb-9">Manage your account.</p>

      <div className="max-w-md space-y-9">
        <section>
          <h2 className="font-semibold text-base mb-1">Notifications</h2>
          <p className="text-xs text-ink-soft mb-4">
            This saves your preference for future email digests — email
            delivery itself isn't built yet, so nothing gets sent right now.
          </p>
          <button
            onClick={handleToggleNotifications}
            disabled={notifications === null || savingPref}
            className={`flex items-center gap-3 text-sm ${
              savingPref ? "opacity-60" : ""
            }`}
          >
            <span
              className={`w-10 h-5.5 rounded-full relative transition-colors ${
                notifications ? "bg-teal" : "bg-paper-dim border border-ink/15"
              }`}
              style={{ height: "22px" }}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-card transition-all ${
                  notifications ? "left-[22px]" : "left-0.5"
                }`}
              />
            </span>
            Email me about price drops on wishlist items
          </button>
        </section>

        <section className="border-t border-ink/10 pt-8">
          <h2 className="font-semibold text-base mb-1">Change password</h2>

          {!hasPassword ? (
            <p className="text-sm text-ink-soft">
              This account signed up with Google, so there's no password to
              change here.
            </p>
          ) : (
            <form
              onSubmit={handlePasswordSubmit}
              className="bg-card border border-ink/10 rounded-sm p-6 space-y-4 mt-4"
            >
              <div>
                <label className="text-sm font-medium text-ink block mb-1.5">
                  Current password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-ink/15 rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-teal transition-colors bg-paper"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-ink/15 rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-teal transition-colors bg-paper"
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-1.5">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-ink/15 rounded-sm px-3.5 py-2.5 text-sm outline-none focus:border-teal transition-colors bg-paper"
                />
              </div>

              {pwError && (
                <p className="text-brick text-sm bg-brick/5 border border-brick/20 rounded-sm px-3 py-2">
                  {pwError}
                </p>
              )}
              {pwSuccess && (
                <p className="text-teal-dark text-sm bg-teal/5 border border-teal/20 rounded-sm px-3 py-2">
                  Password updated.
                </p>
              )}

              <button
                type="submit"
                disabled={pwSubmitting}
                className="bg-teal text-paper px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-teal-dark transition-colors disabled:opacity-60"
              >
                {pwSubmitting ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
