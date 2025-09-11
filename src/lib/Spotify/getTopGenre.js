import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";

export default async function getTopGenre(filePath, spotifySDK) {
    const rawText = await getFileContent(filePath)

    const data = JSON.parse(rawText);
    const table = aq.from(data)
    
    let topArtists = table
        .groupby("master_metadata_album_artist_name")
        .rollup({
            total_min: d => aq.op.sum(d.ms_played) / 60000,
            uri: d => aq.op.max(d.spotify_track_uri)
        })
        .orderby(aq.desc("total_min"))
        .slice(0, 10)
        .select('master_metadata_album_artist_name', 'uri', 'total_min')
        .rename({
            master_metadata_album_artist_name: 'artist',
            total_min:'time'
        })

        const topGenres = {}
        for (const v of topArtists.objects()) {
            const trackID = v.uri.split(":").at(-1);
            const track = await spotifySDK.tracks.get(trackID);
            const artistIDs = track.artists.map(a=>a.id);
        
            // ⚠️ attention à forEach + async → utilise for...of pour bien attendre
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
        }));        
    console.log(topArtists.toJSON());

    console.log(genreList);

    return genreList
}
