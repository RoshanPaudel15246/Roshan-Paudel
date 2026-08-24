// --- 1. SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- 2. DATASETS ---
const skillsData = [
  { category: "Cloud & Virtualization", skills: ["AWS (VPC, EC2, S3)", "CloudWatch & GuardDuty", "Hyper-V", "VMware"] },
  { category: "Systems & Networking", skills: ["Active Directory", "Cisco Routing & Switching", "DNS & DHCP", "Windows Server", "Linux"] },
  { category: "Scripting & Development", skills: ["PowerShell", "Bash", "JavaScript", "HTML5 & CSS3", "PHP"] },
  { category: "Databases & Tools", skills: ["PostgreSQL", "MySQL", "Git & GitHub", "Cloudflare DNS"] }
];

const projectsData = [
  {
    title: "Secure AWS Cloud Architecture",
    category: "cloud",
    description: "Designed a secure multi-tier AWS VPC infrastructure with public/private subnet segmentation, Application Load Balancers, and GuardDuty threat monitoring.",
    tags: ["AWS", "VPC", "ALB", "GuardDuty"],
    github: "https://github.com",
    demo: "#"
  },
  {
    title: "Community Marketplace Platform",
    category: "web",
    description: "Interactive dynamic web application featuring user authentication, product listings, and real-time database queries.",
    tags: ["JavaScript", "PostgreSQL", "REST APIs", "CSS Grid"],
    github: "https://github.com",
    demo: "#"
  },
  {
    title: "Automated SysAdmin Toolkit",
    category: "systems",
    description: "PowerShell automation scripts for Active Directory provisioning, automated backups, and system health reporting.",
    tags: ["PowerShell", "Active Directory", "Automation"],
    github: "https://github.com",
    demo: "#"
  }
];

// --- 3. APP INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  renderSkills();
  renderProjects("all");
  setupFiltering();
  setupThemeToggle();
  setupMobileNav();
  setupContactForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

function renderSkills() {
  const container = document.getElementById("skills-container");
  container.innerHTML = skillsData
    .map(cat => `
      <div class="skill-category">
        <h3>${cat.category}</h3>
        <div class="skill-pills">
          ${cat.skills.map(s => `<span class="skill-pill">${s}</span>`).join("")}
        </div>
      </div>
    `).join("");
}

function renderProjects(filter) {
  const container = document.getElementById("projects-container");
  const filtered = filter === "all" ? projectsData : projectsData.filter(p => p.category === filter);

  container.innerHTML = filtered
    .map(p => `
      <div class="project-card">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="tech-tags">
          ${p.tags.map(t => `<span>${t}</span>`).join("")}
        </div>
        <div class="project-links">
          <a href="${p.github}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>
          <a href="${p.demo}"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>
        </div>
      </div>
    `).join("");
}

function setupFiltering() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjects(btn.dataset.filter);
    });
  });
}

function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const html = document.documentElement;

  toggleBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    toggleBtn.innerHTML = next === "dark" ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  });
}

function setupMobileNav() {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");

  menuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
  });
}

// --- 4. FORM SUBMISSION WITH SECURITY VALIDATION ---
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot check: If bot filled out invisible input, silently ignore
    const botCheck = document.getElementById("honeypot").value;
    if (botCheck) {
      status.textContent = "Message sent!";
      form.reset();
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.style.color = "#ef4444";
      status.textContent = "Please fill in all fields.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.style.color = "var(--text-secondary)";
    status.textContent = "Saving message to database...";

    try {
      const { error } = await supabaseClient
        .from("contact_messages")
        .insert([{ name, email, message }]);

      if (error) throw error;

      status.style.color = "#22c55e";
      status.textContent = "Thank you! Your message has been stored successfully.";
      form.reset();
    } catch (err) {
      console.error("Submission error:", err.message);
      status.style.color = "#ef4444";
      status.textContent = "Failed to submit. Please try again later.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}