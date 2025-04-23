const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Updated database path - Safer than: const db = new sqlite3.Database('game.db');
const db = new sqlite3.Database(path.join(__dirname, 'game.db'), (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware
app.use(express.json());
app.use(express.static('public'));


// Route: login with serial
app.post('/login', (req, res) => {
  const { serial } = req.body;
  db.get('SELECT team_id, name, progress FROM teams WHERE name = ?', [serial], (err, row) => {
    if (err) return res.status(500).send('Database error');
    if (!row) return res.status(401).send('Invalid serial');
    res.json({ team_id: row.team_id, progress: row.progress });
  });
});

// Route: check password and move to next step
app.post('/check-password', (req, res) => {
  const { team_id, password } = req.body;

  db.get('SELECT progress FROM teams WHERE team_id = ?', [team_id], (err, team) => {
    if (err || !team) return res.status(500).send('Error getting team progress');
    
    const currentStep = team.progress;

    db.get(
      'SELECT password, hint FROM sequence WHERE team_id = ? AND step_num = ?',
      [team_id, currentStep],
      (err, stepRow) => {
        if (err || !stepRow) return res.status(500).send('Error getting step data');

        if (password === stepRow.password) {
          // Correct password → move to next step
          db.run('UPDATE teams SET progress = progress + 1 WHERE team_id = ?', [team_id], (err) => {
            if (err) return res.status(500).send('Error updating progress');

            res.json({ correct: true, nextHint: stepRow.hint, nextStep: currentStep + 1 });
          });
        } else {
          res.json({ correct: false });
        }
      }
    );
  });
});

// Route: send hint for current step
app.post('/get-hint', (req, res) => {
  const { team_id } = req.body;

  db.get('SELECT progress FROM teams WHERE team_id = ?', [team_id], (err, team) => {
    if (err || !team) return res.status(500).send('Error getting progress');

    const currentStep = team.progress;

    db.get('SELECT hint FROM sequence WHERE team_id = ? AND step_num = ?', [team_id, currentStep], (err, row) => {
      if (err || !row) return res.status(500).send('Error getting hint');
      res.json({ hint: row.hint });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));