import os
import sys
import subprocess

# --- Self-installation check for reportlab ---
try:
    import reportlab
except ImportError:
    print("ReportLab is not installed. Installing it via pip...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab"])
        print("ReportLab successfully installed!")
    except Exception as e:
        print(f"Error installing ReportLab: {e}")
        print("Please run: pip install reportlab")
        sys.exit(1)

from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# Dimensions of landscape Letter page: 792 x 612
WIDTH, HEIGHT = landscape(letter)

# Curated HSL-derived Premium Color Scheme (Dark Slate & Neon Accents)
BG_COLOR = colors.HexColor('#0F172A')       # Deep slate blue canvas background
CARD_BG = colors.HexColor('#1E293B')        # Slate grey surface/card background
BORDER_COLOR = colors.HexColor('#334155')   # Subtle border grey
TEXT_WHITE = colors.HexColor('#F8FAFC')     # Pure high-contrast off-white
TEXT_MUTED = colors.HexColor('#94A3B8')     # Slate grey body text
ACCENT_INDIGO = colors.HexColor('#6366F1')  # Royal Indigo primary accent
ACCENT_TEAL = colors.HexColor('#0D9488')    # Dark Teal secondary accent
ACCENT_MINT = colors.HexColor('#2DD4BF')    # Mint green highlights
ACCENT_PURPLE = colors.HexColor('#A855F7')  # Purple highlights
ACCENT_DARK = colors.HexColor('#0B0F19')    # Absolute dark background contrast

def draw_header_footer(c, title, slide_number):
    """Draws consistent premium dark background, header with title, and footer with slide number."""
    # Background
    c.setFillColor(BG_COLOR)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    
    # Modern Top Header Accent Bar
    c.setFillColor(ACCENT_INDIGO)
    c.rect(0, HEIGHT - 5, WIDTH, 5, fill=1, stroke=0)
    
    # Header Title
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 50, title)
    
    # Glowing vertical indicator next to header title
    c.setFillColor(ACCENT_MINT)
    c.rect(40, HEIGHT - 54, 4, 24, fill=1, stroke=0)
    
    # BlogSphere Brand Logo badge
    c.setStrokeColor(BORDER_COLOR)
    c.setFillColor(ACCENT_DARK)
    c.roundRect(WIDTH - 170, HEIGHT - 58, 120, 32, 6, fill=1, stroke=1)
    
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(ACCENT_INDIGO)
    c.drawString(WIDTH - 158, HEIGHT - 46, "B")
    c.setFillColor(TEXT_WHITE)
    c.drawString(WIDTH - 146, HEIGHT - 46, "BlogSphere")
    
    # Footer separator line
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(1)
    c.line(40, 52, WIDTH - 40, 52)
    
    # Footer details
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, 34, "BlogSphere  |  Premium Publishing & Social Ecosystem")
    c.drawRightString(WIDTH - 40, 34, f"Slide {slide_number} of 10")

def draw_card(c, x, y, w, h, title=None, border_accent=None):
    """Draws a premium layout container card."""
    # Draw double-rect to simulate soft shadow/depth
    c.setFillColor(colors.HexColor('#090D16'))
    c.roundRect(x + 3, y - 3, w, h, 8, fill=1, stroke=0)
    
    c.setFillColor(CARD_BG)
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(1)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    
    if border_accent:
        c.setFillColor(border_accent)
        c.rect(x + 1, y + h - 4, w - 2, 3, fill=1, stroke=0)
        
    if title:
        c.setFont("Helvetica-Bold", 13)
        c.setFillColor(TEXT_WHITE)
        c.drawString(x + 20, y + h - 25, title)
        
        c.setStrokeColor(BORDER_COLOR)
        c.line(x + 20, y + h - 35, x + w - 20, y + h - 35)

