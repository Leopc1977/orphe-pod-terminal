import getNewGenre from "../../Spotify/getNewGenre.js";
import displayBarChart from "./utils/displayBarChart.js";

export default function newGenre() {
    return {
        name: "ng",
        desc: "test to Spotify",
        action: async function () {
            const {genres, lastYear} = await getNewGenre(this.spotifySDK);

            if (genres.length === 0) {
                this.writeln(`Aucun genre trouvé pour l'année ${lastYear}.`);
                return;
            }

            this.writeln(`Decouverte genre de l'année ${lastYear} :\n`);
            displayBarChart.call(this, genres);
        }
    }
}
