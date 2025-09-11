import getTotalStreamTime from "../../Spotify/getTotalStreamTime.js";

export default function totalStreamTime() {
    return {
        name: "t",
        desc: "test to Spotify",
        action: async function (a) {
            const totalMinutes = await getTotalStreamTime(
                "../datas/Streaming_History_Audio_2014-2020_0.json",
                this.spotifySDK
            );

            // Affichage ASCII simple
            this.writeln("");
            this.writeln("=== Temps total d'écoute sur Spotify ===");
            this.writeln(`${Math.round(totalMinutes)} minutes`);
            this.writeln(`≈ ${(totalMinutes / 60).toFixed(1)} heures`);
            this.writeln(`≈ ${(totalMinutes / 60 / 24).toFixed(1)} jours`);
        }
    }
}
