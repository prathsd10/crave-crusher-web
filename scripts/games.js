
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const gameTabs = document.querySelectorAll('.game-tab');
  const gameContents = document.querySelectorAll('.game-content');
  
  gameTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const gameType = this.getAttribute('data-game');
      
      // Update active tab
      gameTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding content
      gameContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${gameType}-game`) {
          content.classList.add('active');
        }
      });
    });
  });
  
  // Memory Game
  const memoryBoard = document.getElementById('memory-board');
  const memoryMovesDisplay = document.getElementById('memory-moves');
  const memoryPairsDisplay = document.getElementById('memory-pairs');
  const memoryResetBtn = document.getElementById('memory-reset');
  
  let memoryCards = [];
  let memoryFlippedCards = [];
  let memoryMoves = 0;
  let memoryPairsFound = 0;
  let memoryLocked = false;
  
  const memoryIcons = ['🍎', '🍌', '🍒', '🍊', '🍇', '🍉', '🍓', '🍍', '🥝', '🥑', '🥦', '🥕'];
  
  function initMemoryGame() {
    if (!memoryBoard) return;
    
    memoryMovesDisplay.textContent = '0';
    memoryPairsDisplay.textContent = '0/8';
    memoryMoves = 0;
    memoryPairsFound = 0;
    memoryFlippedCards = [];
    memoryLocked = false;
    
    // Create 8 pairs of cards
    memoryCards = [];
    const selectedIcons = [...memoryIcons].sort(() => 0.5 - Math.random()).slice(0, 8);
    const cardPairs = [...selectedIcons, ...selectedIcons];
    
    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => 0.5 - Math.random());
    
    // Create the board
    memoryBoard.innerHTML = '';
    shuffledCards.forEach((icon, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.icon = icon;
      card.dataset.index = index;
      
      card.innerHTML = `
        <div class="memory-card-front">
          <div class="memory-card-content">${icon}</div>
        </div>
        <div class="memory-card-back"></div>
      `;
      
      card.addEventListener('click', flipCard);
      memoryBoard.appendChild(card);
      memoryCards.push(card);
    });
  }
  
  function flipCard() {
    if (memoryLocked) return;
    if (this === memoryFlippedCards[0]) return;
    if (this.classList.contains('matched')) return;
    
    this.classList.add('flipped');
    
    memoryFlippedCards.push(this);
    
    if (memoryFlippedCards.length === 2) {
      memoryLocked = true;
      memoryMoves++;
      memoryMovesDisplay.textContent = memoryMoves;
      
      // Check for a match
      const firstIcon = memoryFlippedCards[0].dataset.icon;
      const secondIcon = memoryFlippedCards[1].dataset.icon;
      
      if (firstIcon === secondIcon) {
        // Cards match
        memoryPairsFound++;
        memoryPairsDisplay.textContent = `${memoryPairsFound}/8`;
        
        memoryFlippedCards.forEach(card => {
          card.classList.add('matched');
          card.removeEventListener('click', flipCard);
        });
        
        memoryFlippedCards = [];
        memoryLocked = false;
        
        // Check if game is won
        if (memoryPairsFound === 8) {
          setTimeout(() => {
            alert(`Congratulations! You won in ${memoryMoves} moves!`);
          }, 500);
        }
      } else {
        // Cards don't match, flip them back
        setTimeout(() => {
          memoryFlippedCards.forEach(card => {
            card.classList.remove('flipped');
          });
          memoryFlippedCards = [];
          memoryLocked = false;
        }, 1000);
      }
    }
  }
  
  if (memoryResetBtn) {
    memoryResetBtn.addEventListener('click', initMemoryGame);
  }
  
  // Bubble Pop Game
  const bubbleBoard = document.getElementById('bubble-board');
  const bubbleScoreDisplay = document.getElementById('bubble-score');
  const bubbleTimeDisplay = document.getElementById('bubble-time');
  const bubbleStartBtn = document.getElementById('bubble-start');
  
  let bubbleScore = 0;
  let bubbleTime = 30;
  let bubbleInterval;
  let bubbleGameActive = false;
  
  function startBubbleGame() {
    if (!bubbleBoard) return;
    
    // Reset game state
    bubbleScore = 0;
    bubbleTime = 30;
    bubbleScoreDisplay.textContent = bubbleScore;
    bubbleTimeDisplay.textContent = bubbleTime;
    bubbleBoard.innerHTML = '';
    bubbleGameActive = true;
    bubbleStartBtn.disabled = true;
    
    // Create bubbles
    createBubble();
    
    // Start timer
    bubbleInterval = setInterval(() => {
      bubbleTime--;
      bubbleTimeDisplay.textContent = bubbleTime;
      
      if (bubbleTime <= 0) {
        endBubbleGame();
      }
    }, 1000);
  }
  
  function createBubble() {
    if (!bubbleGameActive || !bubbleBoard) return;
    
    // Create a new bubble
    const bubble = document.createElement('div');
    
    // Random size between 40 and 80 pixels
    const size = Math.floor(Math.random() * 41) + 40;
    
    // Random position within the board
    const maxLeft = bubbleBoard.offsetWidth - size;
    const maxTop = bubbleBoard.offsetHeight - size;
    const left = Math.floor(Math.random() * maxLeft);
    const top = Math.floor(Math.random() * maxTop);
    
    // Random color
    const colors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Set bubble style
    bubble.className = 'bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
    bubble.style.backgroundColor = color;
    
    // Random points based on size, smaller bubbles = more points
    const points = Math.floor(100 / size * 10);
    bubble.dataset.points = points;
    bubble.innerHTML = `<span>${points}</span>`;
    
    // Add click handler
    bubble.addEventListener('click', popBubble);
    
    // Add to the board
    bubbleBoard.appendChild(bubble);
    
    // Make bubble disappear after random time
    setTimeout(() => {
      if (bubble.parentNode === bubbleBoard) {
        bubbleBoard.removeChild(bubble);
        // Create a new bubble if the game is still active
        if (bubbleGameActive) {
          createBubble();
        }
      }
    }, Math.random() * 1500 + 1500);
    
    // Create more bubbles based on game progress
    if (bubbleGameActive) {
      setTimeout(createBubble, Math.random() * 1000 + 500);
    }
  }
  
  function popBubble() {
    if (!bubbleGameActive) return;
    
    // Add points
    const points = parseInt(this.dataset.points);
    bubbleScore += points;
    bubbleScoreDisplay.textContent = bubbleScore;
    
    // Animate bubble pop
    this.classList.add('popping');
    
    // Remove bubble after animation
    setTimeout(() => {
      if (this.parentNode === bubbleBoard) {
        bubbleBoard.removeChild(this);
      }
    }, 200);
  }
  
  function endBubbleGame() {
    bubbleGameActive = false;
    clearInterval(bubbleInterval);
    bubbleBoard.innerHTML = '';
    bubbleStartBtn.disabled = false;
    
    alert(`Game over! Your score: ${bubbleScore}`);
  }
  
  if (bubbleStartBtn) {
    bubbleStartBtn.addEventListener('click', startBubbleGame);
  }
  
  // Speed Typing Game
  const wordDisplay = document.getElementById('word-display');
  const wordInput = document.getElementById('word-input');
  const typingScoreDisplay = document.getElementById('typing-score');
  const typingTimeDisplay = document.getElementById('typing-time');
  const typingStartBtn = document.getElementById('typing-start');
  
  let typingWords = ['quit', 'smoking', 'health', 'freedom', 'breathe', 'fresh', 'lungs', 'clean', 'life', 'better', 'cravings', 'overcome', 'strong', 'willpower', 'victory', 'success', 'achievement', 'proud', 'journey', 'support', 'community', 'habit', 'change', 'improve', 'tobacco', 'nicotine', 'addiction', 'recovery', 'progress', 'milestone'];
  let currentWord = '';
  let typingScore = 0;
  let typingTime = 60;
  let typingInterval;
  let typingGameActive = false;
  
  function startTypingGame() {
    if (!wordDisplay || !wordInput) return;
    
    // Reset game state
    typingScore = 0;
    typingTime = 60;
    typingScoreDisplay.textContent = typingScore;
    typingTimeDisplay.textContent = typingTime;
    typingGameActive = true;
    typingStartBtn.disabled = true;
    wordInput.disabled = false;
    wordInput.value = '';
    wordInput.focus();
    
    // First word
    setNextWord();
    
    // Start timer
    typingInterval = setInterval(() => {
      typingTime--;
      typingTimeDisplay.textContent = typingTime;
      
      if (typingTime <= 0) {
        endTypingGame();
      }
    }, 1000);
    
    // Check input
    wordInput.addEventListener('input', checkMatch);
  }
  
  function setNextWord() {
    // Choose random word
    currentWord = typingWords[Math.floor(Math.random() * typingWords.length)];
    wordDisplay.innerHTML = `<span class="current-word">${currentWord}</span>`;
  }
  
  function checkMatch() {
    if (wordInput.value === currentWord) {
      // Word matches
      typingScore++;
      typingScoreDisplay.textContent = typingScore;
      
      // Clear input and set next word
      wordInput.value = '';
      setNextWord();
    }
  }
  
  function endTypingGame() {
    typingGameActive = false;
    clearInterval(typingInterval);
    wordInput.disabled = true;
    typingStartBtn.disabled = false;
    wordDisplay.innerHTML = `<span class="current-word">Game Over!</span>`;
    
    alert(`Game over! You typed ${typingScore} words correctly!`);
    
    // Remove input event listener
    wordInput.removeEventListener('input', checkMatch);
  }
  
  if (typingStartBtn) {
    typingStartBtn.addEventListener('click', startTypingGame);
  }
  
  // Breathing Exercise
  const breathingCircle = document.getElementById('breathing-circle');
  const breathingInstruction = document.getElementById('breathing-instruction');
  const breathingTimer = document.getElementById('breathing-timer');
  const breathingStartBtn = document.getElementById('breathing-start');
  const breathingCyclesDisplay = document.getElementById('breathing-cycles');
  
  let breathingCycles = 0;
  let breathingInterval;
  let breathingPhase = 'inhale';
  let breathingTimeLeft = 0;
  let breathingActive = false;
  
  function startBreathingExercise() {
    if (!breathingCircle || !breathingStartBtn) return;
    
    breathingActive = true;
    breathingStartBtn.disabled = true;
    breathingCycles = 0;
    breathingCyclesDisplay.textContent = '0';
    breathingPhase = 'inhale';
    breathingTimeLeft = 4; // 4 seconds inhale
    
    // Set initial state
    breathingCircle.className = 'breathing-circle inhale';
    breathingInstruction.textContent = 'Inhale';
    breathingTimer.textContent = breathingTimeLeft;
    
    breathingInterval = setInterval(updateBreathingExercise, 1000);
  }
  
  function updateBreathingExercise() {
    breathingTimeLeft--;
    breathingTimer.textContent = breathingTimeLeft;
    
    if (breathingTimeLeft <= 0) {
      // Switch phases
      if (breathingPhase === 'inhale') {
        // Switch to hold
        breathingPhase = 'hold';
        breathingTimeLeft = 7; // 7 seconds hold
        breathingCircle.className = 'breathing-circle hold';
        breathingInstruction.textContent = 'Hold';
      } else if (breathingPhase === 'hold') {
        // Switch to exhale
        breathingPhase = 'exhale';
        breathingTimeLeft = 8; // 8 seconds exhale
        breathingCircle.className = 'breathing-circle exhale';
        breathingInstruction.textContent = 'Exhale';
      } else if (breathingPhase === 'exhale') {
        // Completed one cycle
        breathingCycles++;
        breathingCyclesDisplay.textContent = breathingCycles;
        
        if (breathingCycles >= 3) {
          // End after 3 cycles
          endBreathingExercise();
          return;
        }
        
        // Start next cycle
        breathingPhase = 'inhale';
        breathingTimeLeft = 4;
        breathingCircle.className = 'breathing-circle inhale';
        breathingInstruction.textContent = 'Inhale';
      }
      
      breathingTimer.textContent = breathingTimeLeft;
    }
  }
  
  function endBreathingExercise() {
    breathingActive = false;
    clearInterval(breathingInterval);
    
    breathingCircle.className = 'breathing-circle';
    breathingInstruction.textContent = 'Exercise Complete';
    breathingTimer.textContent = '';
    breathingStartBtn.disabled = false;
    
    setTimeout(() => {
      breathingInstruction.textContent = 'Ready to begin';
    }, 3000);
    
    alert('Great job! You completed 3 breathing cycles. This technique can help reduce stress and cravings.');
  }
  
  if (breathingStartBtn) {
    breathingStartBtn.addEventListener('click', startBreathingExercise);
  }
  
  // Distraction Tasks
  const taskButtons = document.querySelectorAll('.task-btn');
  const taskModal = document.getElementById('task-modal');
  const closeModal = document.querySelector('.close-modal');
  const taskTitle = document.getElementById('task-title');
  const taskDescription = document.getElementById('task-description');
  const taskInteraction = document.getElementById('task-interaction');
  const taskCompleteBtn = document.getElementById('task-complete');
  
  // Task definitions
  const tasks = {
    senses: {
      title: '5-Senses Exercise',
      description: 'This mindfulness exercise helps ground you in the present moment. Take a deep breath and focus on your surroundings.',
      interaction: `
        <div class="senses-exercise">
          <p>List 5 things you can <strong>see</strong> right now:</p>
          <textarea rows="2" class="sense-input" placeholder="I can see..."></textarea>
          
          <p>List 4 things you can <strong>touch</strong> or feel:</p>
          <textarea rows="2" class="sense-input" placeholder="I can touch..."></textarea>
          
          <p>List 3 things you can <strong>hear</strong>:</p>
          <textarea rows="2" class="sense-input" placeholder="I can hear..."></textarea>
          
          <p>List 2 things you can <strong>smell</strong>:</p>
          <textarea rows="2" class="sense-input" placeholder="I can smell..."></textarea>
          
          <p>List 1 thing you can <strong>taste</strong>:</p>
          <textarea rows="2" class="sense-input" placeholder="I can taste..."></textarea>
        </div>
      `
    },
    puzzle: {
      title: 'Quick Puzzle',
      description: 'Solve this simple word scramble to engage your mind. Unscramble the letters to form words related to health and wellness.',
      interaction: `
        <div class="puzzle-exercise">
          <div class="scrambled-word">
            <p>Unscramble: <strong>HEHTLA</strong></p>
            <input type="text" class="puzzle-input" placeholder="Your answer...">
            <button class="puzzle-check">Check</button>
            <p class="puzzle-feedback"></p>
          </div>
          
          <div class="scrambled-word" style="display: none;">
            <p>Unscramble: <strong>TSFENSI</strong></p>
            <input type="text" class="puzzle-input" placeholder="Your answer...">
            <button class="puzzle-check">Check</button>
            <p class="puzzle-feedback"></p>
          </div>
          
          <div class="scrambled-word" style="display: none;">
            <p>Unscramble: <strong>GERNETY</strong></p>
            <input type="text" class="puzzle-input" placeholder="Your answer...">
            <button class="puzzle-check">Check</button>
            <p class="puzzle-feedback"></p>
          </div>
        </div>
      `
    },
    words: {
      title: 'Word Association',
      description: 'Type as many related words as you can think of based on the prompt. This helps redirect your thoughts away from cravings.',
      interaction: `
        <div class="words-exercise">
          <p>Type as many words as you can related to: <strong id="word-prompt">NATURE</strong></p>
          <p>Separate each word with a comma.</p>
          <textarea rows="4" id="word-association" placeholder="tree, sky, ..."></textarea>
          <p>Words counted: <span id="word-count">0</span></p>
        </div>
      `
    },
    gratitude: {
      title: 'Gratitude List',
      description: 'Shifting focus to gratitude can help change your emotional state and reduce cravings. List things you are grateful for.',
      interaction: `
        <div class="gratitude-exercise">
          <p>List 3 things you are grateful for today:</p>
          <textarea rows="2" class="gratitude-input" placeholder="1. I am grateful for..."></textarea>
          <textarea rows="2" class="gratitude-input" placeholder="2. I am grateful for..."></textarea>
          <textarea rows="2" class="gratitude-input" placeholder="3. I am grateful for..."></textarea>
        </div>
      `
    }
  };
  
  function openTaskModal(taskType) {
    if (!taskModal || !tasks[taskType]) return;
    
    // Set task content
    const task = tasks[taskType];
    taskTitle.textContent = task.title;
    taskDescription.textContent = task.description;
    taskInteraction.innerHTML = task.interaction;
    
    // Show modal
    taskModal.style.display = 'block';
    
    // Add event listeners for task interactions
    if (taskType === 'puzzle') {
      setupPuzzleTask();
    } else if (taskType === 'words') {
      setupWordAssociationTask();
    }
  }
  
  function setupPuzzleTask() {
    const puzzleChecks = document.querySelectorAll('.puzzle-check');
    
    puzzleChecks.forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const feedback = this.nextElementSibling;
        const container = this.closest('.scrambled-word');
        const nextContainer = container.nextElementSibling;
        const scrambledWord = container.querySelector('strong').textContent;
        
        let answer = '';
        if (scrambledWord === 'HEHTLA') answer = 'HEALTH';
        if (scrambledWord === 'TSFENSI') answer = 'FITNESS';
        if (scrambledWord === 'GERNETY') answer = 'ENERGY';
        
        if (input.value.toUpperCase() === answer) {
          feedback.textContent = 'Correct!';
          feedback.style.color = 'green';
          
          // Show next puzzle if available
          if (nextContainer) {
            setTimeout(() => {
              nextContainer.style.display = 'block';
            }, 1000);
          }
        } else {
          feedback.textContent = 'Try again!';
          feedback.style.color = 'red';
        }
      });
    });
  }
  
  function setupWordAssociationTask() {
    const wordAssociation = document.getElementById('word-association');
    const wordCount = document.getElementById('word-count');
    
    if (wordAssociation && wordCount) {
      wordAssociation.addEventListener('input', function() {
        const words = this.value.split(',').filter(word => word.trim() !== '').length;
        wordCount.textContent = words;
      });
    }
  }
  
  function closeTaskModal() {
    if (!taskModal) return;
    taskModal.style.display = 'none';
    taskInteraction.innerHTML = '';
  }
  
  // Event listeners for tasks
  if (taskButtons) {
    taskButtons.forEach(button => {
      button.addEventListener('click', function() {
        const taskType = this.getAttribute('data-task');
        openTaskModal(taskType);
      });
    });
  }
  
  if (closeModal) {
    closeModal.addEventListener('click', closeTaskModal);
  }
  
  if (taskCompleteBtn) {
    taskCompleteBtn.addEventListener('click', function() {
      alert('Great job completing this task! Taking small actions like this helps build your skills for managing cravings.');
      closeTaskModal();
    });
  }
  
  // Initialize games
  initMemoryGame();
  
  // Close modal when clicking outside content
  window.addEventListener('click', function(event) {
    if (event.target === taskModal) {
      closeTaskModal();
    }
  });
});
