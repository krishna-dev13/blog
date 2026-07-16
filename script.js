// Merged JS bundle: app.js + login.js + write.js + original script.js

/* ---------------- app.js (site behaviors) ---------------- */
// Bundled JavaScript: combined from app.js, navbar.js, darkmode.js, blog.js, search.js, validation.js

document.addEventListener('DOMContentLoaded', () => {
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

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = newsletterForm.querySelector('button');
      button.textContent = 'Subscribed';
      button.disabled = true;
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('dark-mode-toggle');
  const savedTheme = localStorage.getItem('blog-theme');
  const root = document.documentElement;
  const moonIcon = themeToggle?.querySelector('.fa-moon');
  const sunIcon = themeToggle?.querySelector('.fa-sun');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  if (moonIcon && sunIcon) {
    const isDark = root.classList.contains('dark');
    moonIcon.classList.toggle('hidden', isDark);
    sunIcon.classList.toggle('hidden', !isDark);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      const isDark = root.classList.contains('dark');
      localStorage.setItem('blog-theme', isDark ? 'dark' : 'light');
      if (moonIcon && sunIcon) {
        moonIcon.classList.toggle('hidden', isDark);
        sunIcon.classList.toggle('hidden', !isDark);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.getElementById('commentForm');
  const commentList = document.querySelector('.comment-list');

  if (commentForm && commentList) {
    commentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const textarea = commentForm.querySelector('textarea');
      const value = textarea.value.trim();

      if (!value) return;

      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `<strong>You</strong><p>${value}</p>`;
      commentList.prepend(item);
      textarea.value = '';
    });
  }

  document.querySelectorAll('[data-like], [data-bookmark]').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const cards = Array.from(document.querySelectorAll('.blog-card'));

  if (input) {
    input.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      const loginError = document.getElementById('loginError');
      if (loginError) { loginError.style.display = 'none'; loginError.textContent = ''; }
      if (!validateEmail(email)) {
        if (loginError) { loginError.textContent = 'Please enter a valid email address.'; loginError.style.display = 'block'; }
        return;
      }
      if (!password || password.length < 3) {
        if (loginError) { loginError.textContent = 'Please enter your password.'; loginError.style.display = 'block'; }
        return;
      }
      // mock authentication success: persist and redirect to the dashboard
      localStorage.setItem('blog-logged-in', 'true');
      window.location.href = 'home.html';
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const password = registerForm.querySelector('input[name="password"]').value;
      const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;

      if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (password.length < 8) {
        alert('Password should be at least 8 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      alert('Registration submitted successfully.');
    });
  }

  window.togglePasswordVisibilityLogin = function () {
    const passwordInput = document.getElementById('loginPassword');
    const eyeIcon = document.getElementById('loginEyeIcon');
    if (!passwordInput || !eyeIcon) return;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  };

  if (window.location.pathname.endsWith('login.html') || document.body.classList.contains('login-page')) {
    if (localStorage.getItem('blog-logged-in') === 'true') {
      window.location.href = 'home.html';
    }
  }
});

// Overlay login handling: show login overlay first if not logged in
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('loginOverlay');
  const overlayForm = document.getElementById('overlayLoginForm');
  const overlayClose = document.getElementById('overlayClose');
  const overlayRegisterLink = document.getElementById('overlayRegisterLink');
  const overlayError = document.getElementById('overlayError');
  const logoutBtn = document.getElementById('logoutBtn');

  const showOverlay = (show) => {
    if (!overlay) return;
    const panel = overlay.querySelector('.login-panel');
    if (show) {
      overlay.style.display = 'flex';
      // allow layout then trigger entrance animation
      setTimeout(() => panel?.classList.add('loaded'), 30);
      document.body.style.overflow = 'hidden';
    } else {
      // remove visible class to trigger exit animation then hide
      panel?.classList.remove('loaded');
      document.body.style.overflow = '';
      setTimeout(() => { overlay.style.display = 'none'; }, 250);
    }
  };

  const loggedIn = localStorage.getItem('blog-logged-in') === 'true';
  if (!loggedIn) showOverlay(true);
  if (logoutBtn) logoutBtn.classList.toggle('hidden', !loggedIn);

  if (overlayForm) {
    overlayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = overlayForm.querySelector('input[type="email"]').value;
      const password = overlayForm.querySelector('input[type="password"]').value;
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (overlayError) { overlayError.style.display = 'none'; overlayError.textContent = ''; }
      if (!validEmail) { if (overlayError) { overlayError.textContent = 'Please enter a valid email.'; overlayError.style.display = 'block'; } return; }
      if (!password || password.length < 3) { if (overlayError) { overlayError.textContent = 'Please enter your password.'; overlayError.style.display = 'block'; } return; }
      // Mark as logged in and close overlay
      localStorage.setItem('blog-logged-in', 'true');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
      showOverlay(false);
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }

  if (overlayClose) {
    overlayClose.addEventListener('click', () => { if (overlayError){ overlayError.style.display='none'; overlayError.textContent=''; } showOverlay(false); });
  }

  if (overlayRegisterLink) {
    overlayRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      showOverlay(false);
      const reg = document.getElementById('writeSection');
      if (reg) reg.scrollIntoView({behavior:'smooth'});
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('blog-logged-in');
      if (overlayError){ overlayError.style.display='none'; overlayError.textContent=''; }
      showOverlay(true);
      logoutBtn.classList.add('hidden');
    });
  }
});

