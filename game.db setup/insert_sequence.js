const Database = require('better-sqlite3');
const db = new Database('game.db');

function insertSequenceForTeams() {
  const getTeams = db.prepare('SELECT team_id FROM teams');
  const checkSequence = db.prepare('SELECT COUNT(*) as count FROM sequence WHERE team_id = ?');
  const insertSequence = db.prepare('INSERT INTO sequence (team_id, step_num, hint, password) VALUES (?, ?, NULL, NULL)');

  const teams = getTeams.all();

  teams.forEach(team => {
    const existing = checkSequence.get(team.team_id);
    if (existing.count === 0) {
      for (let step = 1; step <= 7; step++) {
        insertSequence.run(team.team_id, step);
      }
      console.log(`Inserted sequence for team_id ${team.team_id}`);
    } else {
      console.log(`Sequence already exists for team_id ${team.team_id}`);
    }
  });
}

insertSequenceForTeams();
