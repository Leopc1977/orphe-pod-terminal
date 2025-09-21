import getTopSong from "../../Spotify/getTopSong";
import getMax from "../../utils/getMax";
import displayBarChart from "./utils/displayBarChart";

export default function topSong() {
    return {
        name: "topsong",
        desc: "test to Spotify",
        action: async function () {
            const topSongs = await getTopSong();
            displayBarChart.call(this, topSongs);
        }
    }
}