/* ---------------- login.js (login page behaviors) ---------------- */
// Login page behavior for BlogSphere
const _darkModeToggle_login = document.getElementById('dark-mode-toggle');
const _loginForm_login = document.getElementById('loginForm');
const alertBox = document.getElementById('errorAlert');

if (_darkModeToggle_login) {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  _darkModeToggle_login.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('passwordEyeIcon');
  if (!passwordInput || !eyeIcon) return;
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }
}

window.togglePasswordVisibility = togglePasswordVisibility;

if (_loginForm_login) {
  _loginForm_login.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!alertBox) return;

    if (!validEmail || password.length < 3) {
      alertBox.classList.remove('hidden');
      alertBox.classList.add('flex');
      document.getElementById('errorMessage').textContent = 'Enter a valid email and password to continue.';
      return;
    }

    alertBox.classList.add('hidden');
    alertBox.classList.remove('flex');
    localStorage.setItem('blog-logged-in', 'true');
    window.location.href = 'home.html';
  });
}

/* ---------------- write.js (writer behaviors) ---------------- */

const mediaUploadInput = document.getElementById('mediaUpload');
const previewGrid = document.getElementById('previewGrid');
const blogForm = document.getElementById('blogPostForm');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const successModal = document.getElementById('successModal');

let uploadedFiles = [];

function createPreviewCard(file) {
  const fileUrl = URL.createObjectURL(file);
  const card = document.createElement('div');
  card.className = 'relative group aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950';

  let mediaElement = '';
  if (file.type.startsWith('image/')) {
    mediaElement = `<img src="${fileUrl}" class="w-full h-full object-cover" alt="preview">`;
  } else if (file.type.startsWith('video/')) {
    mediaElement = `
      <video class="w-full h-full object-cover" muted loop autoplay>
        <source src="${fileUrl}" type="${file.type}">
      </video>
      <div class="absolute inset-0 flex items-center justify-center bg-black/30">
        <i class="fa-solid fa-circle-play text-white text-xl"></i>
      </div>
    `;
  }

  card.innerHTML = `
    ${mediaElement}
    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <button type="button" class="delete-btn p-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs transition-colors shadow">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
    <span class="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[8px] text-white/90 px-1.5 py-0.5 rounded uppercase max-w-[80%] truncate">
      ${file.name}
    </span>
  `;

  card.querySelector('.delete-btn')?.addEventListener('click', () => {
    uploadedFiles = uploadedFiles.filter((f) => f !== file);
    card.remove();
    if (!uploadedFiles.length) {
      previewGrid?.classList.add('hidden');
      previewGrid?.classList.remove('grid');
    }
  });

  return card;
}

if (mediaUploadInput) {
  mediaUploadInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (previewGrid) {
      previewGrid.classList.remove('hidden');
      previewGrid.classList.add('grid');
    }

    files.forEach((file) => {
      uploadedFiles.push(file);
      const card = createPreviewCard(file);
      previewGrid?.appendChild(card);
    });
  });
}

if (blogForm) {
  blogForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('blogTitle')?.value || 'Untitled Story';
    const content = document.getElementById('blogContent')?.value || '';
    const category = document.getElementById('category')?.value || 'Uncategorized';
    const tags = document.getElementById('tagsInput')?.value || '';

    console.log('Publishing Blog details:', {
      title,
      content,
      category,
      tags,
      totalAssets: uploadedFiles.length,
    });

    if (successModal) {
      document.getElementById('modalHeading').innerText = 'Blog Published Successfully!';
      document.getElementById('modalText').innerText = 'Your story and media metadata hashes are locked under secure asset parameters.';
      successModal.classList.remove('hidden');
    }
  });
}

