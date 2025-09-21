import * as aq from "arquero"
import db from "../IndexDB/db";

export default async function getTopArtist() {
    const data = await db.history.toArray();
    const table = aq.from(data)

    let topArtists = table
        .filter(
            d => d.artistName !== null
        )
        .groupby("artistName")
        .rollup({ 
            total_min: d => aq.op.sum(d.ms_played) / 60000
        })
        .orderby(aq.desc("total_min"))
        .slice(0, 10)
        .select('artistName', 'total_min')
        .rename({
            artistName: 'item', 
            total_min:'time'
        })

    topArtists = JSON.parse(topArtists.toJSON());

    return topArtists;
}
