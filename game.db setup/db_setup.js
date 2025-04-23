const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('game.db');

db.serialize(() => {
  // Create teams table
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      team_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      progress INTEGER DEFAULT 1
    )
  `);

  // Create sequence table
  db.run(`
    CREATE TABLE IF NOT EXISTS sequence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL,
      step_num INTEGER NOT NULL,
      hint TEXT,
      password TEXT,
      FOREIGN KEY (team_id) REFERENCES teams(team_id)
    )
  `);
});

db.close();
