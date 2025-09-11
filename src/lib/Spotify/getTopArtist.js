import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";

export default async function getTopArtist(filePath) {
    const rawText = await getFileContent(filePath)
    const data = JSON.parse(rawText);
    const table = aq.from(data)

    let topArtists = table
        .groupby("master_metadata_album_artist_name")
        .rollup({ 
        total_ms: d => aq.op.sum(d.ms_played),
        total_min: d => aq.op.sum(d.ms_played) / 60000
        })
        .orderby(aq.desc("total_ms"))
        .slice(0, 10)
        .select('master_metadata_album_artist_name', 'total_min')
        .rename({master_metadata_album_artist_name: 'artist', total_min:'time'})

    topArtists = JSON.parse(topArtists.toJSON());

    return topArtists;
}
