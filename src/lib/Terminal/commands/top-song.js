import getTopSong from "../../Spotify/getTopSong";
import getMax from "../../utils/getMax";

export default function topSong() {
    return {
        name: "topsong",
        desc: "test to Spotify",
        action: async function () {
            const topSongs = await getTopSong();

            // Trouver le max pour normaliser la longueur des barres
            const maxTime = getMax(...topSongs.map(d => d.time));

            // Affichage ASCII
            this.writeln("");
            topSongs.forEach(d => {
                const barLength = Math.round((d.time / maxTime) * 50);
                const bar = '█'.repeat(barLength);
            
                let color;
                const ratio = d.time / maxTime;
                if (ratio > 0.75) color = '\x1b[31m';  
                else if (ratio > 0.4) color = '\x1b[33m';
                else color = '\x1b[32m';               
                this.writeln(`${d.song.padEnd(20)} | ${color}${bar}\x1b[0m ${Math.round(d.time)}min`);
            });
        }
    }
}
