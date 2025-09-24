import getTracksByYear from "../../Spotify/getTracks";

export default function getMood(year=2020) {
    return {
        name: "mood",
        desc: "List available commands",
        action: async function (args) {
            const rawTracks = await getTracksByYear(year, 20);
            const simplifiedTracks = rawTracks.map((t)=>({artist: t.artistName, song: t.trackName}));
            
            const trackCountsMap = new Map();
            simplifiedTracks.forEach(({ artist, song }) => {
                const key = `${artist} - ${song}`;
                if (!trackCountsMap.has(key)) {
                    trackCountsMap.set(key, { artist, song, count: 0 });
                }
                trackCountsMap.get(key).count++;
            });
            const tracksWithCounts = Array.from(trackCountsMap.values());

            // 1. Trier les tracks par nombre de lectures décroissant
            const sortedTracks = tracksWithCounts.sort((a, b) => b.count - a.count);

            // 2. Construire le prompt
            let prompt = "";

            if (year) {
            prompt += `Analyze my Spotify listening history for ${year}.\n`;
            prompt += "I want to know the dominant moods of the tracks I listened to that year.\n";
            } else {
            prompt += "Analyze my Spotify listening history.\n";
            prompt += "I want to know the dominant moods of the tracks I listened to.\n";
            }

            prompt += "Classify each track into one of these categories: melancholic, joyful, energetic, calm.\n";
            prompt += "Then provide a percentage breakdown for each mood.\n\n";
            prompt += "Here is the list of tracks, sorted by number of plays (highest first):\n";

            const limitedTracks = sortedTracks.slice(0, 100);
            sortedTracks.forEach(track => {
                prompt += `- ${track.song} by ${track.artist} (${track.count} plays)\n`;
            });

            prompt += "\nPlease respond in a concise narrative analysis, describing the overall mood trends and what they reveal about my listening habits.\n";

            console.log(prompt)
            // const res = await fetch("http://127.0.0.1:8081/v1/chat/completions", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         model: "Meta-Llama-3-8B.Q4_K_M",
            //         temperature: 0.7,
            //         messages: [
            //             { role: "system", content: "You are a music analysis assistant." },
            //             { role: "user", content: prompt },
            //         ],
            //     }),
            // });
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_LLM_BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${process.env.NEXT_PUBLIC_LLM_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: process.env.NEXT_PUBLIC_MODEL_NAME,
                  messages: [
                    { role: "system", content: "You are a music analysis assistant." },
                    { role: "user", content: prompt },
                  ],
                }),
              });
          

            // 1️⃣ Vérifier le statut HTTP
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            
            // 2️⃣ Lire la réponse JSON
            const data = await res.json();
            
            // 3️⃣ Extraire le contenu de la réponse
            const assistantReply = data.choices?.[0]?.message?.content;
            console.log("LLM response:\n", assistantReply);
            
            // 4️⃣ (Optionnel) Si le LLM renvoie du JSON, parser directement
            let jsonSummary;
            try {
                // Cherche un objet JSON dans la réponse
                jsonSummary = JSON.parse(assistantReply);
                console.log("Parsed JSON summary:", jsonSummary);
            } catch (err) {
                console.warn("Response is not valid JSON, fallback to raw text.");
            }
            
            console.log(data)
        }
    }
}
