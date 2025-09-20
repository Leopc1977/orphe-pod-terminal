import * as aq from "arquero"
import db from "../IndexDB/db";

export default async function getTopSong() {
    const data = await db.history.toArray();

    const table = aq.from(data)

    let topArtists = table
    .filter(
        d => d.master_metadata_track_name !== null
    )
    .groupby("master_metadata_track_name")
    .rollup({ 
        total_min: d => aq.op.sum(d.ms_played) / 60000
    })
    .orderby(aq.desc("total_min"))
        .slice(0, 10)
        .select('master_metadata_track_name', 'total_min')
        .rename({master_metadata_track_name: 'song', total_min:'time'})

    topArtists = JSON.parse(topArtists.toJSON());

    return topArtists;
}
