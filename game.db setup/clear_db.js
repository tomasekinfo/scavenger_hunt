const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('game.db');

db.serialize(() => {
    db.run(`DELETE FROM sequence;`, (err) => {
      if (err) console.error(err.message);
      else console.log('Cleared sequence');
    });
    db.run(`DELETE FROM teams;`, (err) => {
      if (err) console.error(err.message);
      else console.log('Cleared teams');
    });
    db.run(`DELETE FROM sqlite_sequence;`, (err) => {
      if (err) console.error(err.message);
      else console.log('Cleared sqlite_sequence');
    });
  });

db.close();