if (saveDraftBtn) {
  saveDraftBtn.addEventListener('click', () => {
    const title = document.getElementById('blogTitle')?.value || 'Untitled Draft';
    console.log('Draft Saved:', { title });
    if (successModal) {
      document.getElementById('modalHeading').innerText = 'Draft Saved Successfully!';
      document.getElementById('modalText').innerText = `"${title}" has been safely put into your system draft archive.`;
      successModal.classList.remove('hidden');
    }
  });
}

window.closeSuccessModal = function () {
  successModal?.classList.add('hidden');
};

/* ---------------- original script.js (blog app) ---------------- */
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

// Active State Trackers
let selectedImageBase64 = null;

// 🚦 Client-side Router Logic
function navigateTo(pageId) {
  // Hide all view panels
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.add('hidden');
  });

  // Display the active view panel
  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Populate dynamic feeds on views
  if (pageId === 'home') {
    renderBlogs();
  } else if (pageId === 'profile') {
    renderProfileBlogs();
  }
}

// 🌓 Dark / Light Theme Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggleBtn && themeIcon) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    if (isDark) {
      themeIcon.className = "fa-solid fa-sun text-lg";
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.className = "fa-solid fa-moon text-lg";
      localStorage.setItem('theme', 'light');
    }
  });
}

// Initialize Theme based on saved states
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  if (themeIcon) {
    themeIcon.className = "fa-solid fa-sun text-lg";
  }
}

// 🖼️ Client-Side Image Handling & Watermark Simulation
const coverImageInput = document.getElementById('cover-image-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');

if (coverImageInput) {
  coverImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Invalid image format! Please use JPG, PNG or WebP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("File size exceeds 3MB. Please upload a smaller image.");
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
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;

        const watermarkText = "© BLOGSPHERE (SARAH JENKINS)";
        const xPos = canvas.width - ctx.measureText(watermarkText).width - 30;
        const yPos = canvas.height - 30;

        ctx.fillText(watermarkText, xPos, yPos);

        selectedImageBase64 = canvas.toDataURL('image/jpeg');
        if (imagePreview) {
          imagePreview.src = selectedImageBase64;
        }
        if (imagePreviewContainer) {
          imagePreviewContainer.classList.remove('hidden');
        }
      };
    };
    reader.readAsDataURL(file);
  });
}

// ✍️ Blog Form Submit (Simulates dynamic server storage additions)
const writeBlogForm = document.getElementById('write-blog-form');
if (writeBlogForm) {
  writeBlogForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('blog-title')?.value || 'Untitled Story';
    const category = document.getElementById('blog-category')?.value || 'Uncategorized';
    const tagsText = document.getElementById('blog-tags')?.value || '';
    const content = document.getElementById('blog-content')?.value || '';
    const copyrightConfirmed = document.getElementById('copyright-agreement')?.checked || false;

    if (!copyrightConfirmed) {
      alert("Blocked: You must confirm the image copyright ownership checkbox to upload your cover image.");
      return;
    }

    const tagsArray = tagsText.split(',').map(tag => tag.trim()).filter(Boolean);
    const defaultFallbackImage = "https://images.unsplash.com/photo-1546074177-ffedd79d494d?auto=format&fit=crop&w=600&q=80";

    const newBlog = {
      id: Date.now(),
      title,
      category,
      author: "Sarah Jenkins",
      authorHandle: "@sarah_codes",
      date: "Just Now",
      readingTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
      tags: tagsArray,
      coverImage: selectedImageBase64 || defaultFallbackImage,
      content,
      likes: 0,
      hasLiked: false
    };

    blogs.unshift(newBlog);
    writeBlogForm.reset();
    if (imagePreviewContainer) {
      imagePreviewContainer.classList.add('hidden');
    }
    selectedImageBase64 = null;

    navigateTo('home');
  });
}

