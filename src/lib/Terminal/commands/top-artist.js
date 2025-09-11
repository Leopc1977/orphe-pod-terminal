import formatJSON from "../../utils/formatJSON";
import getTopArtist from "../../Spotify/getTopArtist";

export default function topArtist() {
    return {
        name: "top10",
        desc: "test to Spotify",
        action: async function () {
            const topArtists = await getTopArtist("../datas/Streaming_History_Audio_2014-2020_0.json");

            // Trouver le max pour normaliser la longueur des barres
            const maxTime = Math.max(...topArtists.map(d => d.time));

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
