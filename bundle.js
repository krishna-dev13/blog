// 🗄️ In-Memory Data Store (Simulated database structure)
let blogs = [
  {
    id: 1,
    title: "Understanding CSS Container Queries",
    category: "Technology",
    author: "Sarah Jenkins",
    authorHandle: "@sarah_codes",
    date: "July 12, 2026",
    readingTime: "4 min read",
    tags: ["CSS", "Frontend", "WebDesign"],
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    content: "Container queries allow us to style elements relative to the size of their containing parent element rather than the viewport. This changes how responsive design works fundamentally...",
    likes: 42,
    hasLiked: false
  },
  {
    id: 2,
    title: "Mastering Prompt Engineering for Developers",
    category: "AI & Coding",
    author: "John Doe",
    authorHandle: "@johndoe",
    date: "July 14, 2026",
    readingTime: "7 min read",
    tags: ["AI", "LLM", "Prompting"],
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    content: "Large Language Models are only as good as the instructions you feed them. Effective prompt design, chain-of-thought methods, and targeted system variables can yield incredible programmatic results...",
    likes: 118,
    hasLiked: false
  }
];

let selectedImageBase64 = null;

// Helper to check authentication
const isUserLoggedIn = () => localStorage.getItem('blog-logged-in') === 'true';

// 🚦 Client-side Router Logic
function navigateTo(pageId) {
  // If user is trying to access interactive pages while logged out, force login
  if (!isUserLoggedIn() && (pageId === 'write' || pageId === 'profile')) {
    alert("Please log in to access this feature.");
    showOverlay(true);
    return;
  }

  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.add('hidden');
  });

  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (pageId === 'home') {
    renderBlogs();
  } else if (pageId === 'profile') {
    renderProfileBlogs();
  }
}

// Global helper for Overlay Visibility
function showOverlay(show) {
  const overlay = document.getElementById('loginOverlay');
  if (!overlay) return;
  overlay.style.display = show ? 'flex' : 'none';
  document.body.style.overflow = show ? 'hidden' : '';
}

