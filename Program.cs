using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Serialization;
using BlogSphereBackend.Data;
using BlogSphereBackend.Models;
using BlogSphereBackend.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Lock port to 5000
builder.WebHost.UseUrls("http://localhost:5000");

// Add Services
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<BlogSphereDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30))));

// Add CORS to allow frontend index.html to communicate with our API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure JSON serialization to ignore circular references and format nicely
builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.WriteIndented = true;
});

var app = builder.Build();

app.UseCors("AllowAll");

// Initialize and Seed Database automatically if empty
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<BlogSphereDbContext>();
        db.Database.EnsureCreated();

        if (!db.Users.Any())
        {
            var users = new List<User>
            {
                new User { Name = "Maya Chen", Username = "mayachen", Email = "maya@example.com", Password = "hashed_pass_123", Bio = "Tech lead and workflows designer", AvatarUrl = "images/profile-placeholder.svg" },
                new User { Name = "Daniel Ross", Username = "danielross", Email = "daniel@example.com", Password = "hashed_pass_123", Bio = "Remote work advocate", AvatarUrl = "images/profile-placeholder.svg" },
                new User { Name = "Sara Kim", Username = "sarakim", Email = "sara@example.com", Password = "hashed_pass_123", Bio = "Minimalist travel writer", AvatarUrl = "images/profile-placeholder.svg" },
                new User { Name = "Jules Rivera", Username = "julesrivera", Email = "jules@example.com", Password = "hashed_pass_123", Bio = "Followed creator on lifestyle and productivity", AvatarUrl = "images/profile-placeholder.svg" },
                new User { Name = "Amira Patel", Username = "amirapatel", Email = "amira@example.com", Password = "hashed_pass_123", Bio = "Writer and educator", AvatarUrl = "images/profile-placeholder.svg" },
                new User { Name = "Amelia Brooks", Username = "ameliawrites", Email = "amelia@example.com", Password = "hashed_pass_123", Bio = "Product storyteller", AvatarUrl = "images/profile-placeholder.svg" },
                new User { Name = "Nora", Username = "nora", Email = "nora@example.com", Password = "hashed_pass_123", Bio = "Avid reader", AvatarUrl = "images/profile-placeholder.svg" },
                new User { Name = "Leo", Username = "leo", Email = "leo@example.com", Password = "hashed_pass_123", Bio = "Tech enthusiast", AvatarUrl = "images/profile-placeholder.svg" }
            };
            db.Users.AddRange(users);
            db.SaveChanges();

            var blogs = new List<Blog>
            {
                new Blog { AuthorId = users[0].UserId, Title = "How AI is reshaping modern product workflows.", Content = "Modern teams are moving faster, but only when tools reduce friction rather than add it. Across product design, operations, and customer support, AI is changing the rhythm of work. The most effective implementations begin with small automation wins: summarizing meetings, drafting content, surfacing insights, and classifying requests. These improvements free people to focus on judgment, empathy, and creativity. The next wave of growth will come from organizations that learn to combine human insight with automation responsibly, with clear guardrails and a strong sense of context.", ThumbnailUrl = "images/blog-1.svg", Category = "Technology", Tags = "ai, workflow, productivity" },
                new Blog { AuthorId = users[1].UserId, Title = "Building a calm remote work ritual that actually lasts.", Content = "Small habits can create powerful weekly momentum. When working from home, separating workspace from living space is critical. Building daily transitions—like a morning walk or an end-of-day shutdown ritual—helps reset the mind.", ThumbnailUrl = "images/blog-2.svg", Category = "Lifestyle", Tags = "remote, productivity, wellness" },
                new Blog { AuthorId = users[2].UserId, Title = "Designing a minimalist travel itinerary for city breaks.", Content = "Less clutter, more memorable experiences, and fewer headaches. Minimalist travel is not just about what you pack, it is about what you plan. Prioritize one anchor event per day and let the rest unfold naturally.", ThumbnailUrl = "images/blog-3.svg", Category = "Travel", Tags = "travel, minimalist" },
                new Blog { AuthorId = users[5].UserId, Title = "Designing content systems that scale.", Content = "How strategic structure creates room for creativity. Scalable content design starts with componentized layouts and modular styling.", ThumbnailUrl = "images/blog-1.svg", Category = "Programming", Tags = "systems, scale" },
                new Blog { AuthorId = users[5].UserId, Title = "Small rituals that make writing easier.", Content = "Habit design can be surprisingly powerful. Dedicating a specific time and environment triggers creative flow effortlessly.", ThumbnailUrl = "images/blog-2.svg", Category = "Lifestyle", Tags = "writing, habits" }
            };
            db.Blogs.AddRange(blogs);
            db.SaveChanges();

            var comments = new List<Comment>
            {
                new Comment { BlogId = blogs[0].BlogId, UserId = users[6].UserId, Content = "Really enjoyed the practical angle. This feels grounded and useful." },
                new Comment { BlogId = blogs[0].BlogId, UserId = users[7].UserId, Content = "Love the emphasis on human judgment alongside automation." }
            };
            db.Comments.AddRange(comments);

            var likes = new List<Like>
            {
                new Like { UserId = users[6].UserId, BlogId = blogs[0].BlogId },
                new Like { UserId = users[7].UserId, BlogId = blogs[0].BlogId }
            };
            db.Likes.AddRange(likes);

            var bookmarks = new List<Bookmark>
            {
                new Bookmark { UserId = users[5].UserId, BlogId = blogs[0].BlogId }
            };
            db.Bookmarks.AddRange(bookmarks);

            var follows = new List<Follow>
            {
                new Follow { FollowerId = users[6].UserId, FollowingId = users[5].UserId },
                new Follow { FollowerId = users[7].UserId, FollowingId = users[5].UserId }
            };
            db.Follows.AddRange(follows);

            db.SaveChanges();
            Console.WriteLine("Database initialized and seeded successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization warning: {ex.Message}");
    }
}

