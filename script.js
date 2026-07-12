const API_BASE = 'http://localhost:5000/api';

// --- Session Helpers ---
function getLoggedInUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function setLoggedInUser(user) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
}

function updateNavbar() {
  const user = getLoggedInUser();
  const signInBtn = document.querySelector('.nav-actions .btn-primary');
  
  if (signInBtn) {
    // Clean old listeners to prevent stacking
    const newBtn = signInBtn.cloneNode(true);
    signInBtn.parentNode.replaceChild(newBtn, signInBtn);
    
    if (user) {
      newBtn.textContent = 'Sign Out';
      newBtn.setAttribute('href', '#');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setLoggedInUser(null);
        alert("You have signed out.");
        window.location.hash = '#home';
        updateNavbar();
      });
    } else {
      newBtn.textContent = 'Sign In';
      newBtn.setAttribute('href', '#login');
    }
  }
}

// --- Reveal Animation Observer ---
function applyRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}

// --- Router Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const views = document.querySelectorAll(".view");
  
  function navigateTo(hash) {
    if (!hash || hash === "#") hash = "#home";
    let targetId = hash.substring(1) + "-view";
    let blogId = null;
    let username = null;
    
    if (hash.startsWith('#blog-')) {
      blogId = parseInt(hash.replace('#blog-', ''));
      targetId = 'blog-view';
    } else if (hash.startsWith('#user-')) {
      username = hash.replace('#user-', '');
      targetId = 'profile-view';
    }
    
    views.forEach(view => view.classList.remove("active"));
    const targetView = document.getElementById(targetId);
    if (targetView) {
      targetView.classList.add("active");
    } else {
      const homeView = document.getElementById("home-view");
      if (homeView) homeView.classList.add("active");
    }
    
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === hash || (hash === "#home" && (href === "index.html" || href === "#"))) {
        link.classList.add("active");
      }
    });

    // Call loading events for routes
    if (hash === '#home') {
      loadHomeData();
    } else if (hash.startsWith('#blog-')) {
      loadBlogData(blogId);
    } else if (hash === '#search') {
      loadSearchData('');
    } else if (hash === '#profile') {
      const user = getLoggedInUser();
      if (user) {
        loadProfileData(user.username);
      } else {
        window.location.hash = '#login';
      }
    } else if (hash.startsWith('#user-')) {
      loadProfileData(username);
    }
    
    updateNavbar();
    window.scrollTo(0, 0);
  }

  document.body.addEventListener("click", e => {
    const link = e.target.closest("a");
    if (link) {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("#")) {
        e.preventDefault();
        let hash = href.replace(".html", "");
        if (hash === "index") hash = "home";
        hash = "#" + hash;
        window.history.pushState(null, "", hash);
        navigateTo(hash);
      } else if (href && href.startsWith("#")) {
        e.preventDefault();
        window.history.pushState(null, "", href);
        navigateTo(href);
      }
    }
  });

  window.addEventListener("popstate", () => {
    navigateTo(window.location.hash);
  });

  navigateTo(window.location.hash);
  applyRevealObserver();
});

// --- Dynamic Content Renderers ---

function renderBlogCard(blog) {
  return `
    <article class="blog-card" data-reveal>
      <img src="${blog.thumbnailUrl || 'images/blog-1.svg'}" onerror="this.src='images/blog-1.svg'" alt="${blog.title}" />
      <div class="card-body">
        <span class="tag">${blog.category}</span>
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 80)}...</p>
        <div class="card-meta">
          <span>By ${blog.author?.name || 'Unknown'}</span>
          <a href="#blog-${blog.blogId}">Read more</a>
        </div>
      </div>
    </article>
  `;
}

async function loadHomeData() {
  try {
    const res = await fetch(`${API_BASE}/blogs`);
    const blogs = await res.json();
    
    if (blogs && blogs.length > 0) {
      const trendingGrid = document.querySelector('#home-view #trending .card-grid');
      if (trendingGrid) {
        trendingGrid.innerHTML = blogs.slice(0, 3).map(renderBlogCard).join('');
      }
      
      const latestList = document.querySelector('#home-view .article-list');
      if (latestList) {
        latestList.innerHTML = blogs.slice(3, 8).map(blog => `
          <article class="article-row" data-reveal>
            <div>
              <span class="tag">${blog.category}</span>
              <h3>${blog.title}</h3>
              <p>${blog.content.substring(0, 120)}...</p>
            </div>
            <a href="#blog-${blog.blogId}" class="text-link">Read</a>
          </article>
        `).join('');
      }
    }
  } catch (err) {
    console.error("Error loading home blogs:", err);
  } finally {
    applyRevealObserver();
  }
}

let currentBlogId = null;

