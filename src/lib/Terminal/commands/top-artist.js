import getTopArtist from "../../Spotify/getTopArtist";
import getMax from "../../utils/getMax";

export default function topArtist() {
    return {
        name: "top10",
        desc: "test to Spotify",
        action: async function () {
            const topArtists = await getTopArtist();

            const maxTime = getMax(...topArtists.map(d => d.time));

            // Affichage ASCII
            this.writeln("");
            topArtists.forEach(d => {
                const barLength = Math.round((d.time / maxTime) * 50);
                const bar = '█'.repeat(barLength);
            
                let color;
                const ratio = d.time / maxTime;
                if (ratio > 0.75) color = '\x1b[31m';  
                else if (ratio > 0.4) color = '\x1b[33m';
                else color = '\x1b[32m';               
            
                this.writeln(`${d.artist.padEnd(20)} | ${color}${bar}\x1b[0m ${Math.round(d.time)}min`);
            });
        }
    }
}
