CREATE DATABASE IF NOT EXISTS blogsphere;
USE blogsphere;

-- 1. Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- To store hashed password
    bio VARCHAR(255),
    avatar_url VARCHAR(255) DEFAULT 'images/profile-placeholder.svg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Blogs Table
CREATE TABLE Blogs (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(255) DEFAULT 'images/blog-1.svg',
    category VARCHAR(50) NOT NULL,
    tags VARCHAR(255), -- Comma-separated list (e.g., "ai, productivity")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. Comments Table
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_id) REFERENCES Blogs(blog_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. Likes Table (Tracks likes on blogs by users)
CREATE TABLE Likes (
    user_id INT NOT NULL,
    blog_id INT NOT NULL,
    PRIMARY KEY (user_id, blog_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES Blogs(blog_id) ON DELETE CASCADE
);

-- 5. Bookmarks Table (Tracks saved/bookmarked blogs)
CREATE TABLE Bookmarks (
    user_id INT NOT NULL,
    blog_id INT NOT NULL,
    PRIMARY KEY (user_id, blog_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES Blogs(blog_id) ON DELETE CASCADE
);

-- 6. Follows Table (Tracks followers and following relationships)
CREATE TABLE Follows (
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


-- ========================================================
-- Seed Data (Matching the current UI static content)
-- ========================================================

-- Insert Users
INSERT INTO Users (name, username, email, password, bio, avatar_url) VALUES
('Maya Chen', 'mayachen', 'maya@example.com', 'hashed_pass_123', 'Tech lead and workflows designer', 'images/profile-placeholder.svg'),
('Daniel Ross', 'danielross', 'daniel@example.com', 'hashed_pass_123', 'Remote work advocate', 'images/profile-placeholder.svg'),
('Sara Kim', 'sarakim', 'sara@example.com', 'hashed_pass_123', 'Minimalist travel writer', 'images/profile-placeholder.svg'),
('Jules Rivera', 'julesrivera', 'jules@example.com', 'hashed_pass_123', 'Followed creator on lifestyle and productivity', 'images/profile-placeholder.svg'),
('Amira Patel', 'amirapatel', 'amira@example.com', 'hashed_pass_123', 'Writer and educator', 'images/profile-placeholder.svg'),
('Amelia Brooks', 'ameliawrites', 'amelia@example.com', 'hashed_pass_123', 'Product storyteller', 'images/profile-placeholder.svg'),
('Nora', 'nora', 'nora@example.com', 'hashed_pass_123', 'Avid reader', 'images/profile-placeholder.svg'),
('Leo', 'leo', 'leo@example.com', 'hashed_pass_123', 'Tech enthusiast', 'images/profile-placeholder.svg');

-- Insert Blogs
INSERT INTO Blogs (author_id, title, content, thumbnail_url, category, tags) VALUES
(1, 'How AI is reshaping modern product workflows.', 'Modern teams are moving faster, but only when tools reduce friction rather than add it. Across product design, operations, and customer support, AI is changing the rhythm of work. The most effective implementations begin with small automation wins: summarizing meetings, drafting content, surfacing insights, and classifying requests. These improvements free people to focus on judgment, empathy, and creativity. The next wave of growth will come from organizations that learn to combine human insight with automation responsibly, with clear guardrails and a strong sense of context.', 'images/blog-1.svg', 'Technology', 'ai, workflow, productivity'),
(2, 'Building a calm remote work ritual that actually lasts.', 'Small habits can create powerful weekly momentum. When working from home, separating workspace from living space is critical. Building daily transitions—like a morning walk or an end-of-day shutdown ritual—helps reset the mind.', 'images/blog-2.svg', 'Lifestyle', 'remote, productivity, wellness'),
(3, 'Designing a minimalist travel itinerary for city breaks.', 'Less clutter, more memorable experiences, and fewer headaches. Minimalist travel is not just about what you pack, it is about what you plan. Prioritize one anchor event per day and let the rest unfold naturally.', 'images/blog-3.svg', 'Travel', 'travel, minimalist'),
(6, 'Designing content systems that scale.', 'How strategic structure creates room for creativity. Scalable content design starts with componentized layouts and modular styling.', 'images/blog-1.svg', 'Programming', 'systems, scale'),
(6, 'Small rituals that make writing easier.', 'Habit design can be surprisingly powerful. Dedicating a specific time and environment triggers creative flow effortlessly.', 'images/blog-2.svg', 'Lifestyle', 'writing, habits');

-- Insert Comments
INSERT INTO Comments (blog_id, user_id, content) VALUES
(1, 7, 'Really enjoyed the practical angle. This feels grounded and useful.'),
(1, 8, 'Love the emphasis on human judgment alongside automation.');

-- Insert Likes
INSERT INTO Likes (user_id, blog_id) VALUES
(7, 1),
(8, 1);

-- Insert Bookmarks
INSERT INTO Bookmarks (user_id, blog_id) VALUES
(6, 1);

-- Insert Follows
INSERT INTO Follows (follower_id, following_id) VALUES
(7, 6), -- Nora follows Amelia Brooks
(8, 6); -- Leo follows Amelia Brooks
