import getTopGenre from "../../Spotify/getTopGenre.js";
import getMax from "../../utils/getMax.js";
import displayBarChart from "./utils/displayBarChart.js";

export default function topGenre() {
    return {
        name: "topgenre",
        desc: "test to Spotify",
        action: async function (a) {
            const topGenre = await getTopGenre(this.spotifySDK);
            displayBarChart.call(this, topGenre);
        }
    }
}
