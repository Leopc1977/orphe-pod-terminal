import * as aq from "arquero"
import db from "../IndexDB/db";

export default async function getTopSong() {
    const data = await db.history.toArray();
    const table = aq.from(data);

    const totalMinutes = table
        .rollup({
            total_min: d => aq.op.sum(d.ms_played) / 60000
        })
        .get("total_min", 0);

    return totalMinutes;
}
