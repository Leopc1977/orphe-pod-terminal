import * as aq from "arquero"
import db from "../IndexDB/db";

export default async function getTopGenre(spotifySDK) {
    const data = await db.history.toArray();
    const table = aq.from(data)
    
    let topArtists = table
        .print()
        .filter(
            d => d.artistName !== null
        )
        .groupby("artistName")
        .rollup({
            total_min: d => aq.op.sum(d.ms_played) / 60000,
            uri: d => aq.op.max(d.IDTrack)
        })
        .orderby(aq.desc("total_min"))
        .slice(0, 10)
        .select('artistName', 'uri', 'total_min')
        .rename({
            artistName: 'artist',
            total_min:'time'
        })

        const topGenres = {}

        for (const v of topArtists.objects()) {
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
            item: genre,
            time: data.time
        }));

    return genreList
}
