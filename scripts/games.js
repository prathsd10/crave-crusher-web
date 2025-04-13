
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
  
  // Initialize games
  initMemoryGame();
});
