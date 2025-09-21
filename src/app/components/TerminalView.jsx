"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css"
import "./index.css"
import useStore from "../../lib/useStore";
import { useRouter } from "next/navigation";
import TerminalManager from "../../lib/Terminal";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import db from "../../lib/IndexDB/db";
import { WebLinksAddon } from "@xterm/addon-web-links";

export default function TerminalView() {
  const { setAuth, setTerminal, terminal, setSpotifySDK, spotifySDK } = useStore()

  const fileInputRef = useRef(null);
  const terminalRef = useRef(null);
  const fitAddon = new FitAddon();
  const router = useRouter();

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    for (const file of files) {
      if (file.type !== "application/json") {
        console.warn(`Fichier ignoré (${file.name}, pas du JSON).`);
        continue;
      }
  
      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);

        console.log(`JSON chargé depuis ${file.name}:`, jsonData);

        await db.history.bulkAdd(jsonData);
      } catch (err) {
        console.error(`Erreur lors du parsing JSON (${file.name}):`, err);
      }
    }
  };
  
  useEffect(() => {
    const term = new Terminal({
      cols: 80,
      rows: 24,
      fontSize: 16,
      cursorBlink: true,
      cursorStyle: "block",
      theme: {
        background: "#00000000",
    },
      allowTransparency: true
    });
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    term.loadAddon(
      new WebLinksAddon((event, uri) => {
        if (uri.startsWith("upload://file")) {
          fileInputRef.current.click();
        } else {
          window.open(uri, "_blank");
        }
      }, {
        urlRegex: /((https?|HTTPS?):[/]{2}|upload:\/\/)[^\s"'!*(){}|\\^<>`]*[^\s"':,.!?{}|\\^~\[\]`()<>]/
      })
    );

    term.writeln(
      "upload://file/test"
    );

    const newTerminal = new TerminalManager(term)
    newTerminal.start();
    setTerminal(newTerminal);

    return () => term.dispose();
  }, []);

  useEffect(() => {
    if (!terminal) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetch(`/api/callback?code=${code}`)
        .then(res => res.json())
        .then(async (data) => {
          setAuth({
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scope: data.scope,
          });

          const newSpotifySDK = SpotifyApi.withAccessToken(data.clientId, {
            access_token: data.access_token,
            token_type: data.tokenType,
            expires_in: data.expiresIn,
            refresh_token: data.refreshToken,
          });

          setSpotifySDK(newSpotifySDK);
          terminal.setSpotifySDK(newSpotifySDK);

          router.push("/");
        });
    }
  }, [router, terminal]);

  return (
    <div id="terminal-container" className="h-full w-full">
      <div id="terminal" ref={terminalRef} style={{ width: "100%", height: "100%" }} />
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  )
}
