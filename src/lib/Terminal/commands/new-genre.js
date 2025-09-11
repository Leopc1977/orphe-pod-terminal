import getNewGenre from "../../Spotify/getNewGenre.js";

export default function newGenre() {
    return {
        name: "ng",
        desc: "test to Spotify",
        action: async function () {
            const {genres, lastYear} = await getNewGenre("../datas/Streaming_History_Audio_2014-2020_0.json", this.spotifySDK);

            if (genres.length === 0) {
                this.writeln(`Aucun genre trouvé pour l'année ${lastYear}.`);
                return;
            }

            this.writeln(`Decouverte genre de l'année ${lastYear} :\n`);

            // Trouver le max pour normaliser la longueur des barres
            const maxTime = Math.max(...genres.map(d => d.time));

            // Affichage ASCII
            this.writeln("");
            genres.forEach(d => {
                const barLength = Math.round((d.time / maxTime) * 50);
                const bar = '█'.repeat(barLength);

                let color;
                const ratio = d.time / maxTime;
                if (ratio > 0.75) color = '\x1b[31m';  
                else if (ratio > 0.4) color = '\x1b[33m';
                else color = '\x1b[32m';               

                this.writeln(`${d.genre.padEnd(20)} | ${color}${bar}\x1b[0m ${Math.round(d.time)}min`);
            });
        }
    }
}
