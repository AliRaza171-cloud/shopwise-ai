"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";

// TODO: replace with your real Google OAuth Client ID once you've created
// one at https://console.cloud.google.com/apis/credentials
// (APIs & Services > Credentials > Create Credentials > OAuth Client ID > Web application)
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();

  function initializeGoogleButton() {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: { credential: string }) => {
        try {
          await loginWithGoogle(response.credential);
        } catch (err) {
          console.error("Google login failed:", err);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
    });
  }

  useEffect(() => {
    // In case the script already loaded before this component mounted
    // (e.g. navigating between login/register client-side).
    if (window.google) initializeGoogleButton();
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogleButton}
      />
      <div ref={buttonRef} className="flex justify-center" />
    </>
  );
}
