import getMax from "../../../utils/getMax";

export default function displayBarChart(list, maxWidth = 50) {
    if (!list || list.length === 0) {
        this.writeln("Aucune donnée disponible.");
        return;
    }

    const maxTime = getMax(list, (el=>el.time)); // temps en minutes
    this.writeln("");

    list.forEach(d => {
        const ratio = d.time / maxTime;
        const barLength = Math.round(ratio * maxWidth);
        const bar = '█'.repeat(barLength);
        let color;

        if (ratio > 0.75) color = '\x1b[31m';   // Rouge
        else if (ratio > 0.4) color = '\x1b[33m'; // Jaune
        else color = '\x1b[32m';                  // Vert

        // --- Conversion minutes → heures si besoin ---
        let displayTime;
        if (d.time >= 60) {
            const hours = Math.floor(d.time / 60);
            const minutes = Math.round(d.time % 60);
            if (minutes === 0) {
                displayTime = `${hours}h`; // ex: 2h
            } else {
                displayTime = `${hours}h${minutes}`; // ex: 1h30
            }
        } else {
            displayTime = `${Math.round(d.time)}min`; // ex: 45min
        }

        const minutesLabel = displayTime.padStart(6);

        this.writeln(`${d.item.padEnd(20)} | ${color}${bar}\x1b[0m ${minutesLabel}`);
    });
}
