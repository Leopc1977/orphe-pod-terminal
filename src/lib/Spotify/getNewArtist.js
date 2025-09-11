import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";

const THRESHOLD = 5;

export default async function getNewArtist(filePath) {
    const rawText = await getFileContent(filePath)
    const data = JSON.parse(rawText);
    const table = aq.from(data)

    const artistApparition = {};

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
        })
        .filter(
            aq.escape(d => d.count > THRESHOLD)
        )
        .filter(
            aq.escape(d => d.firstYear === lastYear)
        )

    return {
        list: filteredTable.array("artist"),
        lastYear: lastYear
    };
}
