import os

base_dir = r"c:\Users\krishna\Desktop\blogging platform\blogging-platform-2"

css_files = [
    "css/spa.css",
    "css/style.css",
    "css/navbar.css",
    "css/home.css",
    "css/auth.css",
    "css/blog.css",
    "css/profile.css",
    "css/footer.css",
    "css/responsive.css"
]

js_files = [
    "js/spa.js",
    "js/app.js",
    "js/navbar.js",
    "js/darkmode.js",
    "js/blog.js",
    "js/search.js",
    "js/validation.js"
]

with open(os.path.join(base_dir, "styles.css"), "w", encoding="utf-8") as outfile:
    for f in css_files:
        with open(os.path.join(base_dir, f), "r", encoding="utf-8") as infile:
            outfile.write(f"/* --- {f} --- */\n")
            outfile.write(infile.read() + "\n\n")

with open(os.path.join(base_dir, "script.js"), "w", encoding="utf-8") as outfile:
    for f in js_files:
        with open(os.path.join(base_dir, f), "r", encoding="utf-8") as infile:
            outfile.write(f"/* --- {f} --- */\n")
            outfile.write(infile.read() + "\n\n")

print("Successfully merged CSS and JS files.")
