import * as aq from "arquero"
import db from "../IndexDB/db";
import getMax from "../utils/getMax";

const THRESHOLD = 5;

export default async function getNewArtist() {
    const data = await db.history.toArray();
    const table = aq.from(data)

    const formatedTable = table
        .derive({
            year: aq.escape(d => new Date(d.ts).getFullYear())
        })
        .print()
        .rename({
            artistName: "artist"
        })

    const lastYear = getMax(formatedTable.array("year"));

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
            item: v.artist,
            time: v.time
        })
    }

    artistList.sort((a, b) => a.time-b.time);

    return {
        list: artistList,
        lastYear: lastYear
    };
}
