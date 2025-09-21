import getTopArtist from "../../Spotify/getTopArtist";
import displayBarChart from "./utils/displayBarChart";

export default function topArtist() {
    return {
        name: "top10",
        desc: "test to Spotify",
        action: async function () {
            const topArtists = await getTopArtist();
            displayBarChart.call(this, topArtists);
        }
    }
}
