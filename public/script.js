let teamId = null;
let currentStep = 1;
const coordinates = "49.2064153N 16.6073919E"
const coordDivided = {
  1: "___",
  2: "60", 
  3: "60206", 
  4: "6020619", 
  5: "602061916", 
  6: "602061916415", 
  7: "60206191641549",  
  8: "49.2064153N 16.6073919E"
};

function login() {
  const serial = document.getElementById('serial-input').value;
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serial })
  })
  .then(res => {
    if (!res.ok) throw new Error('Invalid team name');
    return res.json();
  })
  .then(data => {
    teamId = data.team_id;
    currentStep = data.progress;
    document.getElementById('login-screen').style.display = 'none';
    loadHint();
  })
  .catch(err => {
    document.getElementById('login-error').innerText = err.message;
  });
}

function loadHint() {
  if (currentStep > 7) {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('congrats-screen').style.display = 'block';
    document.getElementById('coordinates2').innerText = coordDivided[currentStep] || "___";
    return;
  }

  // Fetch the hint for the current step
  fetch('/get-hint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team_id: teamId })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('hint').innerText = data.hint;
    document.getElementById('coordinates').innerText = coordDivided[currentStep] || "___";
  });
}


function submitPassword() {
  const password = document.getElementById('password-input').value;
  fetch('/check-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team_id: teamId, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.correct) {
      currentStep = data.nextStep;
      document.getElementById('password-input').value = '';
      loadHint(); // Will also handle congrats screen if step > 7
    } else {
      document.getElementById('password-error').innerText = 'Incorrect password, try again.';
    }
  });
}