async function loadBlogData(blogId) {
  currentBlogId = blogId;
  try {
    const res = await fetch(`${API_BASE}/blogs/${blogId}`);
    if (!res.ok) return;
    const blog = await res.json();
    
    const blogView = document.getElementById('blog-view');
    
    const img = blogView.querySelector('.blog-post-card img');
    if (img) img.src = blog.thumbnailUrl || 'images/blog-1.svg';
    
    const tag = blogView.querySelector('.blog-post-card .tag');
    if (tag) tag.textContent = blog.category;
    
    const title = blogView.querySelector('.blog-post-card h1');
    if (title) title.textContent = blog.title;
    
    const meta = blogView.querySelector('.blog-post-card .post-meta');
    if (meta) {
      const date = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      meta.innerHTML = `<span>By <a href="#user-${blog.author?.username}">${blog.author?.name || 'Unknown'}</a></span> <span>${date}</span>`;
    }
    
    const contentDiv = blogView.querySelector('.blog-content');
    if (contentDiv) {
      const paragraphs = blog.content.split('\n').map(p => `<p>${p}</p>`).join('');
      const existingPs = contentDiv.querySelectorAll('p');
      existingPs.forEach(p => p.remove());
      
      const actionRow = contentDiv.querySelector('.action-row');
      if (actionRow) {
        actionRow.insertAdjacentHTML('beforebegin', paragraphs);
      } else {
        contentDiv.innerHTML += paragraphs;
      }
    }
    
    // Likes and Bookmarks setup
    const user = getLoggedInUser();
    const likeBtn = blogView.querySelector('[data-like]');
    if (likeBtn) {
      likeBtn.innerHTML = `<i class="fa-regular fa-heart"></i> ${blog.likesCount}`;
      const likedByMe = user && blog.likes && blog.likes.some(l => l.userId === user.userId);
      likeBtn.className = `icon-btn ${likedByMe ? 'active' : ''}`;
    }
    
    const bookmarkBtn = blogView.querySelector('[data-bookmark]');
    if (bookmarkBtn) {
      const bookmarkedByMe = user && blog.bookmarks && blog.bookmarks.some(b => b.userId === user.userId);
      bookmarkBtn.className = `icon-btn ${bookmarkedByMe ? 'active' : ''}`;
    }

    // Render Comments
    const commentList = blogView.querySelector('.comment-list');
    if (commentList) {
      commentList.innerHTML = blog.comments.map(c => `
        <div class="comment-item">
          <strong>${c.user?.name || 'Anonymous'}</strong>
          <p>${c.content}</p>
        </div>
      `).join('');
    }
    
  } catch (err) {
    console.error("Error loading blog details:", err);
  }
}

async function loadSearchData(query) {
  try {
    const res = await fetch(`${API_BASE}/blogs?query=${encodeURIComponent(query)}`);
    const blogs = await res.json();
    
    const searchGrid = document.querySelector('#search-view .search-results .card-grid');
    if (searchGrid) {
      if (blogs && blogs.length > 0) {
        searchGrid.innerHTML = blogs.map(renderBlogCard).join('');
      } else if (!query) {
        // If there's no query, leave the static placeholder results
      } else {
        searchGrid.innerHTML = '<p class="no-results" style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 2rem 0;">No articles found matching your search.</p>';
      }
    }
  } catch (err) {
    console.error("Error loading search blogs:", err);
  } finally {
    applyRevealObserver();
  }
}

async function loadProfileData(username) {
  try {
    const res = await fetch(`${API_BASE}/users/${username}`);
    if (!res.ok) return;
    const profile = await res.json();
    
    const profileView = document.getElementById('profile-view');
    
    const nameEl = profileView.querySelector('.profile-card h1');
    if (nameEl) nameEl.textContent = profile.name;
    
    const handleEl = profileView.querySelector('.profile-card p');
    if (handleEl) handleEl.textContent = `@${profile.username} • ${profile.bio || 'Product storyteller'}`;
    
    const avatarEl = profileView.querySelector('.profile-card img');
    if (avatarEl) avatarEl.src = profile.avatarUrl || 'images/profile-placeholder.svg';
    
    const statsDivs = profileView.querySelectorAll('.profile-stats strong');
    if (statsDivs.length >= 3) {
      statsDivs[0].textContent = profile.followersCount;
      statsDivs[1].textContent = profile.followingCount;
      statsDivs[2].textContent = profile.blogsCount;
    }
    
    const profileGrid = profileView.querySelector('.card-grid');
    if (profileGrid) {
      profileGrid.innerHTML = profile.blogs.map(blog => `
        <article class="blog-card">
          <img src="${blog.thumbnailUrl || 'images/blog-1.svg'}" onerror="this.src='images/blog-1.svg'" alt="${blog.title}" />
          <div class="card-body">
            <h3>${blog.title}</h3>
            <p>${blog.content.substring(0, 80)}...</p>
            <a href="#blog-${blog.blogId}">Read more</a>
          </div>
        </article>
      `).join('');
    }
  } catch (err) {
    console.error("Error loading profile data:", err);
  }
}

// --- Interaction Submissions ---

