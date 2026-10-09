/**
 * Bharti Chopra Portfolio - Main Application Logic
 * Renders dynamic data across all 4 pages, handles interactive addition/removal
 * of skills, projects, achievements, contact form submissions, and inline editing.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initPageContent();
  initInlineEditing();
  initContactForm();

  // Listen for data updates across tabs/customizer
  window.addEventListener("portfolioDataUpdated", () => {
    initPageContent();
  });
});

/* --------------------------------------------------------------------------
   1. MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector(".mobile-toggle-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      toggleBtn.innerHTML = isOpen ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-bars"></i>`;
      toggleBtn.setAttribute("aria-expanded", isOpen);
    });

    // Close when clicking nav links
    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        toggleBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. PAGE CONTENT INITIALIZATION & RENDERING
   -------------------------------------------------------------------------- */
function initPageContent() {
  if (!window.PortfolioDataStore) return;
  const data = window.PortfolioDataStore.get();

  // Populate dynamic profile elements across pages
  document.querySelectorAll("[data-bind='profile.name']").forEach(el => el.textContent = data.profile.name);
  document.querySelectorAll("[data-bind='profile.title']").forEach(el => el.textContent = data.profile.title);
  document.querySelectorAll("[data-bind='profile.bio']").forEach(el => el.textContent = data.profile.bio);
  document.querySelectorAll("[data-bind='profile.phone']").forEach(el => el.textContent = data.profile.phone);
  document.querySelectorAll("[data-bind='profile.email']").forEach(el => el.textContent = data.profile.email);
  document.querySelectorAll("[data-bind='profile.linkedin']").forEach(el => el.textContent = data.profile.linkedin);
  document.querySelectorAll("[data-bind='profile.location']").forEach(el => el.textContent = data.profile.location);

  // Update hrefs for contact links
  document.querySelectorAll("[data-bind-href='profile.phone']").forEach(el => el.href = `tel:${data.profile.phone}`);
  document.querySelectorAll("[data-bind-href='profile.email']").forEach(el => el.href = `mailto:${data.profile.email}`);
  document.querySelectorAll("[data-bind-href='profile.linkedin']").forEach(el => el.href = data.profile.linkedinUrl);

  // Render Page-Specific Sections if present
  renderSkillsSection(data);
  renderProjectsSection(data);
  renderAchievementsSection(data);
  renderEducationSection(data);
}

/* --------------------------------------------------------------------------
   3. EDUCATION RENDERING
   -------------------------------------------------------------------------- */
