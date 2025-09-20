import getNewArtist from "../../Spotify/getNewArtist.js";
import getMax from "../../utils/getMax.js";

export default function newArtist() {
    return {
        name: "na",
        desc: "test to Spotify",
        action: async function () {
            const topArtists = await getNewArtist();
            const artists = topArtists.list;
            const lastYear = topArtists.lastYear;

            if (artists.length === 0) {
                this.writeln(`Aucun artiste trouvé pour l'année ${lastYear}.`);
                return;
            }

            this.writeln(`Decouverte artiste de l'année ${lastYear} :\n`);

            // Trouver le max pour normaliser la longueur des barres
            const maxTime = getMax(...artists.map(d => d.time));

            // Affichage ASCII
            this.writeln("");
            artists.forEach(d => {
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
