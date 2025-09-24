import * as aq from "arquero"
import db from "../IndexDB/db";

export default async function getTracks(targetYear, minCount) {
    const data = await db.history.toArray();
    const table = aq.from(data);

    // Ajouter une colonne "year"
    let formatedTable = table.derive({
        year: aq.escape(d => new Date(d.ts).getFullYear())
    });

    // Filtre par année si demandé
    if (targetYear) {
        formatedTable = formatedTable.filter(
            aq.escape(d => d.year === targetYear)
        );
    }

    // 1. Compter les occurrences de chaque trackName
    let counts = formatedTable
        .groupby("trackName")
        .count()
        .rename({ count: "occurrences" });

    // 2. Joindre les occurrences à la table initiale
    let joined = formatedTable.join(counts, ["trackName"]);

    // 3. Filtrer par minCount si défini
    if (minCount) {
        joined = joined.filter(
            aq.escape(d => d.occurrences >= minCount)
        );
    }

    joined.print(); // debug

    return joined.objects();
}
