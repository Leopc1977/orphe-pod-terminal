import clear from "./commands/clear";
import help from "./commands/help";
import login from "./commands/login";
import topArtist from "./commands/top-artist";
import topGenre from "./commands/top-genre";
import topSong from "./commands/top-song";
import totalStreamTime from "./commands/total-stream-time";

export default class Terminal {
    terminal;
    spotifySDK = null;
    #commands = new Map();
    #history = [];
    #historyIndex = 0;
    #command = "";
    #prompt = "\x1b[1;32morphe@pod042\x1b[0m$ ";

    constructor(terminalInstance) {
      this.terminal = terminalInstance;

      this.addCommand(help);
      this.addCommand(login);
      this.addCommand(clear);
      this.addCommand(topArtist);      
      this.addCommand(topSong);      
      this.addCommand(topGenre);
      this.addCommand(totalStreamTime);
    }

    setSpotifySDK(spotifySDK) {
      this.spotifySDK = spotifySDK;
    }
  
    get commands() {
      return this.#commands.entries()
    }

    start(prompt) {
      if (prompt) this.#prompt = prompt;
      this.terminal.write(this.#prompt);
  
      this.terminal.onKey(({ key, domEvent }) => {
        if (domEvent.key === "ArrowUp") {
          if (this.#historyIndex > 0) {
            this.#historyIndex--;
            this.#replaceLine(this.#history[this.#historyIndex]);
          }
        } else if (domEvent.key === "ArrowDown") {
          if (this.#historyIndex < this.#history.length - 1) {
            this.#historyIndex++;
            this.#replaceLine(this.#history[this.#historyIndex]);
          } else {
            this.#historyIndex = this.#history.length;
            this.#replaceLine("");
          }
        } else if (domEvent.key === "Enter") {
          this.#history.push(this.#command.trim());
          this.#historyIndex = this.#history.length;
          this.writeln("");
  
          if (this.#command.trim() !== "") {
            this.executeCommand(this.#command.trim());
          }
  
          this.#command = "";
          this.write(this.#prompt);
        } else if (domEvent.key === "Backspace") {
          if (this.#command.length > 0) {
            this.#command = this.#command.slice(0, -1);
            this.terminal.write("\b \b");
          }
         } else if (domEvent.key === "Tab") {
            if (this.#command.startsWith("c")) {
              this.#replaceLine("clear");
            }
        } else {
          this.#command += key;
          this.terminal.write(key);
        }
      });
    }
  
    write(str) {
      this.terminal.write(str);
    }
  
    writeln(str) {
      this.terminal.writeln(str);
    }
  
    executeCommand(input) {
        const [commandName, ...args] = input.split(" ");

        if (this.#commands.has(commandName)) {
          const { action } = this.#commands.get(commandName);
          action.apply(this, args);
        } else {
          this.writeln(`Unknown command: ${commandName}`);
        }
      }

      addCommand(getCommand) {
        const { name, desc, action } = getCommand();
        this.#commands.set(name, { desc, action });
      }
  
    #replaceLine(text) {
      const clear = "\b \b".repeat(this.#command.length);
      this.write(clear);
      this.#command = text;
      this.write(this.#command);
    }
  }
  