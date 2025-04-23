const Database = require('better-sqlite3');
const db = new Database('game.db');

function insertTeams() {
  const teamsToInsert = ['ABC123', 'DEF456', 'ASD789'];
  const checkTeam = db.prepare('SELECT COUNT(*) as count FROM teams WHERE name = ?');
  const insertTeam = db.prepare('INSERT INTO teams (name) VALUES (?)');

  teamsToInsert.forEach(teamName => {
    const exists = checkTeam.get(teamName);
    if (exists.count === 0) {
      insertTeam.run(teamName);
      console.log(`Inserted team ${teamName}`);
    } else {
      console.log(`Team ${teamName} already exists`);
    }
  });
}

insertTeams();
