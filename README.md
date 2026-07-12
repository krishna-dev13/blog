# BlogSphere C# Backend API

This is a modern ASP.NET Core Minimal Web API backend designed to power the BlogSphere frontend. It uses **Entity Framework Core** with **MySQL** for data persistence.

## Prerequisites

1. **.NET 8 SDK** installed on your machine.
2. **MySQL Server** running.
3. Import the [blogspheredb.sql](../blogspheredb.sql) file into your MySQL instance to create the database and seed initial data:
   ```sql
   source path/to/blogspheredb.sql;
   ```

## Configuration

Before running the API, open [appsettings.json](appsettings.json) and replace `your_mysql_password` in the connection string with your actual MySQL root password:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=blogsphere;User=root;Password=your_actual_mysql_password;"
}
```

## Running the API

1. Open your terminal in this `backend` folder.
2. Run the following command to restore packages and build the project:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```

The application will start and listen on:
- `http://localhost:5000` (or another port outputted in the terminal)

## Endpoints Implemented

### Auth
- `POST /api/auth/register` - Create a new user profile
- `POST /api/auth/login` - Authenticate using email and password

### Blogs
- `GET /api/blogs` - List all blogs (supports query parameters `?query=AI` and `?category=Technology`)
- `GET /api/blogs/{id}` - Details of a single blog (includes comments, like and bookmark counts)
- `POST /api/blogs` - Publish a new blog post

### Interactions (Likes, Bookmarks, Comments, Follows)
- `POST /api/blogs/{blogId}/comments` - Leave a comment on a blog
- `POST /api/blogs/{blogId}/like?userId={userId}` - Like or unlike a blog
- `POST /api/blogs/{blogId}/bookmark?userId={userId}` - Bookmark or unbookmark a blog
- `POST /api/users/{followingId}/follow?followerId={followerId}` - Follow or unfollow a creator

### Profiles
- `GET /api/users/{username}` - Get user details, follow counts, and lists of their published blogs