// ==========================================
// API Endpoints
// ==========================================

// Base Health Check for API
app.MapGet("/api", () => "BlogSphere C# API is running!");

// Helper function to copy directories
void CopyDirectory(string sourceDir, string destinationDir)
{
    var dir = new DirectoryInfo(sourceDir);
    if (!dir.Exists) return;

    Directory.CreateDirectory(destinationDir);

    foreach (FileInfo file in dir.GetFiles())
    {
        string targetFilePath = Path.Combine(destinationDir, file.Name);
        file.CopyTo(targetFilePath, true);
    }

    foreach (DirectoryInfo subDir in dir.GetDirectories())
    {
        string newDestinationDir = Path.Combine(destinationDir, subDir.Name);
        CopyDirectory(subDir.FullName, newDestinationDir);
    }
}

// Copy assets to html/ folder automatically to keep it self-contained
try
{
    var rootPath = Path.Combine(builder.Environment.ContentRootPath, "..");
    var htmlPath = Path.Combine(rootPath, "html");
    if (Directory.Exists(htmlPath))
    {
        CopyDirectory(Path.Combine(rootPath, "css"), Path.Combine(htmlPath, "css"));
        CopyDirectory(Path.Combine(rootPath, "js"), Path.Combine(htmlPath, "js"));
        CopyDirectory(Path.Combine(rootPath, "images"), Path.Combine(htmlPath, "images"));
        Console.WriteLine("Assets successfully copied to html folder.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error copying assets: {ex.Message}");
}

// Serve frontend static files from the 'html' directory if available, otherwise 'main'
var htmlPathToServe = Path.Combine(builder.Environment.ContentRootPath, "..", "html");
var mainPathToServe = Path.Combine(builder.Environment.ContentRootPath, "..", "main");
var servePath = Directory.Exists(htmlPathToServe) ? htmlPathToServe : mainPathToServe;

if (Directory.Exists(servePath))
{
    var provider = new PhysicalFileProvider(Path.GetFullPath(servePath));
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = provider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = provider });
}

// 1. Auth Endpoints
app.MapPost("/api/auth/register", async (RegisterRequest req, BlogSphereDbContext db) =>
{
    if (await db.Users.AnyAsync(u => u.Email == req.Email || u.Username == req.Username))
    {
        return Results.BadRequest(new { message = "Email or Username already exists." });
    }

    var user = new User
    {
        Name = req.Name,
        Username = req.Username,
        Email = req.Email,
        Password = req.Password // In production, encrypt/hash this!
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/api/users/{user.Username}", user);
});

app.MapPost("/api/auth/login", async (LoginRequest req, BlogSphereDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email && u.Password == req.Password);
    if (user == null)
    {
        return Results.Unauthorized();
    }
    return Results.Ok(user);
});

// 2. Blog Endpoints
app.MapGet("/api/blogs", async (string? query, string? category, BlogSphereDbContext db) =>
{
    var blogsQuery = db.Blogs.Include(b => b.Author).AsQueryable();

    if (!string.IsNullOrEmpty(category))
    {
        blogsQuery = blogsQuery.Where(b => b.Category.ToLower() == category.ToLower());
    }

    if (!string.IsNullOrEmpty(query))
    {
        var lowerQuery = query.ToLower();
        blogsQuery = blogsQuery.Where(b => 
            b.Title.ToLower().Contains(lowerQuery) || 
            b.Content.ToLower().Contains(lowerQuery) || 
            (b.Tags != null && b.Tags.ToLower().Contains(lowerQuery)));
    }

    var blogs = await blogsQuery.OrderByDescending(b => b.CreatedAt).ToListAsync();
    return Results.Ok(blogs);
});

app.MapGet("/api/blogs/{id:int}", async (int id, BlogSphereDbContext db) =>
{
    var blog = await db.Blogs
        .Include(b => b.Author)
        .Include(b => b.Comments).ThenInclude(c => c.User)
        .Include(b => b.Likes)
        .Include(b => b.Bookmarks)
        .FirstOrDefaultAsync(b => b.BlogId == id);

    if (blog == null) return Results.NotFound();

    // Map counts or custom structures
    return Results.Ok(new
    {
        blog.BlogId,
        blog.Title,
        blog.Content,
        blog.ThumbnailUrl,
        blog.Category,
        blog.Tags,
        blog.CreatedAt,
        blog.Author,
        LikesCount = blog.Likes.Count,
        BookmarksCount = blog.Bookmarks.Count,
        Comments = blog.Comments.Select(c => new {
            c.CommentId,
            c.Content,
            c.CreatedAt,
            User = new { c.User?.UserId, c.User?.Name, c.User?.Username, c.User?.AvatarUrl }
        })
    });
});

