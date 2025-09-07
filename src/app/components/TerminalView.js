"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css"
import "./index.css"

let history = [];
let historyIndex = -1;
const PROMPT = "\x1b[1;32morphe@pod\x1b[0m$ "; // style vert

export default function TerminalView() {
  const terminalRef = useRef(null);
  const fitAddon = new FitAddon();

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
  
    term.writeln("Welcome to OrphePodTerminal!");
    term.writeln("Type 'help' to see available commands.");
    term.write(PROMPT); // <-- Affiche le prompt à chaque début de ligne
  
    let command = "";

    function replaceLine(text) {
      term.write("\x1b[2K\r"); // clear line
      term.write(PROMPT + text);
      command = text;
    }
  
    term.onKey(({ key, domEvent }) => {
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
        term.writeln("");
          
        if (command.trim() === "ping") {
          term.writeln("pong");
        } else if (command.trim() === "help") {
          term.writeln("Available commands: ping, help");
        } else if (command.trim() === "clear") {
            term.reset()
        } else if (command.trim() !== "") {
          term.writeln(`Unknown command: ${command}`);
        }
        command = ""; // reset
        term.write(PROMPT); // <-- Affiche le prompt à chaque début de ligne
      } else if (domEvent.key === "Backspace") {
        if (command.length > 0) {
          command = command.slice(0, -1);
          term.write("\b \b"); // effacer caractère affiché
        }
      } else {
        command += key;
        term.write(key);
      }
    });
  
    return () => term.dispose();
  }, []);

  return (
    <div id="terminal-container" className="h-full w-full">
      <div id="terminal" ref={terminalRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
