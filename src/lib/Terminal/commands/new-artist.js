import getNewArtist from "../../Spotify/getNewArtist.js";

export default function newArtist() {
    return {
        name: "new artist",
        desc: "test to Spotify",
        action: async function () {
            const topArtists = await getNewArtist("../datas/Streaming_History_Audio_2014-2020_0.json");
            const lastYear = topArtists.lastYear;
            const artists = topArtists.list;

            if (artists.length === 0) {
                this.writeln(`Aucun artiste trouvé pour l'année ${lastYear}.`);
                return;
            }

            this.writeln(`Decouverte artistes de l'année ${lastYear} :\n`);

            artists.forEach((artist, index) => {
                this.writeln(`${index + 1}. ${artist}`);
            });
        }
    }
}
