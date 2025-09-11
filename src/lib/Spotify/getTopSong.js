import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";

export default async function getTopSong(filePath) {
    const rawText = await getFileContent(filePath)
    const data = JSON.parse(rawText);
    const table = aq.from(data)

    let topArtists = table
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
