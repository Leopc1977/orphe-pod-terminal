import * as aq from "arquero"
import getTracks from "./getTracks";

export default async function getTopSong() {
    const tracks = await getTracks()
    const table = aq.from(tracks)
    let topArtists = table
        .filter(d => d.trackName !== null)
        .groupby("trackName")
        .rollup({ 
            total_min: d => aq.op.sum(d.ms_played) / 60000
        })
        .orderby(aq.desc("total_min"))
            .slice(0, 10)
            .select('trackName', 'total_min')
            .rename({trackName: 'item', total_min:'time'})

    topArtists = JSON.parse(topArtists.toJSON());

    return topArtists;
}
