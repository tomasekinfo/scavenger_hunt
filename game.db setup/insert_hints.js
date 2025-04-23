const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('game.db');

const steps = [
  { id: 1, hint: 'Botanická zahrada', password: '6' },
  { id: 2, hint: 'Špilberk', password: 'Wolf' },
  { id: 3, hint: 'Socha samuraje', password: 'Goose' },
  { id: 4, hint: 'Mariánský sloup', password: '7' },
  { id: 5, hint: 'Krokodýl', password: 'Wheel' },
  { id: 6, hint: 'Budova u kostela', password: '1905' },
  { id: 7, hint: 'Socha anděla', password: 'Fire sword' }
];

// Fisher-Yates shuffle
function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fetch team_id + name
db.all(`SELECT team_id, name FROM teams`, [], (err, teams) => {
  if (err) throw err;

  const startingHints = shuffle(steps.map(step => step.id));

  teams.forEach((team, index) => {
    const firstStepId = startingHints[index % steps.length];
    let remainingSteps = steps.map(step => step.id).filter(id => id !== firstStepId);
    let fullSequence = [firstStepId, ...shuffle(remainingSteps)];

    const sequenceLog = [];

    fullSequence.forEach((stepId, stepNum) => {
      const step = steps.find(s => s.id === stepId);
      db.run(
        `UPDATE sequence SET hint = ?, password = ? WHERE team_id = ? AND step_num = ?`,
        [step.hint, step.password, team.team_id, stepNum + 1],
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            sequenceLog.push({ step_num: stepNum + 1, hint: step.hint, password: step.password });

            // Log after last step
            if (sequenceLog.length === fullSequence.length) {
              console.log(`Team "${team.name}" sequence:`);
              sequenceLog.forEach(entry => {
                console.log(`  Step ${entry.step_num}: Hint = "${entry.hint}", Password = "${entry.password}"`);
              });
            }
          }
        }
      );
    });
  });

  db.close();
});
