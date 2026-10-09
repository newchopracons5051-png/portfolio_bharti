/**
 * Bharti Chopra Portfolio - Central Data Store
 * Contains profile, education, skills, projects, and achievements.
 * Supports localStorage persistence, export, import, and reset.
 */

const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Bharti Chopra",
    title: "Student of Civil Engineering",
    tagline: "Bridging Sustainable Civil Engineering with Modern Vibe Coding & AI",
    location: "Jaipur, Rajasthan, India",
    school: "NK Public School",
    university: "JECRC University",
    bio: "I am from Jaipur city and did my schooling from NK Public School. Currently pursuing Civil Engineering at JECRC University. Passionate about blending traditional civil engineering—such as sustainable urban drainage and structural design—with modern vibe coding, AI workflows, and creative media editing.",
    phone: "+91-XXXXXXXXXX",
    email: "bhartichopra@example.com",
    linkedin: "linkedin.com/in/bhartichopra",
    linkedinUrl: "https://linkedin.com/in/bhartichopra",
    githubUrl: "https://github.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    status: "Open to Internships & Projects"
  },
  education: [
    {
      id: "edu-1",
      degree: "B.Tech in Civil Engineering",
      institution: "JECRC University, Jaipur",
      period: "Currently Pursuing (2023 - 2027)",
      description: "Focusing on sustainable urban infrastructure, structural load analysis, fluid dynamics, modern construction materials, and AI applications in engineering.",
      badge: "University Education",
      icon: "graduation-cap"
    },
    {
      id: "edu-2",
      degree: "Higher Secondary & Secondary Education",
      institution: "NK Public School, Jaipur",
      period: "Schooling Completed",
      description: "Formative schooling in Jaipur city with strong academic focus on science, mathematics, computer foundations, and active co-curricular participation.",
      badge: "Schooling Foundation",
      icon: "school"
    }
  ],
  skills: [
    { id: "s1", name: "Good teamwork", category: "Core & Soft Skills", level: 95, icon: "users" },
    { id: "s2", name: "Vibe coding", category: "Tech & AI", level: 92, icon: "code" },
    { id: "s3", name: "AI generalist", category: "Tech & AI", level: 90, icon: "cpu" },
    { id: "s4", name: "Video editing", category: "Creative Media", level: 88, icon: "video" },
    { id: "s5", name: "Photo editing", category: "Creative Media", level: 86, icon: "camera" },
    { id: "s6", name: "Sustainable Drainage Design", category: "Civil Engineering", level: 90, icon: "droplet" },
    { id: "s7", name: "Bridge Load Analysis", category: "Civil Engineering", level: 84, icon: "layers" },
    { id: "s8", name: "Problem Solving", category: "Core & Soft Skills", level: 92, icon: "check-circle" }
  ],
  projects: [
    {
      id: "p1",
      title: "Smart Drainage System Design",
      summary: "Designed a sustainable urban drainage model for flood mitigation & water harvesting.",
      description: "Conceived and modeled an eco-conscious Sustainable Urban Drainage System (SuDS) tailored for semi-arid metropolitan zones like Jaipur. Integrated porous concrete paving, natural retention bioswales, and IoT overflow warning indicators to safeguard low-lying areas during heavy monsoon rainfall while recharging ground aquifers.",
      tags: ["Civil Engineering", "Sustainable Drainage", "Urban Planning", "Hydrology"],
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
      featured: true,
      category: "Civil Engineering"
    },
    {
      id: "p2",
      title: "Bridge Load Analysis",
      summary: "Conducted structural analysis using simulation tools to evaluate dynamic stresses.",
      description: "Modeled multi-span bridge truss configurations under varying static and moving vehicle load distributions. Utilized computational structural simulation tools to evaluate bending moments, shear stresses, and harmonic resonance, ensuring compliance with standard safety and load limits.",
      tags: ["Structural Analysis", "Bridge Engineering", "Simulation", "Mechanics"],
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80",
      featured: true,
      category: "Structural Design"
    },
    {
      id: "p3",
      title: "AI-based Construction Cost Estimator",
      summary: "Built a prototype tool for predicting costs of materials and labor.",
      description: "Built an intelligent prototype tool combining civil engineering rate estimation principles with modern AI models. Computes predictive cost projections for structural steel, cement, aggregates, and skilled labor based on historical market trends and project specs, drastically reducing early-stage budget estimation overhead.",
      tags: ["AI Generalist", "Vibe Coding", "Cost Estimation", "Smart Tech"],
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      featured: true,
      category: "AI & Tech"
    }
  ],
  achievements: [
    {
      id: "a1",
      title: "Won 1st prize in JECRC Civil Tech Fest",
      category: "Tech Competition",
      year: "2025",
      description: "Secured first position competing against top engineering colleges with a working demonstration of an eco-friendly urban drainage and water conservation prototype."
    },
    {
      id: "a2",
      title: "Published paper on sustainable concrete in student journal",
      category: "Research Publication",
      year: "2025",
      description: "Co-authored and published an academic paper assessing fly-ash and slag geopolymer blends as sustainable substitutes for OPC concrete in modern urban construction."
    },
    {
      id: "a3",
      title: "Organized inter-college hackathon on AI in construction",
      category: "Leadership & Organization",
      year: "2026",
      description: "Led the organizing committee for an inter-college tech sprint uniting civil engineering students and AI programmers to prototype automated structural inspection solutions."
    }
  ]
};

const STORAGE_KEY = "bharti_portfolio_data_v1";

// Load portfolio data from localStorage or fallback to defaults
function getPortfolioData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge in any missing top-level keys
      return { ...DEFAULT_PORTFOLIO_DATA, ...parsed };
    }
  } catch (err) {
    console.warn("Could not load stored portfolio data, using default:", err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

// Save portfolio data to localStorage
function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("portfolioDataUpdated", { detail: data }));
    return true;
  } catch (err) {
    console.error("Failed to save portfolio data to localStorage:", err);
    return false;
  }
}

// Reset portfolio data to original defaults
function resetPortfolioData() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("portfolioDataUpdated", { detail: DEFAULT_PORTFOLIO_DATA }));
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

// Export portfolio data as JSON file download
function exportPortfolioDataJSON() {
  const data = getPortfolioData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bharti_portfolio_data_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import portfolio data from JSON string or file
function importPortfolioDataJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.profile || !parsed.skills) {
      throw new Error("Invalid portfolio data structure.");
    }
    savePortfolioData(parsed);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Global exposure
window.PortfolioDataStore = {
  get: getPortfolioData,
  save: savePortfolioData,
  reset: resetPortfolioData,
  exportJSON: exportPortfolioDataJSON,
  importJSON: importPortfolioDataJSON,
  defaults: DEFAULT_PORTFOLIO_DATA
};
