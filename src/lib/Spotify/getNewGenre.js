import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";

const THRESHOLD = 5

export default async function getNewArtist(filePath, spotifySDK) {
    const rawText = await getFileContent(filePath)
    const data = JSON.parse(rawText);
    const table = aq.from(data)

    const formatedTable = table
        .derive({
            year: aq.escape(d => new Date(d.ts).getFullYear())
        })
        .rename({master_metadata_album_artist_name: "artist"})

    const lastYear = Math.max(...formatedTable.array("year"));

    const filteredTable = formatedTable
        .groupby("artist")
        .rollup({
            count: aq.op.count(),
            firstYear: aq.op.min("year"),
            time: d => aq.op.sum(d.ms_played) / 60000,
            uri: d => aq.op.max(d.spotify_track_uri)
        })
        .filter(
            aq.escape(d => d.count > THRESHOLD)
        )
        .filter(
            aq.escape(d => d.firstYear === lastYear)
        )
        
    const topGenres = {}

    for (const v of filteredTable.objects()) {
        const trackID = v.uri.split(":").at(-1);
        const track = await spotifySDK.tracks.get(trackID);
        const artistIDs = track.artists.map(a=>a.id);
    
        for (const artistID of artistIDs) {
            const artist = await spotifySDK.artists.get(artistID);
            const genres = artist.genres;
    
            genres.forEach(genre => {
                if (!topGenres[genre]) {
                    topGenres[genre] = { count: 1, time: v.time };
                } else {
                    topGenres[genre].count += 1;
                    topGenres[genre].time += v.time;
                }
            });
        }
    }

    const genreList = Object.entries(topGenres).map(([genre, data]) => ({
        genre,
        time: data.time
    })).sort((a, b) => a.time-b.time)

    return {genres: genreList, lastYear:lastYear};
}
