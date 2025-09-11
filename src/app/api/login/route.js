import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_TARGET;
  const state = Math.random().toString(36).substring(2, 18);
  const scope = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-private"
  ].join(" ");

  const queryParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${queryParams.toString()}`
  );
}
