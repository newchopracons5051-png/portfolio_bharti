# Bharti Chopra - Customizable Portfolio Website

A clean, modern, high-performance portfolio website built for **Bharti Chopra**, Student of Civil Engineering from Jaipur, currently pursuing Civil Engineering from JECRC University.

This website includes **4 complete, fully customizable pages**, an in-browser **Theme & Content Customizer**, responsive mobile/desktop design, and zero external build tool dependencies (runs directly by double-clicking the HTML files in your browser!).

---

## 🌟 Pages Overview

### 1. Home / About (`index.html`)
- **Title**: Bharti Chopra
- **Subtitle**: Student of Civil Engineering
- **Background**: Jaipur city roots & schooling from NK Public School.
- **Highlights**: Multidisciplinary blend of Civil Infrastructure, Vibe Coding, and AI tooling.
- **Quick Stats**: JECRC University, Jaipur Roots, 3+ Engineering Projects, 1st Prize Tech Fest Winner.

### 2. Education & Skills (`skills.html`)
- **Education Timeline**:
  - **B.Tech in Civil Engineering**: JECRC University, Jaipur (Ongoing).
  - **Schooling**: NK Public School, Jaipur (Completed).
- **Interactive Skills Section**:
  - Filter categories: *All*, *Tech & AI*, *Creative Media*, *Civil Engineering*, *Core & Soft Skills*.
  - Included skills:
    - Good teamwork
    - Vibe coding
    - AI generalist
    - Video editing
    - Photo editing
    - Sustainable Drainage Design
    - Bridge Load Analysis
    - Problem Solving
  - **Live Addition & Removal**: Use the form at the bottom to add custom skills with category and proficiency level slider; remove skills anytime with the **×** button.

### 3. Projects & Achievements (`projects.html`)
- **Showcase Projects**:
  - **Smart Drainage System Design**: Sustainable urban drainage model with bioswales & IoT monitoring for flood mitigation and rainwater harvesting.
  - **Bridge Load Analysis**: Computational structural finite-element and dynamic vehicle stress analysis.
  - **AI-based Construction Cost Estimator**: Predictive machine learning prototype for forecasting material and labor budgets.
  - Features interactive **Details Preview Modal**, **Edit Project Modal**, and **+ Add Project Modal**.
- **Achievements**:
  - Won 1st prize in JECRC Civil Tech Fest.
  - Published paper on sustainable concrete in student journal.
  - Organized inter-college hackathon on AI in construction.
  - Includes **+ Add Achievement** and deletion capabilities.

### 4. Contact (`contact.html`)
- **Direct Contact Cards**:
  - **Phone**: `+91-XXXXXXXXXX` (Click-to-call & one-click copy button)
  - **Email**: `bhartichopra@example.com` (Click-to-email & one-click copy button)
  - **LinkedIn**: `linkedin.com/in/bhartichopra` (Direct profile link)
  - **Location**: Jaipur, Rajasthan, India
- **Interactive Contact Form**:
  - Name, Email, Subject, and Message.
  - Interactive submission validation with animated feedback and toast notification.
  - Automatically logs inquiries into your browser storage so messages are never lost.

---

## 🎨 Theme & Layout Customization Studio

Click the floating **🎨 Customize** button in the bottom-right corner of any page to open the live customization studio:

1. **Curated Color Themes**:
   - **Jaipur Emerald** (Fresh Slate & Emerald Green)
   - **Civil Blueprint** (Default - Deep Engineering Sky & Blueprint Cyan)
   - **Sunset Amber** (Warm Dark Charcoal & Amber Gold)
   - **Royal Violet** (Modern Indigo & Violet)
   - **Modern Rose** (Vibrant Ruby & Rose)
   - **Midnight Slate** (Clean Monochrome Slate & Platinum)
2. **Custom Color Pickers**: Choose any primary brand and accent highlight hex color using real-time color pickers.
3. **Color Appearance**: Toggle between **Dark Mode** and **Light Mode** (or use the sun/moon icon in the header).
4. **Typography**: Select between 5 curated fonts (*Plus Jakarta Sans*, *Inter*, *Space Grotesk*, *Outfit*, *Playfair Display*).
5. **Corner Radius**: Choose between Sharp (6px), Modern (14px), or Curved (22px).
6. **Live Content Edit Mode**: Toggle on to click any text, card, or contact detail and edit it directly in your browser.
7. **Data Backup**: Export your customized portfolio data as a JSON file or restore defaults at any time.

---

## 🚀 How to Run the Website

### Option 1: Double-Click (Zero Setup)
Simply open the `bharti portfolio` folder and double-click `index.html` in your web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Server (Optional)
If you prefer running via a local development server:
```bash
# Using Python
python -m http.server 3000

# Using Node (npx)
npx serve
```
Then visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
bharti portfolio/
├── index.html              # Page 1: Home / About Bharti Chopra
├── skills.html             # Page 2: Education & Skills (Add/Remove Skills)
├── projects.html           # Page 3: Projects & Achievements (Editable Cards)
├── contact.html            # Page 4: Contact Details & Inquiry Form
├── css/
│   └── style.css           # Modern responsive design & theme variables
├── js/
│   ├── data.js             # Central data store (localStorage persistence & defaults)
│   ├── theme.js            # Theme customization engine & customizer panel
│   └── main.js             # Dynamic rendering, modals, forms & edit mode
└── README.md               # Documentation and guide
```

---

## 💡 How to Customize in Code

All initial values are stored in `js/data.js`. You can edit phone numbers, emails, LinkedIn handles, bios, projects, and achievements directly in `js/data.js` to change the default content for all users.