document.addEventListener('DOMContentLoaded', () => {
  // 1. Comments submit
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = getLoggedInUser();
      if (!user) {
        alert("Please sign in to comment.");
        window.location.hash = '#login';
        return;
      }
      const textarea = commentForm.querySelector('textarea');
      const content = textarea.value.trim();
      if (!content || !currentBlogId) return;
      
      try {
        const res = await fetch(`${API_BASE}/blogs/${currentBlogId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId, content })
        });
        if (res.ok) {
          const comment = await res.json();
          const commentList = document.querySelector('.comment-list');
          if (commentList) {
            const item = document.createElement('div');
            item.className = 'comment-item';
            item.innerHTML = `<strong>${comment.user?.name || 'You'}</strong><p>${comment.content}</p>`;
            commentList.prepend(item);
          }
          textarea.value = '';
        }
      } catch (err) {
        console.error("Error posting comment:", err);
      }
    });
  }

  // 2. Likes toggle
  document.querySelector('[data-like]')?.addEventListener('click', async () => {
    const user = getLoggedInUser();
    if (!user) {
      alert("Please sign in to like blogs.");
      window.location.hash = '#login';
      return;
    }
    if (!currentBlogId) return;
    try {
      await fetch(`${API_BASE}/blogs/${currentBlogId}/like?userId=${user.userId}`, { method: 'POST' });
      loadBlogData(currentBlogId);
    } catch (err) {
      console.error(err);
    }
  });

  // 3. Bookmarks toggle
  document.querySelector('[data-bookmark]')?.addEventListener('click', async () => {
    const user = getLoggedInUser();
    if (!user) {
      alert("Please sign in to save blogs.");
      window.location.hash = '#login';
      return;
    }
    if (!currentBlogId) return;
    try {
      await fetch(`${API_BASE}/blogs/${currentBlogId}/bookmark?userId=${user.userId}`, { method: 'POST' });
      loadBlogData(currentBlogId);
    } catch (err) {
      console.error(err);
    }
  });

  // 4. Search input event
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      loadSearchData(e.target.value);
    });
  }

  // 5. Login form submit
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[name="password"]').value;
      
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const user = await res.json();
          setLoggedInUser(user);
          alert(`Welcome back, ${user.name}!`);
          window.location.hash = '#home';
        } else if (res.status === 401) {
          alert("Invalid email or password.");
        } else {
          throw new Error("Server error");
        }
      } catch (err) {
        console.error(err);
        // Mock fallback if offline or db error
        const mockUser = {
          userId: 1,
          name: "Maya Chen",
          username: "mayachen",
          email: email,
          bio: "Tech lead and workflows designer",
          avatarUrl: "images/profile-placeholder.svg"
        };
        setLoggedInUser(mockUser);
        alert(`Notice: Connecting to mock session for testing. Welcome back, ${mockUser.name}!`);
        window.location.hash = '#home';
      }
    });
  }

  // 6. Register form submit
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = registerForm.querySelector('input[name="name"]').value;
      const username = registerForm.querySelector('input[name="username"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;
      const password = registerForm.querySelector('input[name="password"]').value;
      const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]').value;
      
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, username, email, password })
        });
        if (res.ok) {
          alert("Registration successful! Please sign in.");
          window.location.hash = '#login';
        } else {
          const data = await res.json();
          alert(data.message || "Registration failed.");
        }
      } catch (err) {
        console.error(err);
        // Mock fallback if offline or db error
        const mockUser = {
          userId: Math.floor(Math.random() * 1000) + 10,
          name: name,
          username: username,
          email: email,
          bio: "New writer on BlogSphere",
          avatarUrl: "images/profile-placeholder.svg"
        };
        setLoggedInUser(mockUser);
        alert(`Notice: Connecting to mock session for testing. Registered and logged in as ${mockUser.name}!`);
        window.location.hash = '#home';
      }
    });
  }

  // 7. Compose form submit
  const composeForm = document.querySelector('.compose-form');
  if (composeForm) {
    composeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = getLoggedInUser();
      if (!user) {
        alert("Please sign in to publish articles.");
        window.location.hash = '#login';
        return;
      }
      
      const title = composeForm.querySelector('input[placeholder="A compelling headline"]').value;
      const category = composeForm.querySelector('select').value;
      const tags = composeForm.querySelector('input[placeholder="ai, startup, productivity"]').value;
      const content = composeForm.querySelector('textarea').value;
      
      try {
        const res = await fetch(`${API_BASE}/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorId: user.userId,
            title,
            category,
            tags,
            content,
            thumbnailUrl: 'images/blog-1.svg'
          })
        });
        if (res.ok) {
          const blog = await res.json();
          alert("Blog published successfully!");
          composeForm.reset();
          window.location.hash = `#blog-${blog.blogId}`;
        } else {
          alert("Failed to publish blog.");
        }
      } catch (err) {
        console.error(err);
        alert("Error publishing blog.");
      }
    });
  }

  // 8. Navbar Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // 9. Dark Mode Toggle
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('blog-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('blog-theme', isDark ? 'dark' : 'light');
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    });
  }
});
