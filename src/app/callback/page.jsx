"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetch(`/api/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          //TODO: save
          console.log("Tokens reçus:", data);
          router.push("/");
        });
    }
  }, [router]);

  return <div>Connexion en cours...</div>;
}
