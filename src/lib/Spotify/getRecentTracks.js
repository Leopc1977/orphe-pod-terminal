export default async function getRecentTracks(spotifySDK) {
    const response = await spotifySDK.player.getRecentlyPlayedTracks();
    const tracks = response.items;
    return tracks;
}
