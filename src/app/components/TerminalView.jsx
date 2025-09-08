"use client";

import { use, useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css"
import "./index.css"
import useStore from "../../lib/useStore";
import { useRouter } from "next/navigation";

let history = [];
let historyIndex = -1;
const PROMPT = "\x1b[1;32morphe@pod042\x1b[0m$ ";

export default function TerminalView() {
  const terminalRef = useRef(null);
  const fitAddon = new FitAddon();
  const { setAuth, terminal, setTerminal } = useStore ()
  const router = useRouter();

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

    setTerminal(term);
  }, []);

  useEffect(() => {
    if (!terminal) return
    
    terminal.writeln("Welcome to OrphePodTerminal!");
    terminal.writeln("Type 'help' to see available commands.");
    terminal.write(PROMPT);
  
    let command = "";

    function replaceLine(text) {
      terminal.write("\x1b[2K\r");
      terminal.write(PROMPT + text);
      command = text;
    }
  
    terminal.onKey(({ key, domEvent }) => {
      if (domEvent.key === "ArrowUp") {
        if (historyIndex > 0) {
          historyIndex--;
          replaceLine(history[historyIndex]);
        }
      } else if (domEvent.key === "ArrowDown") {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          replaceLine(history[historyIndex]);
        } else {
          historyIndex = history.length;
          replaceLine("");
        }
      } else if (domEvent.key === "Enter") {
        history.push(command.trim())
        historyIndex+=1;
        terminal.writeln("");
          
        if (command.trim() === "ping") {
          terminal.writeln("pong");
        } else if (command.trim() === "help") {
          terminal.writeln("Available commands: ping, help");
        } else if (command.trim() === "clear") {
            terminal.reset()
        } else if (command.trim() === "l") {
          window.location.href = "/api/login";
        } else if (command.trim() !== "") {
          terminal.writeln(`Unknown command: ${command}`);
        }
        command = "";
        terminal.write(PROMPT);
      } else if (domEvent.key === "Backspace") {
        if (command.length > 0) {
          command = command.slice(0, -1);
          terminal.write("\b \b");
        }
      } else {
        command += key;
        terminal.write(key);
      }
    });
  
    return () => terminal.dispose();
  }, [terminal]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch(`/api/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          setAuth({
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scope: data.scope,
          })
          router.push("/");
        });
    }
  }, [router]);

  return (
    <div id="terminal-container" className="h-full w-full">
      <div id="terminal" ref={terminalRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
