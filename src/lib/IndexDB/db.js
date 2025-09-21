import Dexie from 'dexie';

const db = new Dexie('musicHistoryDB');

db.version(1).stores({
    history: `
      ++id, 
      ms_played,
      ts,
      artistName,
      trackName,
      uri,
      IDTrack
    `
});

export default db;
