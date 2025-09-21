import getRecentTracks from "../../Spotify/getRecentTracks";

import stringWidth from "string-width"; // pour gérer les noms japonais


function truncate(str, max) {
    if (stringWidth(str) <= max) return str;
    let result = "";
    let width = 0;
    for (const char of str) {
        const w = stringWidth(char);
        if (width + w > max - 1) break;
        result += char;
        width += w;
    }
    return result + "…";
}

// format minutes → h/mm
function formatTime(ms) {
    const mins = Math.round(ms / 60000);
    if (mins >= 60) {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h${String(m).padStart(2,'0')}`;
    }
    return `${mins}min`;
}

// pad visuel pour les caractères wide (CJK)
function padVisual(str, width) {
    const w = stringWidth(str);
    return str + " ".repeat(Math.max(width - w,0));
}

export default function recentTracks() {
    return {
        name: "rt",
        desc: "test to Spotify",
        action: async function () {
            this.writeln("")
            const maxWidth = 50;
            const recentTracks = await getRecentTracks(this.spotifySDK);

            recentTracks.forEach(trackObj => {
                const { track, played_at } = trackObj;
                const artists = track.artists.map(a => a.name).join(", ");
                const barLength = Math.round((track.duration_ms / 3600000) * maxWidth); 
                const bar = "█".repeat(Math.min(barLength, maxWidth));
                const trackName = padVisual(truncate(track.name, 30), 30);
                const artistName = padVisual(truncate(artists, 25), 25);

                const line = `${trackName} | ${artistName} | ${bar} ${formatTime(track.duration_ms)} | ${new Date(played_at).toLocaleTimeString()}`;
                this.writeln(line);
            });
        }
    }
}
