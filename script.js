// ==UserScript==
    // === Configuration ===
    // Manually set the answer here: true = died today, false = no
    const diedToday = false;

    // Election date: Next Turkish presidential election
    // According to current rules, next election is expected on 18 June 2028.
    // We'll use 18 June 2028 00:00:00 local time (Turkey time UTC+3)
    const electionDate = new Date('2028-06-18T00:00:00+03:00');

    // For elapsed time calculation, assume election cycle started on 28 June 2023
    // (last election date) - you can adjust this as needed
    const lastElectionDate = new Date('2023-06-28T00:00:00+03:00');

    // === Left Column Logic ===
    const leftColumn = document.getElementById('left-column');
    const deathAnswer = document.getElementById('death-answer');

    if (diedToday) {
      // Positive answer: show festive theme with confetti and waving flags
      deathAnswer.textContent = 'Evet';
      leftColumn.classList.remove('somber');
      leftColumn.classList.add('festive');


      // Add confetti animation
      const confettiCount = 80;
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = (Math.random() * 3) + 's';
        confetti.style.backgroundColor = Math.random() > 0.5 ? '#e30b17' : '#fff';
        confetti.style.width = confetti.style.height = (5 + Math.random() * 7) + 'px';
        confetti.style.top = (-10 - Math.random() * 20) + 'px';
        document.body.appendChild(confetti);
      }
    } else {
      // Negative answer: somber dark theme
      deathAnswer.textContent = 'Hayır';
      leftColumn.classList.remove('festive');
      leftColumn.classList.add('somber');
    }

    // Function to create raindrop effect
function createRainEffect(container, dropCount = 60) {
  // Önceki damlaları temizle
  container.querySelectorAll('.rain-drop').forEach(el => el.remove());

  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement('div');
    drop.classList.add('rain-drop');
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDelay = (Math.random() * 1.2) + 's';
    drop.style.opacity = (0.25 + Math.random() * 0.5).toFixed(2);
    drop.style.height = (12 + Math.random() * 16) + 'px';
    container.appendChild(drop);
  }
}

// Somber temada yağmur efektini başlat
if (
  !diedToday &&
  !leftColumn.querySelector('.rain-drop')
) {
  createRainEffect(leftColumn);
}


    // === Right Column Countdown Logic ===
    const countdownEl = document.getElementById('countdown');
    const liquidFill = document.getElementById('liquid-fill');
    const liquidPercentage = document.getElementById('liquid-percentage');
    const liquidContainer = document.getElementById('liquid-container');

    function updateCountdown() {
      const now = new Date();

      // Calculate time difference to election
      let diff = electionDate - now;

      if (diff < 0) {
        // Election passed
        countdownEl.textContent = 'Seçim tamamlandı.';
        liquidFill.style.height = '100%';
        liquidPercentage.textContent = '100%';
        liquidContainer.setAttribute('aria-valuenow', 100);
        return;
      }

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);

      countdownEl.textContent = `${days} gün ${hours} saat ${minutes} dakika ${seconds} saniye kaldı`;

      // Calculate elapsed percentage between last election and next election
      const totalCycle = electionDate - lastElectionDate;
      const elapsed = now - lastElectionDate;
      let percentElapsed = Math.min(Math.max((elapsed / totalCycle) * 100, 0), 100);

      // Update liquid fill height and percentage text
      liquidFill.style.height = percentElapsed + '%';
      liquidPercentage.textContent = percentElapsed.toFixed(1) + '%';

      liquidContainer.setAttribute('aria-valuenow', percentElapsed.toFixed(1));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

