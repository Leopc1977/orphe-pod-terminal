import Dexie from 'dexie';

const db = new Dexie('musicHistoryDB');

db.version(1).stores({
    history: `
      ++id, 
      ts, 
      username, 
      platform, 
      master_metadata_track_name, 
      master_metadata_album_artist_name, 
      master_metadata_album_album_name, 
      spotify_track_uri, 
      conn_country, 
      skipped, 
      offline, 
      incognito_mode
    `
  });

export default db;