def draw_bullet_points(c, x, start_y, points, leading=26, text_size=11.5):
    """Draws beautiful styled bullet points."""
    curr_y = start_y
    for p in points:
        # Mini mint square bullet point
        c.setFillColor(ACCENT_MINT)
        c.rect(x, curr_y + 3, 6, 6, fill=1, stroke=0)
        
        # Split text into bold heading and details at '|'
        c.setFont("Helvetica", text_size)
        if "|" in p:
            bold_part, regular_part = p.split("|", 1)
            c.setFont("Helvetica-Bold", text_size)
            c.setFillColor(TEXT_WHITE)
            c.drawString(x + 18, curr_y, bold_part.strip())
            
            bold_w = c.stringWidth(bold_part.strip(), "Helvetica-Bold", text_size)
            c.setFont("Helvetica", text_size)
            c.setFillColor(TEXT_MUTED)
            c.drawString(x + 18 + bold_w + 5, curr_y, regular_part.strip())
        else:
            c.setFillColor(TEXT_MUTED)
            c.drawString(x + 18, curr_y, p)
            
        curr_y -= leading

def build_pdf():
    pdf_filename = "BlogSphere_Presentation.pdf"
    c = canvas.Canvas(pdf_filename, pagesize=landscape(letter))
    
    # -------------------------------------------------------------
    # SLIDE 1: COVER
    # -------------------------------------------------------------
    c.setFillColor(BG_COLOR)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    
    # Premium Glowing abstract circles for modern UI deck aesthetic
    c.setFillColor(colors.HexColor('#1E1B4B')) # Deep Purple Glow
    c.circle(WIDTH - 100, 100, 320, fill=1, stroke=0)
    c.setFillColor(colors.HexColor('#0F3F3E')) # Deep Mint Glow
    c.circle(100, HEIGHT - 50, 240, fill=1, stroke=0)
    
    # Main logo mark container
    c.setFillColor(ACCENT_INDIGO)
    c.roundRect(WIDTH/2 - 45, HEIGHT/2 + 50, 90, 90, 20, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 54)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(WIDTH/2, HEIGHT/2 + 68, "B")
    
    # Main branding
    c.setFont("Helvetica-Bold", 46)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(WIDTH/2, HEIGHT/2 - 22, "BlogSphere")
    
    # Horizontal neon separator
    c.setFillColor(ACCENT_MINT)
    c.rect(WIDTH/2 - 70, HEIGHT/2 - 42, 140, 4, fill=1, stroke=0)
    
    # Elegant Subtitle
    c.setFont("Helvetica", 18)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(WIDTH/2, HEIGHT/2 - 76, "A Premium Digital Publishing & Reading Platform")
    
    # Value slogans
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(ACCENT_INDIGO)
    c.drawCentredString(WIDTH/2, 120, "EMPOWERING WRITERS  •  INSPIRING READERS  •  CONNECTING COMMUNITIES")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(WIDTH/2, 98, "A Modern Content Ecosystem Designed for Seamless Intellectual Exchange")
    
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 2: WHAT IS IT?
    # -------------------------------------------------------------
    draw_header_footer(c, "01. Introduction: What is BlogSphere?", 2)
    
    # Left Column (Concept Narrative)
    c.setFont("Helvetica-Bold", 19)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "The Future of Digital Publishing")
    
    c.setFont("Helvetica", 12.5)
    c.setFillColor(TEXT_MUTED)
    intro_y = HEIGHT - 170
    intro_lines = [
        "BlogSphere is a premium publishing platform and community space designed",
        "to remove distractions and return focus to high-quality content.",
        "",
        "Unlike platforms crowded with intrusive advertisements, sponsored pop-ups,",
        "and complex paywalls, BlogSphere offers a clean, visual-first environment",
        "where authors can showcase their ideas and readers can consume them",
        "with unmatched speed and comfort.",
        "",
        "It operates as a lightweight, fully responsive single-page web app,",
        "delivering immediate navigation and beautiful dark-theme visuals."
    ]
    for line in intro_lines:
        c.drawString(60, intro_y, line)
        intro_y -= 22
        
    # Right Column (Core Pillars Card)
    draw_card(c, 460, 110, 272, 380, "Platform Vision", ACCENT_INDIGO)
    
    pillars = [
        ("Reader-Centric Design | Every interface element, font size, and spacing is optimized specifically for prolonged reading comfort without eye strain."),
        ("No-Code Drafting | Writers compose stories instantly using an integrated publishing engine with straightforward metadata cataloging."),
        ("Built-in Interactions | Direct relationships are forged through custom comment sections, post likes, bookmarks, and author follow lists.")
    ]
    
    pillar_y = HEIGHT - 180
    for title, desc in [p.split("|") for p in pillars]:
        c.setFont("Helvetica-Bold", 11.5)
        c.setFillColor(ACCENT_MINT)
        c.drawString(480, pillar_y, title.strip())
        
        c.setFont("Helvetica", 10)
        c.setFillColor(TEXT_MUTED)
        
        # Word wrapping helper for descriptions
        words = desc.strip().split()
        lines = []
        curr = ""
        for w in words:
            if len(curr + " " + w) < 36:
                curr += " " + w
            else:
                lines.append(curr.strip())
                curr = w
        lines.append(curr.strip())
        
        dy = pillar_y - 16
        for l in lines:
            c.drawString(480, dy, l)
            dy -= 14
        
        pillar_y -= 88
        
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 3: WHAT IT DO
    # -------------------------------------------------------------
    draw_header_footer(c, "02. Core Capabilities: What It Does", 3)
    
    col_w = 210
    col_h = 360
    col_y = 110
    
    # Pillar 1: Publishing
    draw_card(c, 50, col_y, col_w, col_h, "Empower Creators", ACCENT_INDIGO)
    points_c1 = [
        "Structured Layouts | Formats posts cleanly.",
        "Meta Categorization | Authors tag stories by primary topics.",
        "Distraction Free | Clean writing canvas to write drafts.",
        "Interactive Prompts | Publish buttons with immediate feedback.",
        "Profile Showcases | Catalog all articles under unique profiles."
    ]
    draw_bullet_points(c, 65, HEIGHT - 190, points_c1, leading=26, text_size=10.5)
    
    # Pillar 2: Reading
    draw_card(c, 291, col_y, col_w, col_h, "Immersive Reading", ACCENT_TEAL)
    points_c2 = [
        "Curated Home Page | Instantly explore trending and popular stories.",
        "Visual Previews | Cards with featured cover designs and read times.",
        "Topic Navigation | Rapid exploration using category links.",
        "Adaptive Structure | Responsive design across mobile and desktop.",
        "Theme Toggling | Switch between dark and light themes instantly."
    ]
    draw_bullet_points(c, 306, HEIGHT - 190, points_c2, leading=26, text_size=10.5)
    
    # Pillar 3: Engaging
    draw_card(c, 532, col_y, col_w, col_h, "Connect Communities", ACCENT_PURPLE)
    points_c3 = [
        "Follow Creators | Connect with writers to stay updated.",
        "Appreciations | Like articles to push them into trending feeds.",
        "Bookmark Library | Save stories to your personal reads list.",
        "Interactive Comments | Write feedback and initiate discussions.",
        "Immediate Updates | Social counts refresh on current views."
    ]
    draw_bullet_points(c, 547, HEIGHT - 190, points_c3, leading=26, text_size=10.5)
    
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 4: READER EXPERIENCE
    # -------------------------------------------------------------
    draw_header_footer(c, "03. Interactive Reading & Content Feed", 4)
    
    # Left Content
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "The Reader Journey: Curated Feed & Cards")
    
    read_details = [
        "Visual Post Cards | Structured blocks containing article cover graphics, author avatars, categorization tags, and snippet content.",
        "Trending Columns | Sidebars that float popular stories based on reader appreciation scores and comment counts.",
        "Fluid Grid Adaptability | Post displays seamlessly reflow from three columns on wide monitors to stacked rows on smartphones.",
        "Readable Typography | Generous margins and font sizing reduce reader fatigue, enabling a comfortable digital library experience."
    ]
    draw_bullet_points(c, 60, HEIGHT - 180, read_details, leading=38, text_size=11)
    
    # Right: Mock UI Showcase
    draw_card(c, 450, 110, 282, 380, "Story Discovery Feed Preview", ACCENT_TEAL)
    
    # Drawing a mock blog card
    c.setFillColor(ACCENT_DARK)
    c.setStrokeColor(BORDER_COLOR)
    c.roundRect(470, 180, 242, 210, 6, fill=1, stroke=1)
    
    # Card Header Graphic (Simple abstract visual)
    c.setFillColor(colors.HexColor('#312E81'))
    c.roundRect(471, 290, 240, 99, 4, fill=1, stroke=0)
    
    c.setStrokeColor(ACCENT_MINT)
    c.setLineWidth(1)
    c.line(480, 350, 560, 310)
    c.circle(520, 330, 18, fill=0, stroke=1)
    c.circle(540, 340, 6, fill=1, stroke=0)
    
    # Tag label
    c.setFillColor(ACCENT_TEAL)
    c.roundRect(485, 260, 75, 16, 8, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(522, 264, "Technology")
    
    # Card Title
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(TEXT_WHITE)
    c.drawString(485, 240, "Designing for Calm Workspaces")
    
    # Card Snippet
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawString(485, 224, "How simple typography and dark interfaces")
    c.drawString(485, 210, "help readers maintain mental flow...")
    
    # Card Footer Row
    c.setFillColor(colors.HexColor('#1E293B'))
    c.rect(471, 181, 240, 24, fill=1, stroke=0)
    
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(ACCENT_MINT)
    c.drawString(485, 189, "BY MAYA CHEN")
    
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawRightString(700, 189, "5 Min Read  ->")
    
    # Small Feed Summary Card below
    c.setFillColor(colors.HexColor('#0F172A'))
    c.roundRect(470, 126, 242, 42, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(591, 150, "Hovering cards triggers visual lift animations")
    c.drawCentredString(591, 136, "and color-shifting highlights.")
    
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 5: CREATOR STUDIO
    # -------------------------------------------------------------
    draw_header_footer(c, "04. Creator Studio & Publishing Engine", 5)
    
    # Left Content
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "The Publishing Panel: For Modern Writers")
    
    write_details = [
        "Focused Composition | A clean drafting layout designed to limit side menus, enabling writers to concentrate entirely on expression.",
        "Interactive Inputs | Form text areas designed for structured input of blog titles, descriptions, and primary content body.",
        "Taxonomy Selection | Simple tag selection allows immediate classification under channels (Tech, Life, Travel, Design).",
        "Direct to Feed | Instant submission processes post data and appends the new card onto the main homepage catalog immediately."
    ]
    draw_bullet_points(c, 60, HEIGHT - 180, write_details, leading=38, text_size=11)
    
    # Right: Mock UI Showcase
    draw_card(c, 450, 110, 282, 380, "Composer Dashboard", ACCENT_INDIGO)
    
    # Input field 1 (Title)
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(TEXT_WHITE)
    c.drawString(470, HEIGHT - 170, "Title")
    c.setFillColor(ACCENT_DARK)
    c.roundRect(470, HEIGHT - 195, 242, 20, 3, fill=1, stroke=1)
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawString(478, HEIGHT - 188, "Drafting my next story...")
    
    # Input field 2 (Category Tags)
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(TEXT_WHITE)
    c.drawString(470, HEIGHT - 225, "Select Category")
    c.setFillColor(ACCENT_DARK)
    c.roundRect(470, HEIGHT - 250, 242, 20, 3, fill=1, stroke=1)
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawString(478, HEIGHT - 243, "Technology, Lifestyle, Design, Travel...")
    
    # Input field 3 (Main Content Textarea)
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(TEXT_WHITE)
    c.drawString(470, HEIGHT - 280, "Write Story Body")
    c.setFillColor(ACCENT_DARK)
    c.roundRect(470, HEIGHT - 390, 242, 102, 3, fill=1, stroke=1)
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawString(478, HEIGHT - 298, "In the realm of digital creation...")
    c.drawString(478, HEIGHT - 310, "Focusing user attention is the greatest skill.")
    c.drawString(478, HEIGHT - 322, "This template helps you achieve exactly that...")
    
    # Interactive Button
    c.setFillColor(ACCENT_INDIGO)
    c.roundRect(470, 130, 242, 28, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(591, 140, "Publish Article Now")
    
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 6: COMMUNITY LOOP
    # -------------------------------------------------------------
    draw_header_footer(c, "05. Community Network & Social Loop", 6)
    
    # Left Content
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "The Social Loop: Interaction Ecosystem")
    
    social_details = [
        "Network Growth | Readers can follow writers directly, building user networks and keeping readers updated on new releases.",
        "Interactive Support | Likes allow readers to show appreciation, moving content up the popularity chain in real time.",
        "Reader Libraries | Bookmarks allow users to save important stories to a personal reads library.",
        "Conversational Threads | Comments sections encourage discussions directly below the publisher's article."
    ]
    draw_bullet_points(c, 60, HEIGHT - 180, social_details, leading=38, text_size=11)
    
    # Right: Mock UI Showcase (Interaction Flow Diagram)
    draw_card(c, 450, 110, 282, 380, "Social Action Pipeline", ACCENT_PURPLE)
    
    # Central Reader Node
    c.setFillColor(ACCENT_DARK)
    c.setStrokeColor(ACCENT_INDIGO)
    c.setLineWidth(1.5)
    c.roundRect(511, HEIGHT - 180, 160, 40, 20, fill=1, stroke=1)
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(591, HEIGHT - 164, "Active Reader")
    
    # Pipeline Arrows
    c.setStrokeColor(ACCENT_MINT)
    c.setLineWidth(1.5)
    # Downward branching paths
    c.line(591, HEIGHT - 180, 501, HEIGHT - 260)
    c.line(591, HEIGHT - 180, 591, HEIGHT - 260)
    c.line(591, HEIGHT - 180, 681, HEIGHT - 260)
    
    # Arrow heads
    def draw_down_arrow_head(cx, cy):
        c.setFillColor(ACCENT_MINT)
        c.polygon([cx-4, cy+4, cx+4, cy+4, cx, cy], fill=1, stroke=0)
        
    draw_down_arrow_head(501, HEIGHT - 260)
    draw_down_arrow_head(591, HEIGHT - 260)
    draw_down_arrow_head(681, HEIGHT - 260)
    
    # Action labels
    c.setFont("Helvetica", 8.5)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(526, HEIGHT - 215, "Follows")
    c.drawCentredString(591, HEIGHT - 215, "Likes/Saves")
    c.drawCentredString(656, HEIGHT - 215, "Comments")
    
    # Target entities
    # 1. Author profile
    c.setFillColor(CARD_BG)
    c.setStrokeColor(BORDER_COLOR)
    c.roundRect(465, HEIGHT - 315, 72, 45, 6, fill=1, stroke=1)
    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(501, HEIGHT - 296, "Author")
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(501, HEIGHT - 308, "Subscribers")
    
    # 2. Blog Post
    c.setFillColor(CARD_BG)
    c.setStrokeColor(ACCENT_MINT)
    c.roundRect(555, HEIGHT - 315, 72, 45, 6, fill=1, stroke=1)
    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(591, HEIGHT - 296, "Article")
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(591, HEIGHT - 308, "Like / Save")
    
    # 3. Comments Section
    c.setFillColor(CARD_BG)
    c.setStrokeColor(BORDER_COLOR)
    c.roundRect(645, HEIGHT - 315, 72, 45, 6, fill=1, stroke=1)
    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(681, HEIGHT - 296, "Discussion")
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(681, HEIGHT - 308, "Feedback")
    
    # Feedback statement at bottom
    c.setFillColor(colors.HexColor('#0F172A'))
    c.roundRect(470, 130, 242, 45, 4, fill=1, stroke=0)
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(591, 158, "Real-time updates update community metrics")
    c.drawCentredString(591, 144, "without requiring complete page refreshes.")
    
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 7: SEARCH & NAVIGATION
    # -------------------------------------------------------------
    draw_header_footer(c, "06. Advanced Search & Topic Navigation", 7)
    
    # Left Content
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "Platform Discovery: Search & Navigation")
    
    search_details = [
        "Universal Query Bar | Type queries to instantly filter blogs by title matching, author name, or core content text.",
        "Interactive Topic Pills | Category badges act as quick tags; clicking them filters the content feed instantly.",
        "Direct Author Queries | Find and showcase articles written by specific creators with a simple click.",
        "Search Result Counts | Immediate feedback on query success, highlighting matching post counts clearly."
    ]
    draw_bullet_points(c, 60, HEIGHT - 180, search_details, leading=38, text_size=11)
    
    # Right: Mock UI Showcase
    draw_card(c, 450, 110, 282, 380, "Content Search Engine", ACCENT_TEAL)
    
    # Mock Search Input
    c.setFillColor(ACCENT_DARK)
    c.setStrokeColor(BORDER_COLOR)
    c.roundRect(470, HEIGHT - 180, 242, 28, 4, fill=1, stroke=1)
    c.setFont("Helvetica", 9.5)
    c.setFillColor(TEXT_WHITE)
    c.drawString(485, HEIGHT - 171, "productivity workflow")
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(ACCENT_MINT)
    c.drawString(690, HEIGHT - 171, "Q") # Magnifying glass letter mock
    
    # Category pills representation
    categories = ["All", "Technology", "Design", "Lifestyle"]
    cx_pill = 470
    for idx, cat in enumerate(categories):
        is_active = idx == 1
        c.setFillColor(ACCENT_TEAL if is_active else CARD_BG)
        c.setStrokeColor(ACCENT_TEAL if is_active else BORDER_COLOR)
        c.roundRect(cx_pill, HEIGHT - 225, 48 if idx != 1 else 68, 20, 10, fill=1, stroke=1)
        
        c.setFont("Helvetica-Bold" if is_active else "Helvetica", 8)
        c.setFillColor(TEXT_WHITE)
        c.drawString(cx_pill + (8 if idx != 1 else 10), HEIGHT - 219, cat)
        cx_pill += (54 if idx != 1 else 74)
        
    # Search Results rows
    results = [
        ("Building a calm workspace", "Lifestyle  •  By Daniel Ross"),
        ("AI rules for writing workflows", "Technology  •  By Maya Chen"),
        ("Simple steps to schedule goals", "Productivity  •  By Alice King")
    ]
    
    rx_y = HEIGHT - 275
    for title, sub in results:
        c.setFillColor(colors.HexColor('#0F172A'))
        c.setStrokeColor(BORDER_COLOR)
        c.roundRect(470, rx_y, 242, 40, 4, fill=1, stroke=1)
        
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(TEXT_WHITE)
        c.drawString(480, rx_y + 24, title)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        c.drawString(480, rx_y + 10, sub)
        
        # Micro Arrow icon
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(ACCENT_MINT)
        c.drawRightString(700, rx_y + 17, "->")
        
        rx_y -= 52
        
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 8: PERSONAL PROFILES
    # -------------------------------------------------------------
    draw_header_footer(c, "07. Personalized Creator Portfolios", 8)
    
    # Left Content
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "Author Profiles: Displaying Writer Authority")
    
    profile_details = [
        "Creator Portfolios | Unified profiles display the creator's biography, total post counts, and follower statistics.",
        "Social Metrics Panel | Showcases community reach through dynamic counts of followers and followed accounts.",
        "Reading History | Allows visitors to browse the writer's published catalog chronologically from a single view.",
        "Interaction Buttons | Provides a follow button to subscribe to future posts directly from the user profile."
    ]
    draw_bullet_points(c, 60, HEIGHT - 180, profile_details, leading=38, text_size=11)
    
    # Right: Mock UI Showcase
    draw_card(c, 450, 110, 282, 380, "Creator Portfolio Interface", ACCENT_INDIGO)
    
    # Profile Card Box
    c.setFillColor(ACCENT_DARK)
    c.setStrokeColor(BORDER_COLOR)
    c.roundRect(470, 280, 242, 110, 6, fill=1, stroke=1)
    
    # Avatar Circle
    c.setFillColor(ACCENT_INDIGO)
    c.circle(520, 335, 24, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(520, 329, "M")
    
    # Profile details
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(TEXT_WHITE)
    c.drawString(560, 342, "Maya Chen")
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawString(560, 328, "@mayachen")
    
    # Bio
    c.setFont("Helvetica-Oblique", 8.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(485, 296, "Designing workspaces and software for clarity.")
    
    # Follower Metric Badges
    c.setFillColor(colors.HexColor('#1E293B'))
    c.roundRect(470, 230, 115, 42, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(ACCENT_MINT)
    c.drawCentredString(527, 252, "24")
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(527, 238, "Articles Published")
    
    c.setFillColor(colors.HexColor('#1E293B'))
    c.roundRect(597, 230, 115, 42, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(ACCENT_MINT)
    c.drawCentredString(654, 252, "1,240")
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(654, 238, "Followers")
    
    # Recent Story Row
    c.setFillColor(colors.HexColor('#0F172A'))
    c.setStrokeColor(BORDER_COLOR)
    c.roundRect(470, 130, 242, 85, 4, fill=1, stroke=1)
    
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(TEXT_WHITE)
    c.drawString(480, 194, "My Recent Publications")
    
    c.setStrokeColor(BORDER_COLOR)
    c.line(480, 186, 702, 186)
    
    # Story list items
    c.setFont("Helvetica", 8.5)
    c.setFillColor(TEXT_WHITE)
    c.drawString(480, 170, "•  How AI is reshaping product workflows")
    c.drawString(480, 155, "•  Designing calm text layouts for reading")
    c.drawString(480, 140, "•  The art of minimalist UI design")
    
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 9: THEME TOGGLE
    # -------------------------------------------------------------
    draw_header_footer(c, "08. Visual Freedom: Light & Dark Theme Customization", 9)
    
    # Left Content
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "Double-Theme Adaptability: Choose Your Light")
    
    theme_details = [
        "Instant Theme Switching | A toggle in the navigation bar swaps the interface mode in less than a millisecond.",
        "Optimum Night Mode | Deep dark tones provide eye comfort during long night reading sessions.",
        "Crisp Day Theme | High-contrast light backgrounds ensure readability under bright sunlit conditions.",
        "Color Palettes | Clean theme tokens swap CSS variables, keeping consistent typography configurations."
    ]
    draw_bullet_points(c, 60, HEIGHT - 180, theme_details, leading=38, text_size=11)
    
    # Right: Mock UI Showcase
    draw_card(c, 450, 110, 282, 380, "Theme Contrast Comparison", ACCENT_TEAL)
    
    # Split card graphic representation
    # Left side (Dark Mode)
    c.setFillColor(colors.HexColor('#0B0F19'))
    c.rect(470, 130, 101, 230, fill=1, stroke=0)
    
    # Right side (Light Mode)
    c.setFillColor(colors.HexColor('#F8FAFC'))
    c.rect(571, 130, 101, 230, fill=1, stroke=0)
    
    # Middle Divider border
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(1)
    c.line(571, 130, 571, 360)
    
    # Dark Mode text preview
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(TEXT_WHITE)
    c.drawString(480, 310, "Focus Content")
    c.setFont("Helvetica", 8)
    c.setFillColor(TEXT_MUTED)
    c.drawString(480, 290, "Dark Mode: Comfortable")
    c.drawString(480, 276, "reading colors.")
    
    # Light Mode text preview
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor('#0F172A'))
    c.drawString(585, 310, "Focus Content")
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor('#475569'))
    c.drawString(585, 290, "Light Mode: Clear")
    c.drawString(585, 276, "contrast panels.")
    
    # Toggle switch badge in middle
    c.setFillColor(ACCENT_INDIGO)
    c.setStrokeColor(BORDER_COLOR)
    c.circle(571, 200, 24, fill=1, stroke=1)
    
    # Crescent moon & Sun text icon representations
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(TEXT_WHITE)
    c.drawCentredString(571, 196, "O") # Mode icon character
    
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(571, 150, "SWITCH")
    
    c.showPage()
    
    # -------------------------------------------------------------
    # SLIDE 10: PRODUCT ROADMAP & GROWTH
    # -------------------------------------------------------------
    draw_header_footer(c, "09. Product Evolution & Roadmap", 10)
    
    # Left Content
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(TEXT_WHITE)
    c.drawString(60, HEIGHT - 130, "Growth Strategy: The Product Timeline")
    
    roadmap_desc = [
        "Content Monetization | Open new creator channels by adding direct writer support options.",
        "Interactive Markdown | Enable rich typography with direct markdown previews in the editor.",
        "Creator Dashboards | Deliver real-time page metrics, view durations, and follower counts.",
        "Newsletter Distribution | Sync subscriptions directly to visitor emails for newsletter notifications."
    ]
    draw_bullet_points(c, 60, HEIGHT - 180, roadmap_desc, leading=38, text_size=11)
    
    # Right Column: Future Roadmap Pipeline
    draw_card(c, 450, 110, 282, 380, "Technical Release Schedule", ACCENT_PURPLE)
    
    timeline_steps = [
        ("Phase 1: Rich Editor Markdown", "Enable formatting, inline code, and media embedding within drafts."),
        ("Phase 2: Platform Subscriptions", "Support newsletter alerts and follower direct subscriptions."),
        ("Phase 3: Creator Metrics", "Release analytics dashboards showing visitor counts and read metrics."),
        ("Phase 4: Content Monetization", "Incorporate direct payment gateways for tipping and paywalled articles.")
    ]
    
    step_y = HEIGHT - 180
    for idx, (title, desc) in enumerate(timeline_steps):
        # Step Number Badge
        c.setFillColor(ACCENT_PURPLE)
        c.circle(480, step_y + 4, 10, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(TEXT_WHITE)
        c.drawCentredString(480, step_y + 1, str(idx + 1))
        
        # Title
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(TEXT_WHITE)
        c.drawString(498, step_y, title)
        
        # Word wrapping helper for step description
        words = desc.split()
        lines = []
        curr = ""
        for w in words:
            if len(curr + " " + w) < 35:
                curr += " " + w
            else:
                lines.append(curr.strip())
                curr = w
        lines.append(curr.strip())
        
        dy = step_y - 13
        c.setFont("Helvetica", 8.5)
        c.setFillColor(TEXT_MUTED)
        for l in lines:
            c.drawString(498, dy, l)
            dy -= 11
            
        step_y -= 75
        
    c.showPage()
    
    # Save the generated presentation PDF
    c.save()
    print(f"Presentation successfully compiled: {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
