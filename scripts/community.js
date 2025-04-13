
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const storiesList = document.getElementById('stories-list');
  const commentsList = document.getElementById('comments-list');
  const shareStoryBtn = document.getElementById('share-story-btn');
  const storyForm = document.getElementById('story-form');
  const newStoryForm = document.getElementById('new-story-form');
  const cancelStoryBtn = document.getElementById('cancel-story');
  const newCommentForm = document.getElementById('new-comment-form');
  
  // Load saved data
  const stories = getFromLocalStorage(localStorageKeys.STORIES, []);
  const comments = getFromLocalStorage(localStorageKeys.COMMENTS, []);
  
  // Display stories and comments
  displayStories();
  displayComments();
  
  // Event listeners
  if (shareStoryBtn) {
    shareStoryBtn.addEventListener('click', function() {
      if (storyForm) {
        storyForm.classList.toggle('active');
        window.scrollTo({ top: storyForm.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }
  
  if (cancelStoryBtn) {
    cancelStoryBtn.addEventListener('click', function() {
      if (storyForm) {
        storyForm.classList.remove('active');
        if (newStoryForm) {
          newStoryForm.reset();
        }
      }
    });
  }
  
  if (newStoryForm) {
    newStoryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('story-name').value;
      const title = document.getElementById('story-title').value;
      const content = document.getElementById('story-content').value;
      const smokeFree = parseInt(document.getElementById('smoke-free-days').value);
      
      const newStory = {
        id: generateId(),
        name,
        title,
        content,
        smokeFree,
        date: new Date().toISOString(),
        likes: 0
      };
      
      const stories = getFromLocalStorage(localStorageKeys.STORIES, []);
      stories.unshift(newStory); // Add to beginning
      
      saveToLocalStorage(localStorageKeys.STORIES, stories);
      displayStories();
      
      newStoryForm.reset();
      if (storyForm) {
        storyForm.classList.remove('active');
      }
      
      alert('Your story has been shared successfully!');
    });
  }
  
  if (newCommentForm) {
    newCommentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('comment-name').value;
      const content = document.getElementById('comment-content').value;
      
      const newComment = {
        id: generateId(),
        name,
        content,
        date: new Date().toISOString()
      };
      
      const comments = getFromLocalStorage(localStorageKeys.COMMENTS, []);
      comments.unshift(newComment); // Add to beginning
      
      saveToLocalStorage(localStorageKeys.COMMENTS, comments);
      displayComments();
      
      newCommentForm.reset();
      
      alert('Your comment has been posted successfully!');
    });
  }
  
  // Functions
  function displayStories() {
    if (!storiesList) return;
    
    const stories = getFromLocalStorage(localStorageKeys.STORIES, []);
    
    if (stories.length === 0) {
      storiesList.innerHTML = `
        <div class="text-center mt-3 mb-3">
          <p>No stories yet. Be the first to share your journey!</p>
        </div>
      `;
      return;
    }
    
    storiesList.innerHTML = '';
    
    stories.forEach(story => {
      const storyElement = document.createElement('div');
      storyElement.className = 'story-card';
      storyElement.innerHTML = `
        <div class="story-header">
          <h4 class="story-title">${story.title}</h4>
          <div class="story-author">
            <span>${story.name}</span>
            <span class="story-badge">${story.smokeFree} days smoke-free</span>
          </div>
        </div>
        <div class="story-content">
          <p>${story.content}</p>
        </div>
        <div class="story-meta">
          <span>${timeAgo(story.date)}</span>
          <div class="story-likes">
            <button class="like-btn" data-id="${story.id}">
              ❤️ <span>${story.likes}</span>
            </button>
          </div>
        </div>
      `;
      
      storiesList.appendChild(storyElement);
    });
    
    // Add event listeners to like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const storyId = this.getAttribute('data-id');
        likeStory(storyId);
      });
    });
  }
  
  function displayComments() {
    if (!commentsList) return;
    
    const comments = getFromLocalStorage(localStorageKeys.COMMENTS, []);
    
    if (comments.length === 0) {
      commentsList.innerHTML = `
        <div class="text-center mt-3 mb-3">
          <p>No comments yet. Start the conversation!</p>
        </div>
      `;
      return;
    }
    
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment-card';
      commentElement.innerHTML = `
        <div class="comment-header">
          <span class="comment-author">${comment.name}</span>
          <span class="comment-time">${timeAgo(comment.date)}</span>
        </div>
        <p>${comment.content}</p>
      `;
      
      commentsList.appendChild(commentElement);
    });
  }
  
  function likeStory(storyId) {
    const stories = getFromLocalStorage(localStorageKeys.STORIES, []);
    const storyIndex = stories.findIndex(story => story.id === storyId);
    
    if (storyIndex !== -1) {
      stories[storyIndex].likes += 1;
      saveToLocalStorage(localStorageKeys.STORIES, stories);
      displayStories();
    }
  }
  
  // Add sample stories and comments if none exist
  function addSampleContent() {
    const stories = getFromLocalStorage(localStorageKeys.STORIES, []);
    const comments = getFromLocalStorage(localStorageKeys.COMMENTS, []);
    
    if (stories.length === 0) {
      const sampleStories = [
        {
          id: 'sample1',
          name: 'Michael',
          title: 'One Year Smoke-Free and Never Looking Back',
          content: 'After smoking for 15 years, I finally decided enough was enough. The first week was the hardest, but it gets easier with time. Now I can run 5 miles without getting winded, and I\'ve saved enough money to take my family on vacation!',
          smokeFree: 365,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          likes: 42
        },
        {
          id: 'sample2',
          name: 'Sarah',
          title: 'My First Month Journey',
          content: 'I never thought I could make it this far, but here I am - one month without cigarettes! I still get cravings sometimes, especially after meals, but the breathing exercises on this site have been a lifesaver. My sense of smell has returned and food tastes amazing now!',
          smokeFree: 30,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          likes: 18
        }
      ];
      
      saveToLocalStorage(localStorageKeys.STORIES, sampleStories);
    }
    
    if (comments.length === 0) {
      const sampleComments = [
        {
          id: 'comment1',
          name: 'Jennifer',
          content: 'I\'m on day 5 of quitting and this community has been so supportive. Any tips for dealing with the irritability?',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: 'comment2',
          name: 'Robert',
          content: 'Exercise has been key for me. Whenever I get a craving, I do 10 push-ups or go for a quick walk. It really helps redirect that nervous energy!',
          date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
        }
      ];
      
      saveToLocalStorage(localStorageKeys.COMMENTS, sampleComments);
    }
    
    // Display the sample content
    displayStories();
    displayComments();
  }
  
  // Initialize with sample content if needed
  addSampleContent();
});
