
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const newTriggerForm = document.getElementById('new-trigger-form');
  const triggersList = document.getElementById('triggers-list');
  const intensitySlider = document.getElementById('trigger-intensity');
  const intensityValue = document.getElementById('intensity-value');
  const effectivenessSlider = document.getElementById('strategy-effectiveness');
  const effectivenessValue = document.getElementById('effectiveness-value');
  const startBreathingBtn = document.getElementById('start-breathing');
  const breathingCircle = document.querySelector('.circle');
  const breathingInstruction = document.getElementById('breathing-instruction');
  const breathingTimer = document.getElementById('breathing-timer');
  
  // Initialize sliders
  if (intensitySlider && intensityValue) {
    intensitySlider.addEventListener('input', function() {
      intensityValue.textContent = this.value;
    });
  }
  
  if (effectivenessSlider && effectivenessValue) {
    effectivenessSlider.addEventListener('input', function() {
      effectivenessValue.textContent = this.value;
    });
  }
  
  // Display saved triggers
  displayTriggers();
  
  // Event listeners
  if (newTriggerForm) {
    newTriggerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const situation = document.getElementById('trigger-situation').value;
      const emotions = document.getElementById('trigger-emotions').value;
      const intensity = document.getElementById('trigger-intensity').value;
      const strategy = document.getElementById('coping-strategy').value;
      const effectiveness = document.getElementById('strategy-effectiveness').value;
      
      const newTrigger = {
        id: generateId(),
        situation,
        emotions,
        intensity,
        strategy,
        effectiveness,
        date: new Date().toISOString()
      };
      
      const triggers = getFromLocalStorage(localStorageKeys.TRIGGERS, []);
      triggers.unshift(newTrigger); // Add to beginning
      
      saveToLocalStorage(localStorageKeys.TRIGGERS, triggers);
      displayTriggers();
      
      newTriggerForm.reset();
      if (intensityValue) intensityValue.textContent = '5';
      if (effectivenessValue) effectivenessValue.textContent = '5';
      
      alert('Your trigger has been logged successfully!');
    });
  }
  
  // Breathing exercise
  if (startBreathingBtn) {
    startBreathingBtn.addEventListener('click', startBreathingExercise);
  }
  
  // Functions
  function displayTriggers() {
    if (!triggersList) return;
    
    const triggers = getFromLocalStorage(localStorageKeys.TRIGGERS, []);
    
    if (triggers.length === 0) {
      triggersList.innerHTML = `
        <div class="text-center mt-3 mb-3">
          <p>No triggers logged yet. Start tracking your triggers to see patterns.</p>
        </div>
      `;
      return;
    }
    
    triggersList.innerHTML = '';
    
    triggers.forEach(trigger => {
      let levelClass = 'level-low';
      if (trigger.intensity > 7) {
        levelClass = 'level-high';
      } else if (trigger.intensity > 4) {
        levelClass = 'level-medium';
      }
      
      const triggerElement = document.createElement('div');
      triggerElement.className = `trigger-log-item ${levelClass}`;
      triggerElement.innerHTML = `
        <h5>${trigger.situation}</h5>
        <p><strong>When:</strong> ${formatDate(trigger.date)}</p>
        <p><strong>Emotions:</strong> ${trigger.emotions}</p>
        <div class="trigger-level">
          <span>Craving:</span>
          <div class="trigger-level-bar">
            <div class="trigger-level-fill" style="width: ${trigger.intensity * 10}%"></div>
          </div>
          <span>${trigger.intensity}/10</span>
        </div>
        <p class="mt-2"><strong>Coping strategy:</strong> ${trigger.strategy}</p>
        <div class="trigger-level">
          <span>Effectiveness:</span>
          <div class="trigger-level-bar">
            <div class="trigger-level-fill" style="background-color: var(--primary-color); width: ${trigger.effectiveness * 10}%"></div>
          </div>
          <span>${trigger.effectiveness}/10</span>
        </div>
      `;
      
      triggersList.appendChild(triggerElement);
    });
  }
  
  function startBreathingExercise() {
    if (!breathingCircle || !breathingInstruction || !breathingTimer || !startBreathingBtn) return;
    
    startBreathingBtn.disabled = true;
    let phase = 'inhale';
    let timeLeft = 4;
    
    // Initial state
    breathingCircle.className = 'circle inhale';
    breathingInstruction.textContent = 'Inhale';
    breathingTimer.textContent = timeLeft;
    
    const intervalId = setInterval(() => {
      timeLeft--;
      
      if (timeLeft <= 0) {
        // Switch to next phase
        if (phase === 'inhale') {
          phase = 'hold';
          timeLeft = 7;
          breathingCircle.className = 'circle hold';
          breathingInstruction.textContent = 'Hold';
        } else if (phase === 'hold') {
          phase = 'exhale';
          timeLeft = 8;
          breathingCircle.className = 'circle exhale';
          breathingInstruction.textContent = 'Exhale';
        } else {
          // End of cycle
          clearInterval(intervalId);
          breathingCircle.className = 'circle';
          breathingInstruction.textContent = 'Done';
          breathingTimer.textContent = '';
          startBreathingBtn.disabled = false;
          
          setTimeout(() => {
            breathingInstruction.textContent = 'Inhale';
            breathingTimer.textContent = '4';
          }, 2000);
          
          return;
        }
      }
      
      breathingTimer.textContent = timeLeft;
    }, 1000);
  }
  
  // Add sample triggers if none exist
  function addSampleTriggers() {
    const triggers = getFromLocalStorage(localStorageKeys.TRIGGERS, []);
    
    if (triggers.length === 0) {
      const sampleTriggers = [
        {
          id: 'trigger1',
          situation: 'Morning coffee',
          emotions: 'Anxious, Routine',
          intensity: 8,
          strategy: 'Changed to tea instead of coffee and sat in a different location',
          effectiveness: 6,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        },
        {
          id: 'trigger2',
          situation: 'Work deadline stress',
          emotions: 'Overwhelmed, Pressured',
          intensity: 9,
          strategy: 'Stepped outside for 5 minutes and did deep breathing',
          effectiveness: 7,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        }
      ];
      
      saveToLocalStorage(localStorageKeys.TRIGGERS, sampleTriggers);
      displayTriggers();
    }
  }
  
  // Initialize with sample triggers if needed
  addSampleTriggers();
});