function renderEducationSection(data) {
  const eduContainer = document.getElementById("education-timeline-container");
  if (!eduContainer || !data.education) return;

  eduContainer.innerHTML = data.education.map((item, idx) => `
    <div class="education-card" data-id="${item.id}">
      <div class="edu-icon-box">
        <i class="fa-solid ${item.icon === 'school' ? 'fa-school' : 'fa-graduation-cap'}"></i>
      </div>
      <div class="edu-content">
        <div class="edu-content-header">
          <div>
            <h3 class="edu-degree" data-editable="education.${idx}.degree">${item.degree}</h3>
            <div class="edu-institution" data-editable="education.${idx}.institution">
              <i class="fa-solid fa-building-columns"></i> ${item.institution}
            </div>
          </div>
          <span class="badge badge-accent">${item.period}</span>
        </div>
        <p class="edu-desc" data-editable="education.${idx}.description">${item.description}</p>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   4. SKILLS SECTION (Interactive Add & Remove)
   -------------------------------------------------------------------------- */
let activeSkillCategory = "All";

function renderSkillsSection(data) {
  const skillsGrid = document.getElementById("skills-grid-container");
  if (!skillsGrid || !data.skills) return;

  // Filter skills based on active category
  const filtered = activeSkillCategory === "All" 
    ? data.skills 
    : data.skills.filter(s => s.category === activeSkillCategory);

  if (filtered.length === 0) {
    skillsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
        <i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
        No skills found under "${activeSkillCategory}". Use the form below to add one!
      </div>
    `;
  } else {
    skillsGrid.innerHTML = filtered.map(skill => {
      const iconClass = getSkillIcon(skill.icon || skill.name);
      return `
        <div class="skill-card" data-skill-id="${skill.id}">
          <div class="skill-top">
            <div class="skill-info">
              <div class="skill-icon"><i class="fa-solid ${iconClass}"></i></div>
              <div>
                <h4 class="skill-name">${skill.name}</h4>
                <span class="skill-category-tag">${skill.category}</span>
              </div>
            </div>
            <button class="skill-remove-btn" title="Remove this skill" onclick="removeSkill('${skill.id}')" aria-label="Remove ${skill.name}">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="skill-level-bar" title="Proficiency: ${skill.level || 85}%">
            <div class="skill-level-progress" style="width: ${skill.level || 85}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Bind filter buttons
  document.querySelectorAll(".skill-category-filters .filter-btn").forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll(".skill-category-filters .filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      activeSkillCategory = e.target.dataset.category || "All";
      renderSkillsSection(window.PortfolioDataStore.get());
    };
  });

  // Bind Add Skill Form
  const addSkillForm = document.getElementById("add-skill-form");
  if (addSkillForm && !addSkillForm.dataset.bound) {
    addSkillForm.dataset.bound = "true";
    addSkillForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("new-skill-name");
      const categorySelect = document.getElementById("new-skill-category");
      const levelInput = document.getElementById("new-skill-level");

      const name = nameInput.value.trim();
      if (!name) return;

      const currentData = window.PortfolioDataStore.get();
      const newSkill = {
        id: "s_" + Date.now(),
        name: name,
        category: categorySelect ? categorySelect.value : "Tech & AI",
        level: levelInput ? parseInt(levelInput.value) : 85,
        icon: getSkillDefaultIcon(name)
      };

      currentData.skills.push(newSkill);
      window.PortfolioDataStore.save(currentData);
      nameInput.value = "";
      ThemeEngine.showToast(`✨ Added skill: "${name}"`, "success");
      renderSkillsSection(currentData);
    });
  }
}

// Global skill removal function
window.removeSkill = function(skillId) {
  const currentData = window.PortfolioDataStore.get();
  const index = currentData.skills.findIndex(s => s.id === skillId);
  if (index !== -1) {
    const removedName = currentData.skills[index].name;
    currentData.skills.splice(index, 1);
    window.PortfolioDataStore.save(currentData);
    ThemeEngine.showToast(`🗑️ Removed skill: "${removedName}"`, "info");
    renderSkillsSection(currentData);
  }
};

function getSkillIcon(nameOrKey) {
  const lower = (nameOrKey || "").toLowerCase();
  if (lower.includes("teamwork") || lower.includes("users")) return "fa-users";
  if (lower.includes("vibe") || lower.includes("code")) return "fa-laptop-code";
  if (lower.includes("ai") || lower.includes("bot") || lower.includes("cpu")) return "fa-microchip";
  if (lower.includes("video")) return "fa-film";
  if (lower.includes("photo") || lower.includes("camera") || lower.includes("image")) return "fa-camera-retro";
  if (lower.includes("drainage") || lower.includes("water") || lower.includes("droplet")) return "fa-droplet";
  if (lower.includes("bridge") || lower.includes("structure") || lower.includes("building")) return "fa-archway";
  return "fa-star";
}

function getSkillDefaultIcon(name) {
  return name.toLowerCase();
}

/* --------------------------------------------------------------------------
   5. PROJECTS SECTION (Editable Cards, Add/Edit/Delete, Preview Modal)
   -------------------------------------------------------------------------- */
let activeProjectCategory = "All";

function renderProjectsSection(data) {
  const grid = document.getElementById("projects-grid-container");
  if (!grid || !data.projects) return;

  const filtered = activeProjectCategory === "All"
    ? data.projects
    : data.projects.filter(p => (p.category || "") === activeProjectCategory);

  grid.innerHTML = filtered.map(p => `
    <article class="project-card" data-project-id="${p.id}">
      <div class="project-img-box">
        <img src="${p.image}" alt="${p.title}" class="project-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'">
        <div class="project-badge-overlay">
          <span class="badge badge-accent">${p.category || "Project"}</span>
        </div>
      </div>
      <div class="project-body">
        <h3 class="project-title" data-editable="project.${p.id}.title">${p.title}</h3>
        <p class="project-summary" data-editable="project.${p.id}.summary">${p.summary}</p>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="project-tag">#${t}</span>`).join('')}
        </div>
        <div class="project-footer-actions">
          <button class="btn btn-outline btn-sm" onclick="openProjectModal('${p.id}')">
            <i class="fa-solid fa-up-right-from-square"></i> Details
          </button>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn btn-outline btn-sm" onclick="openEditProjectModal('${p.id}')" title="Edit this project">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-outline btn-sm" onclick="deleteProject('${p.id}')" title="Delete project" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  // Category filter tabs
  document.querySelectorAll(".project-filter-btn").forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll(".project-filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      activeProjectCategory = e.target.dataset.category || "All";
      renderProjectsSection(window.PortfolioDataStore.get());
    };
  });
}

// View Project Detail Modal
window.openProjectModal = function(id) {
  const data = window.PortfolioDataStore.get();
  const p = data.projects.find(proj => proj.id === id);
  if (!p) return;

  const modalHtml = `
    <div class="modal-overlay open" id="project-detail-modal">
      <div class="modal-dialog">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap: 0.5rem;">
            <span class="badge badge-accent">${p.category || "Project"}</span>
            <h3 style="font-size: 1.25rem;">${p.title}</h3>
          </div>
          <button class="customizer-close-btn" onclick="closeModal('project-detail-modal')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="width: 100%; height: 240px; border-radius: var(--radius-sm); overflow: hidden;">
            <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.4rem; color: var(--primary-light);">Project Overview</h4>
            <p style="color: var(--text-secondary); line-height: 1.7;">${p.description || p.summary}</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.4rem; color: var(--primary-light);">Technologies & Themes</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
              ${(p.tags || []).map(t => `<span class="badge">#${t}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" onclick="openEditProjectModal('${p.id}'); closeModal('project-detail-modal');">
            <i class="fa-solid fa-pen"></i> Edit Project
          </button>
          <button class="btn btn-primary btn-sm" onclick="closeModal('project-detail-modal')">Close</button>
        </div>
      </div>
    </div>
  `;

  removeExistingModal("project-detail-modal");
  document.body.insertAdjacentHTML("beforeend", modalHtml);
};

// Add / Edit Project Modal
window.openAddProjectModal = function() {
  renderProjectFormModal();
};

window.openEditProjectModal = function(id) {
  const data = window.PortfolioDataStore.get();
  const p = data.projects.find(proj => proj.id === id);
  if (!p) return;
  renderProjectFormModal(p);
};

function renderProjectFormModal(existing = null) {
  const isEdit = !!existing;
  const modalHtml = `
    <div class="modal-overlay open" id="project-form-modal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem;"><i class="fa-solid ${isEdit ? 'fa-pen' : 'fa-plus'} text-primary"></i> ${isEdit ? 'Edit Project' : 'Add New Project'}</h3>
          <button class="customizer-close-btn" onclick="closeModal('project-form-modal')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="project-edit-form">
          <div class="modal-body">
            <div class="form-group">
              <label for="p-form-title">Project Title *</label>
              <input type="text" id="p-form-title" class="form-input" required value="${existing ? escapeHtml(existing.title) : ''}" placeholder="e.g. Smart Drainage System Design">
            </div>
            <div class="form-group">
              <label for="p-form-category">Category</label>
              <select id="p-form-category" class="form-select">
                <option value="Civil Engineering" ${existing && existing.category === 'Civil Engineering' ? 'selected' : ''}>Civil Engineering</option>
                <option value="Structural Design" ${existing && existing.category === 'Structural Design' ? 'selected' : ''}>Structural Design</option>
                <option value="AI & Tech" ${existing && existing.category === 'AI & Tech' ? 'selected' : ''}>AI & Tech</option>
                <option value="Sustainable Infra" ${existing && existing.category === 'Sustainable Infra' ? 'selected' : ''}>Sustainable Infra</option>
              </select>
            </div>
            <div class="form-group">
              <label for="p-form-summary">Short Summary *</label>
              <input type="text" id="p-form-summary" class="form-input" required value="${existing ? escapeHtml(existing.summary) : ''}" placeholder="Brief single-line summary">
            </div>
            <div class="form-group">
              <label for="p-form-desc">Full Description</label>
              <textarea id="p-form-desc" class="form-textarea" placeholder="Detailed engineering approach, outcomes, and methodology...">${existing ? escapeHtml(existing.description || '') : ''}</textarea>
            </div>
            <div class="form-group">
              <label for="p-form-tags">Tags (comma separated)</label>
              <input type="text" id="p-form-tags" class="form-input" value="${existing && existing.tags ? escapeHtml(existing.tags.join(', ')) : 'Civil Engineering, Tech'}" placeholder="Hydrology, AutoCAD, Python">
            </div>
            <div class="form-group">
              <label for="p-form-image">Cover Image URL</label>
              <input type="url" id="p-form-image" class="form-input" value="${existing ? escapeHtml(existing.image) : 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'}" placeholder="https://images.unsplash.com/...">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline btn-sm" onclick="closeModal('project-form-modal')">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm">${isEdit ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  removeExistingModal("project-form-modal");
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  document.getElementById("project-edit-form").onsubmit = (e) => {
    e.preventDefault();
    const data = window.PortfolioDataStore.get();
    const title = document.getElementById("p-form-title").value.trim();
    const category = document.getElementById("p-form-category").value;
    const summary = document.getElementById("p-form-summary").value.trim();
    const desc = document.getElementById("p-form-desc").value.trim();
    const tags = document.getElementById("p-form-tags").value.split(",").map(t => t.trim()).filter(Boolean);
    const image = document.getElementById("p-form-image").value.trim() || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80';

    if (isEdit) {
      const idx = data.projects.findIndex(p => p.id === existing.id);
      if (idx !== -1) {
        data.projects[idx] = { ...data.projects[idx], title, category, summary, description: desc, tags, image };
      }
    } else {
      data.projects.push({
        id: "p_" + Date.now(),
        title,
        category,
        summary,
        description: desc || summary,
        tags,
        image
      });
    }

    window.PortfolioDataStore.save(data);
    closeModal("project-form-modal");
    ThemeEngine.showToast(isEdit ? `✏️ Updated "${title}"` : `🎉 Created project "${title}"`, "success");
    renderProjectsSection(data);
  };
}

window.deleteProject = function(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    const data = window.PortfolioDataStore.get();
    data.projects = data.projects.filter(p => p.id !== id);
    window.PortfolioDataStore.save(data);
    ThemeEngine.showToast("🗑️ Project deleted", "info");
    renderProjectsSection(data);
  }
};

/* --------------------------------------------------------------------------
   6. ACHIEVEMENTS SECTION (Add / Edit / Remove)
   -------------------------------------------------------------------------- */
function renderAchievementsSection(data) {
  const container = document.getElementById("achievements-list-container");
  if (!container || !data.achievements) return;

  container.innerHTML = data.achievements.map((item, idx) => `
    <div class="achievement-card" data-id="${item.id}">
      <div class="achievement-trophy-box">
        <i class="fa-solid fa-trophy"></i>
      </div>
      <div>
        <h4 class="achievement-title" data-editable="achievement.${idx}.title">${item.title}</h4>
        <p class="achievement-desc" data-editable="achievement.${idx}.description">${item.description}</p>
      </div>
      <div class="achievement-meta">
        <span class="badge badge-accent">${item.category || "Honors"}</span>
        <span class="text-muted" style="font-size: 0.8rem; font-weight: 600;">${item.year || "2025"}</span>
        <button class="btn btn-outline btn-sm edit-mode-only" onclick="deleteAchievement('${item.id}')" title="Delete achievement" style="margin-top: 0.35rem; color: #ef4444; border-color: rgba(239,68,68,0.4);">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

window.openAddAchievementModal = function() {
  const title = prompt("Enter Achievement Title:");
  if (!title) return;
  const description = prompt("Enter Achievement Description:", "Recognized for excellence in civil engineering & tech.");
  const year = prompt("Enter Year:", new Date().getFullYear().toString());

  const data = window.PortfolioDataStore.get();
  data.achievements.push({
    id: "a_" + Date.now(),
    title,
    description: description || title,
    year: year || "2026",
    category: "Recognition"
  });

  window.PortfolioDataStore.save(data);
  ThemeEngine.showToast(`🏆 Added achievement: "${title}"`, "success");
  renderAchievementsSection(data);
};

window.deleteAchievement = function(id) {
  const data = window.PortfolioDataStore.get();
  data.achievements = data.achievements.filter(a => a.id !== id);
  window.PortfolioDataStore.save(data);
  ThemeEngine.showToast("🗑️ Achievement removed", "info");
  renderAchievementsSection(data);
};

/* --------------------------------------------------------------------------
   7. INLINE CONTENT EDITING (Live In-Browser Customization)
   -------------------------------------------------------------------------- */
function initInlineEditing() {
  document.body.addEventListener("click", (e) => {
    const theme = ThemeEngine.get();
    if (!theme.editMode) return;

    const target = e.target.closest("[data-editable]");
    if (!target) return;

    const fieldKey = target.dataset.editable;
    const currentVal = target.innerText.trim();
    const newVal = prompt(`Edit text for: ${fieldKey}`, currentVal);

    if (newVal !== null && newVal.trim() !== "" && newVal !== currentVal) {
      target.innerText = newVal;
      saveEditedField(fieldKey, newVal);
      ThemeEngine.showToast(`💾 Saved changes to ${fieldKey}`, "success");
    }
  });
}

function saveEditedField(fieldKey, value) {
  const data = window.PortfolioDataStore.get();
  const parts = fieldKey.split(".");

  if (parts.length === 2 && parts[0] === "profile") {
    data.profile[parts[1]] = value;
  } else if (parts[0] === "education" && parts.length === 3) {
    const idx = parseInt(parts[1]);
    if (data.education[idx]) data.education[idx][parts[2]] = value;
  }

  window.PortfolioDataStore.save(data);
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM HANDLING & MESSAGE STORAGE
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");
    const submitBtn = document.getElementById("contact-submit-btn");

    if (!nameInput.value || !emailInput.value || !messageInput.value) {
      ThemeEngine.showToast("⚠️ Please fill in all required fields.", "info");
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
    submitBtn.disabled = true;

    // Simulate response delay and record locally
    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem("bharti_portfolio_messages") || "[]");
      messages.push({
        id: "msg_" + Date.now(),
        name: nameInput.value,
        email: emailInput.value,
        subject: subjectInput ? subjectInput.value : "Inquiry",
        message: messageInput.value,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("bharti_portfolio_messages", JSON.stringify(messages));

      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Sent!`;
      ThemeEngine.showToast("💌 Thank you! Your message has been sent to Bharti.", "success");
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }, 2000);
    }, 700);
  });
}

/* --------------------------------------------------------------------------
   9. MODAL HELPERS & UTILITIES
   -------------------------------------------------------------------------- */
window.closeModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.remove("open");
    setTimeout(() => el.remove(), 250);
  }
};

function removeExistingModal(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Copy to clipboard helper
window.copyToClipboard = function(text, label = "Item") {
  navigator.clipboard.writeText(text).then(() => {
    ThemeEngine.showToast(`📋 Copied ${label} to clipboard!`, "success");
  }).catch(() => {
    ThemeEngine.showToast(`Selected: ${text}`, "info");
  });
};