app.MapPost("/api/blogs", async (BlogCreateDto dto, BlogSphereDbContext db) =>
{
    var author = await db.Users.FindAsync(dto.AuthorId);
    if (author == null) return Results.BadRequest(new { message = "Author not found." });

    var blog = new Blog
    {
        AuthorId = dto.AuthorId,
        Title = dto.Title,
        Content = dto.Content,
        ThumbnailUrl = dto.ThumbnailUrl,
        Category = dto.Category,
        Tags = dto.Tags
    };

    db.Blogs.Add(blog);
    await db.SaveChangesAsync();

    return Results.Created($"/api/blogs/{blog.BlogId}", blog);
});

// 3. Comments Endpoints
app.MapPost("/api/blogs/{blogId:int}/comments", async (int blogId, CommentCreateDto dto, BlogSphereDbContext db) =>
{
    var blog = await db.Blogs.FindAsync(blogId);
    if (blog == null) return Results.NotFound(new { message = "Blog not found." });

    var user = await db.Users.FindAsync(dto.UserId);
    if (user == null) return Results.BadRequest(new { message = "User not found." });

    var comment = new Comment
    {
        BlogId = blogId,
        UserId = dto.UserId,
        Content = dto.Content
    };

    db.Comments.Add(comment);
    await db.SaveChangesAsync();

    return Results.Created($"/api/blogs/{blogId}", new {
        comment.CommentId,
        comment.Content,
        comment.CreatedAt,
        User = new { user.UserId, user.Name, user.Username, user.AvatarUrl }
    });
});

// 4. Like / Unlike Toggle
app.MapPost("/api/blogs/{blogId:int}/like", async (int blogId, int userId, BlogSphereDbContext db) =>
{
    var existingLike = await db.Likes.FindAsync(userId, blogId);
    if (existingLike != null)
    {
        db.Likes.Remove(existingLike);
        await db.SaveChangesAsync();
        return Results.Ok(new { liked = false, message = "Blog unliked." });
    }

    var like = new Like { UserId = userId, BlogId = blogId };
    db.Likes.Add(like);
    await db.SaveChangesAsync();
    return Results.Ok(new { liked = true, message = "Blog liked." });
});

// 5. Bookmark / Unbookmark Toggle
app.MapPost("/api/blogs/{blogId:int}/bookmark", async (int blogId, int userId, BlogSphereDbContext db) =>
{
    var existingBookmark = await db.Bookmarks.FindAsync(userId, blogId);
    if (existingBookmark != null)
    {
        db.Bookmarks.Remove(existingBookmark);
        await db.SaveChangesAsync();
        return Results.Ok(new { bookmarked = false, message = "Bookmark removed." });
    }

    var bookmark = new Bookmark { UserId = userId, BlogId = blogId };
    db.Bookmarks.Add(bookmark);
    await db.SaveChangesAsync();
    return Results.Ok(new { bookmarked = true, message = "Blog bookmarked." });
});

// 6. Follow / Unfollow Toggle
app.MapPost("/api/users/{followingId:int}/follow", async (int followingId, int followerId, BlogSphereDbContext db) =>
{
    if (followingId == followerId) return Results.BadRequest(new { message = "You cannot follow yourself." });

    var existingFollow = await db.Follows.FindAsync(followerId, followingId);
    if (existingFollow != null)
    {
        db.Follows.Remove(existingFollow);
        await db.SaveChangesAsync();
        return Results.Ok(new { followed = false, message = "User unfollowed." });
    }

    var follow = new Follow { FollowerId = followerId, FollowingId = followingId };
    db.Follows.Add(follow);
    await db.SaveChangesAsync();
    return Results.Ok(new { followed = true, message = "User followed." });
});

// 7. Profile Endpoint
app.MapGet("/api/users/{username}", async (string username, BlogSphereDbContext db) =>
{
    var user = await db.Users
        .Include(u => u.Blogs)
        .Include(u => u.Followers)
        .Include(u => u.Following)
        .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

    if (user == null) return Results.NotFound();

    return Results.Ok(new
    {
        user.UserId,
        user.Name,
        user.Username,
        user.Bio,
        user.AvatarUrl,
        user.CreatedAt,
        FollowersCount = user.Followers.Count,
        FollowingCount = user.Following.Count,
        BlogsCount = user.Blogs.Count,
        Blogs = user.Blogs.Select(b => new {
            b.BlogId,
            b.Title,
            b.Content,
            b.ThumbnailUrl,
            b.Category,
            b.Tags,
            b.CreatedAt
        })
    });
});

app.Run();
