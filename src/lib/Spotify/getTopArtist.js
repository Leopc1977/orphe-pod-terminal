import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";
import db from "../IndexDB/db";

export default async function getTopArtist() {
    const data = await db.history.toArray();
    const table = aq.from(data)

    let topArtists = table
        .filter(
            master_metadata_album_artist_name !== null
        )
        .groupby("master_metadata_album_artist_name")
        .rollup({ 
            total_min: d => aq.op.sum(d.ms_played) / 60000
        })
        .orderby(aq.desc("total_min"))
        .slice(0, 10)
        .select('master_metadata_album_artist_name', 'total_min')
        .rename({
            master_metadata_album_artist_name: 'artist', 
            total_min:'time'
        })

    topArtists = JSON.parse(topArtists.toJSON());

    return topArtists;
}
