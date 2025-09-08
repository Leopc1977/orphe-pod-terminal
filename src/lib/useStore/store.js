import { create } from 'zustand'
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

export const store = create((set) => ({
    accessToken: null,
    tokenType: null,
    expiresIn: null,
    refreshToken: null,
    scope: null,
  
    setAuth: (data) => set(() => ({ ...data })),
  
    clearAuth: () => (
      set(() => ({
        accessToken: null,
        tokenType: null,
        expiresIn: null,
        refreshToken: null,
        scope: null,
      }))
    ),

    terminal: null,
    setTerminal: (term) => {
      set(() => ({ terminal: term }));
    },
}));