// 📰 Dynamic Blog Feed Render
function renderBlogs() {
  const grid = document.getElementById('blog-grid');
  grid.innerHTML = '';

  blogs.forEach(blog => {
    const card = document.createElement('div');
    card.className = "bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all";
    
    // Apply simulated absolute cover protection watermark on layout render
    card.innerHTML = `
      <div class="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900">
        <img src="${blog.coverImage}" alt="${blog.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <span class="watermark-overlay">© ${blog.author.toUpperCase()}</span>
        <span class="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/95 text-[10px] font-bold px-2.5 py-1 rounded-full text-brand-600 shadow-sm uppercase">${blog.category}</span>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <span>${blog.date}</span>
            <span>•</span>
            <span>${blog.readingTime}</span>
          </div>
          <h3 onclick="viewFullBlog(${blog.id})" class="text-lg font-bold hover:text-brand-600 transition-colors cursor-pointer leading-snug">${blog.title}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">${blog.content}</p>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-900">
          <span class="text-xs font-semibold">${blog.author}</span>
          <button onclick="toggleLike(${blog.id}, event)" class="flex items-center gap-1.5 text-xs font-semibold ${blog.hasLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'} transition-all">
            <i class="fa-${blog.hasLiked ? 'solid' : 'regular'} fa-heart"></i> ${blog.likes}
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// 👤 Profile Specific Stories Filter
function renderProfileBlogs() {
  const profileGrid = document.getElementById('profile-blogs-grid');
  profileGrid.innerHTML = '';
  const myBlogs = blogs.filter(b => b.author === "Sarah Jenkins");

  myBlogs.forEach(blog => {
    const row = document.createElement('div');
    row.className = "flex gap-4 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 items-center justify-between";
    row.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${blog.coverImage}" class="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-800">
        <div>
          <h4 onclick="viewFullBlog(${blog.id})" class="text-sm font-bold hover:text-brand-600 cursor-pointer line-clamp-1">${blog.title}</h4>
          <p class="text-xs text-slate-400">${blog.category} • ${blog.likes} Likes</p>
        </div>
      </div>
      <button onclick="reportInfringement(event)" class="text-xs text-slate-400 hover:text-red-500"><i class="fa-solid fa-triangle-exclamation"></i> Check DMCA</button>
    `;
    profileGrid.appendChild(row);
  });
}

// 📖 Display Full-length Article
function viewFullBlog(id) {
  const blog = blogs.find(b => b.id === id);
  if (!blog) return;

  const contentBox = document.getElementById('full-blog-content');
  
  contentBox.innerHTML = `
    <div class="space-y-6">
      <div class="space-y-3">
        <span class="px-3 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-full uppercase">${blog.category}</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${blog.title}</h1>
        <div class="flex items-center gap-3 text-sm text-slate-500 pt-1">
          <div class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
            ${blog.author.charAt(0)}
          </div>
          <div>
            <p class="font-semibold text-slate-800 dark:text-slate-200">${blog.author}</p>
            <p class="text-xs">${blog.date} • ${blog.readingTime}</p>
          </div>
        </div>
      </div>

      <div class="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <img src="${blog.coverImage}" class="w-full max-h-96 object-cover select-none pointer-events-none">
        <span class="watermark-overlay text-sm">© ${blog.author.toUpperCase()} | Protection System Live</span>
      </div>

      <div class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-base space-y-4">
        ${blog.content.replace(/\n/g, '<br>')}
      </div>

      <div class="flex items-center justify-between py-4 border-t border-b border-slate-200 dark:border-slate-800">
        <button onclick="toggleLike(${blog.id}, event); viewFullBlog(${blog.id});" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-semibold text-sm ${blog.hasLiked ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}">
          <i class="fa-${blog.hasLiked ? 'solid' : 'regular'} fa-heart text-base"></i> ${blog.likes}
        </button>
        <button onclick="reportImageDialog('${blog.author}')" class="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1.5">
          <i class="fa-solid fa-flag"></i> Report Copyright Infringement
        </button>
      </div>
    </div>
  `;
  navigateTo('read-blog');
}

// ❤️ Thread-safe Simple Like Interaction (Limits user to single like)
function toggleLike(id, event) {
  event.stopPropagation(); // Avoid triggering route changes on background nodes
  const blog = blogs.find(b => b.id === id);
  if (blog) {
    if (blog.hasLiked) {
      blog.likes--;
      blog.hasLiked = false;
    } else {
      blog.likes++;
      blog.hasLiked = true;
    }
    renderBlogs();
  }
}

// 🚩 Flag copyright violation callback
function reportImageDialog(authorName) {
  alert(`Report Incident logged.\nOur administrative moderation dashboard has queued this image for audit against copyright owner parameters.`);
}

// Start in the Home directory
navigateTo('home');
