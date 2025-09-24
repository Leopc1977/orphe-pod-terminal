import getTracks from "./getTracks";

export default async function getTopsByYear(targetYear, minimumStreamTime) {
    const tracksOfTheYear = await getTracks(targetYear);

    tracksOfTheYear.map((t) => {
        console.log(t)
    })
}
