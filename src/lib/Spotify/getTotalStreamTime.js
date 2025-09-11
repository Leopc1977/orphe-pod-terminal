import * as aq from "arquero"
import getFileContent from "../utils/getFileContent";

export default async function getTopSong(filePath) {
    const rawText = await getFileContent(filePath);
    const data = JSON.parse(rawText);
    const table = aq.from(data);

    const totalMinutes = table
        .rollup({
            total_min: d => aq.op.sum(d.ms_played) / 60000
        })
        .get("total_min", 0);

    return totalMinutes;
}