// Single Consolidated Dom Initialization
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Auth & Redirect Guards
  const path = window.location.pathname;
  const loggedIn = isUserLoggedIn();

  // If we are on login.html but already logged in -> jump to index
  if (path.endsWith('login.html') || document.body.classList.contains('login-page')) {
    if (loggedIn) {
      window.location.href = 'index.html';
      return;
    }
  }

  // 2. Setup Intersection Observer (Scroll reveals)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));

  // 3. Navigation Bar (Mobile Toggle)
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // 4. Dark/Light Theme Customizer
  const themeToggleBtn = document.getElementById('theme-toggle') || document.getElementById('themeToggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      document.body.classList.toggle('dark', isDark);
      
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      localStorage.setItem('blog-theme', isDark ? 'dark' : 'light');

      if (themeIcon) {
        themeIcon.className = isDark ? "fa-solid fa-sun text-lg" : "fa-solid fa-moon text-lg";
      }
    });
  }

  // Restore Theme
  const savedTheme = localStorage.getItem('theme') || localStorage.getItem('blog-theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    if (themeIcon) themeIcon.className = "fa-solid fa-sun text-lg";
  }

  // 5. Search Filtering
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      const cards = Array.from(document.querySelectorAll('.blog-card'));
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }

  // 6. Standalone Page Form Handling (login.html / register.html)
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      const loginError = document.getElementById('loginError');

      if (loginError) { loginError.style.display = 'none'; }

      if (!validateEmail(email)) {
        if (loginError) { loginError.textContent = 'Please enter a valid email address.'; loginError.style.display = 'block'; }
        return;
      }
      if (!password || password.length < 3) {
        if (loginError) { loginError.textContent = 'Please enter your password.'; loginError.style.display = 'block'; }
        return;
      }

      localStorage.setItem('blog-logged-in', 'true');
      window.location.href = 'index.html'; // Go to platform dashboard
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = registerForm.querySelector('input[type="email"]').value;
      const password = registerForm.querySelector('input[name="password"]').value;
      const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]').value;

      if (!validateEmail(email)) { alert('Please enter a valid email address.'); return; }
      if (password.length < 8) { alert('Password must be at least 8 characters long.'); return; }
      if (password !== confirmPassword) { alert('Passwords do not match.'); return; }

      alert('Registration successful! You can now log in.');
      window.location.href = 'login.html';
    });
  }

  // 7. Overlay Handlers (For SPA Index View restriction)
  const overlayForm = document.getElementById('overlayLoginForm');
  const overlayClose = document.getElementById('overlayClose');
  const overlayRegisterLink = document.getElementById('overlayRegisterLink');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!loggedIn && path.includes('index.html')) {
    showOverlay(true);
  }
  if (logoutBtn) logoutBtn.classList.toggle('hidden', !loggedIn);

  if (overlayForm) {
    overlayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = overlayForm.querySelector('input[type="email"]').value;
      const password = overlayForm.querySelector('input[type="password"]').value;
      if (!validateEmail(email) || !password || password.length < 3) {
        const err = document.getElementById('overlayError');
        if (err) { err.textContent = "Invalid Credentials"; err.style.display = "block"; }
        return;
      }
      localStorage.setItem('blog-logged-in', 'true');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
      showOverlay(false);
      navigateTo('home');
    });
  }

  if (overlayClose) {
    overlayClose.addEventListener('click', () => showOverlay(false));
  }

  if (overlayRegisterLink) {
    overlayRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Redirect out of index.html to your actual registration flow
      window.location.href = 'login.html?tab=register'; 
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('blog-logged-in');
      showOverlay(true);
      logoutBtn.classList.add('hidden');
    });
  }

  // 8. Dynamic File Upload with Watermarking
  const coverImageInput = document.getElementById('cover-image-input');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');

  if (coverImageInput) {
    coverImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          alert("Invalid format! Use JPG, PNG or WebP.");
          return;
        }
        if (file.size > 3 * 1024 * 1024) {
          alert("File size exceeds 3MB.");
          return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.src = event.target.result;
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            ctx.font = `${Math.max(20, Math.floor(canvas.width / 40))}px Courier New`;
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
            ctx.fillText("© BLOGSPHERE (SARAH JENKINS)", canvas.width - 400, canvas.height - 30);
            
            selectedImageBase64 = canvas.toDataURL('image/jpeg');
            if (imagePreview) imagePreview.src = selectedImageBase64;
            if (imagePreviewContainer) imagePreviewContainer.classList.remove('hidden');
          };
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 9. Blog Posting Form Submit
  const writeBlogForm = document.getElementById('write-blog-form');
  if (writeBlogForm) {
    writeBlogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isUserLoggedIn()) { alert("Please log in first."); return; }

      const title = document.getElementById('blog-title').value;
      const category = document.getElementById('blog-category').value;
      const tagsText = document.getElementById('blog-tags').value;
      const content = document.getElementById('blog-content').value;
      const copyrightConfirmed = document.getElementById('copyright-agreement').checked;

      if (!copyrightConfirmed) {
        alert("Blocked: Confirm image copyright ownership.");
        return;
      }

      const tagsArray = tagsText.split(',').map(tag => tag.trim()).filter(Boolean);
      const newBlog = {
        id: Date.now(),
        title,
        category,
        author: "Sarah Jenkins",
        date: "Just Now",
        readingTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
        tags: tagsArray,
        coverImage: selectedImageBase64 || "https://images.unsplash.com/photo-1546074177-ffedd79d494d?auto=format&fit=crop&w=600&q=80",
        content,
        likes: 0,
        hasLiked: false
      };

      blogs.unshift(newBlog);
      writeBlogForm.reset();
      if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden');
      selectedImageBase64 = null;
      navigateTo('home');
    });
  }

  // Run Startup Router Target
  navigateTo('home');
});