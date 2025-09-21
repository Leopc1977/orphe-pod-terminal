import getNewArtist from "../../Spotify/getNewArtist.js";
import displayBarChart from "./utils/displayBarChart.js";

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
            displayBarChart.call(this, artists);
        }
    }
}
