import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";

const THRESHOLD = 5;

export default async function getNewArtist(filePath) {
    const rawText = await getFileContent(filePath)
    const data = JSON.parse(rawText);
    const table = aq.from(data)

    const formatedTable = table
        .derive({
            year: aq.escape(d => new Date(d.ts).getFullYear())
        })
        .rename({
            master_metadata_album_artist_name: "artist"
        })

    const lastYear = Math.max(...formatedTable.array("year"));

    const filteredTable = formatedTable
        .groupby("artist")
        .rollup({
            count: aq.op.count(),
            firstYear: aq.op.min("year"),
            time: d => aq.op.sum(d.ms_played) / 60000,
        })
        .filter(
            aq.escape(d => d.count > THRESHOLD)
        )
        .filter(
            aq.escape(d => d.firstYear === lastYear)
        )
    
    const artistList = []
    for (const v of filteredTable.objects()) {
        artistList.push({
            artist: v.artist,
            time: v.time
        })
    }

    artistList.sort((a, b) => a.time-b.time);

    return {
        list: artistList,
        lastYear: lastYear
    };
}
