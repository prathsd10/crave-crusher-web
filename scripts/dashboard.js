
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const daysSmokeFreeStat = document.getElementById('days-smoke-free');
  const moneySavedStat = document.getElementById('money-saved');
  const cigarettesAvoidedStat = document.getElementById('cigarettes-avoided');
  
  const quitDateInput = document.getElementById('quit-date');
  const saveQuitDateBtn = document.getElementById('save-date');
  
  const cigarettesPerDayInput = document.getElementById('cigarettes-per-day');
  const pricePerPackInput = document.getElementById('price-per-pack');
  const cigarettesPerPackInput = document.getElementById('cigarettes-per-pack');
  const saveSettingsBtn = document.getElementById('save-settings');
  
  const bloodPressureDays = document.getElementById('blood-pressure-days');
  const carbonMonoxideDays = document.getElementById('carbon-monoxide-days');
  const lungFunctionDays = document.getElementById('lung-function-days');
  
  const bloodPressureBar = document.getElementById('blood-pressure-bar');
  const carbonMonoxideBar = document.getElementById('carbon-monoxide-bar');
  const lungFunctionBar = document.getElementById('lung-function-bar');
  
  const newQuoteBtn = document.getElementById('new-quote');
  const quoteElement = document.getElementById('quote');
  
  // Load saved data
  const quitDate = getFromLocalStorage(localStorageKeys.QUIT_DATE, null);
  const cigarettesPerDay = getFromLocalStorage(localStorageKeys.CIGARETTES_PER_DAY, 10);
  const pricePerPack = getFromLocalStorage(localStorageKeys.PRICE_PER_PACK, 8.00);
  const cigarettesPerPack = getFromLocalStorage(localStorageKeys.CIGARETTES_PER_PACK, 20);
  
  // Set input values from storage
  if (quitDate) {
    quitDateInput.value = new Date(quitDate).toISOString().split('T')[0];
  }
  
  cigarettesPerDayInput.value = cigarettesPerDay;
  pricePerPackInput.value = pricePerPack;
  cigarettesPerPackInput.value = cigarettesPerPack;
  
  // Update dashboard stats
  updateDashboardStats();
  
  // Event listeners
  if (saveQuitDateBtn) {
    saveQuitDateBtn.addEventListener('click', function() {
      const newQuitDate = quitDateInput.value;
      if (newQuitDate) {
        saveToLocalStorage(localStorageKeys.QUIT_DATE, newQuitDate);
        updateDashboardStats();
        alert('Quit date saved successfully!');
      } else {
        alert('Please select a valid date.');
      }
    });
  }
  
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', function() {
      const newCigarettesPerDay = parseInt(cigarettesPerDayInput.value) || 10;
      const newPricePerPack = parseFloat(pricePerPackInput.value) || 8.00;
      const newCigarettesPerPack = parseInt(cigarettesPerPackInput.value) || 20;
      
      saveToLocalStorage(localStorageKeys.CIGARETTES_PER_DAY, newCigarettesPerDay);
      saveToLocalStorage(localStorageKeys.PRICE_PER_PACK, newPricePerPack);
      saveToLocalStorage(localStorageKeys.CIGARETTES_PER_PACK, newCigarettesPerPack);
      
      updateDashboardStats();
      alert('Settings saved successfully!');
    });
  }
  
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', function() {
      getNewQuote();
    });
  }
  
  // Functions
  function updateDashboardStats() {
    const quitDate = getFromLocalStorage(localStorageKeys.QUIT_DATE, null);
    
    if (!quitDate) {
      return;
    }
    
    const now = new Date();
    const quitDateTime = new Date(quitDate);
    const daysSinceStopping = daysBetween(quitDateTime, now);
    
    // Update stats
    if (daysSmokeFreeStat) {
      daysSmokeFreeStat.textContent = daysSinceStopping;
    }
    
    // Calculate money saved
    const cigarettesPerDay = getFromLocalStorage(localStorageKeys.CIGARETTES_PER_DAY, 10);
    const pricePerPack = getFromLocalStorage(localStorageKeys.PRICE_PER_PACK, 8.00);
    const cigarettesPerPack = getFromLocalStorage(localStorageKeys.CIGARETTES_PER_PACK, 20);
    
    const moneySavedPerDay = (cigarettesPerDay / cigarettesPerPack) * pricePerPack;
    const totalMoneySaved = moneySavedPerDay * daysSinceStopping;
    
    if (moneySavedStat) {
      moneySavedStat.textContent = formatCurrency(totalMoneySaved);
    }
    
    // Calculate cigarettes avoided
    const totalCigarettesAvoided = cigarettesPerDay * daysSinceStopping;
    
    if (cigarettesAvoidedStat) {
      cigarettesAvoidedStat.textContent = totalCigarettesAvoided;
    }
    
    // Update health improvements
    updateHealthBars(daysSinceStopping);
  }
  
  function updateHealthBars(days) {
    // Blood pressure returns to normal: ~2 weeks
    const bloodPressureDaysNeeded = 14;
    const bloodPressureProgress = Math.min(days / bloodPressureDaysNeeded, 1) * 100;
    
    if (bloodPressureDays) {
      bloodPressureDays.textContent = days >= bloodPressureDaysNeeded 
        ? 'Complete!' 
        : `${days}/${bloodPressureDaysNeeded} days`;
    }
    
    if (bloodPressureBar) {
      bloodPressureBar.style.width = `${bloodPressureProgress}%`;
    }
    
    // Carbon monoxide levels drop: ~2 days
    const carbonMonoxideDaysNeeded = 2;
    const carbonMonoxideProgress = Math.min(days / carbonMonoxideDaysNeeded, 1) * 100;
    
    if (carbonMonoxideDays) {
      carbonMonoxideDays.textContent = days >= carbonMonoxideDaysNeeded 
        ? 'Complete!' 
        : `${days}/${carbonMonoxideDaysNeeded} days`;
    }
    
    if (carbonMonoxideBar) {
      carbonMonoxideBar.style.width = `${carbonMonoxideProgress}%`;
    }
    
    // Lung function improves: ~90 days
    const lungFunctionDaysNeeded = 90;
    const lungFunctionProgress = Math.min(days / lungFunctionDaysNeeded, 1) * 100;
    
    if (lungFunctionDays) {
      lungFunctionDays.textContent = days >= lungFunctionDaysNeeded 
        ? 'Complete!' 
        : `${days}/${lungFunctionDaysNeeded} days`;
    }
    
    if (lungFunctionBar) {
      lungFunctionBar.style.width = `${lungFunctionProgress}%`;
    }
  }
  
  // Motivation quotes
  const quotes = [
    "Every time you resist a craving, you're getting stronger.",
    "You were born to be a victor, not a victim of smoking.",
    "You're not giving up anything by quitting smoking. You're gaining everything.",
    "Quitting smoking is the best gift you can give yourself and your loved ones.",
    "The best time to quit smoking was the day you started, the second best time is today.",
    "Your lungs are healing a little more with each breath of fresh air.",
    "Each cigarette not smoked is a small victory in your journey to freedom.",
    "The first step to quitting smoking is believing that you can do it.",
    "The struggle you're facing today is developing the strength you need for tomorrow.",
    "Don't let one slip become a fall - keep moving forward in your smoke-free journey.",
    "Your body starts healing the moment you stop smoking.",
    "You didn't come this far to only come this far.",
    "Your desire to smoke will pass whether you light up or not.",
    "Every day without smoking is another day of freedom.",
    "You're not quitting smoking, you're becoming free from it."
  ];
  
  function getNewQuote() {
    if (!quoteElement) return;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
    
    quoteElement.classList.remove('fade-in');
    void quoteElement.offsetWidth; // Trigger a DOM reflow
    quoteElement.classList.add('fade-in');
  }
  
  // Initialize with a random quote
  getNewQuote();
});
