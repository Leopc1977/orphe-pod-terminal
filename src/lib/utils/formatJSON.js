export default function formatJSON(data) {
    if (typeof data === "object") data = JSON.stringify(data, null, 2);
    else data = JSON.stringify(JSON.parse(data), null, 2);

    return data.split("\n")
            .map(line => line + "\r\n")
            .join("");
}
