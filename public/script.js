let teamId = null;
let currentStep = 1;
const coordinates = "49.207163180375375, 16.607835752606128"
const coordDivided = {
  1: "___", 
  2: "49.20", 
  3: "49.2071631", 
  4: "49.207163180375", 
  5: "49.207163180375375, 1", 
  6: "49.207163180375375, 16.6078", 
  7: "49.207163180375375, 16.6078357526", 
  8: "49.207163180375375, 16.607835752606128"
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
