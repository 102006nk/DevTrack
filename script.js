// ==========================================
// DEVTRACK - SDE ROADMAP TRACKER
// Built with HTML, CSS and JavaScript
// ==========================================

const STORAGE_KEY = "devtrack-data-v1";

// ---------- INITIAL ROADMAP DATA ----------

const defaultState = {
  startDate: new Date().toISOString().slice(0, 10),

  dsa: [
    { name: "Time Complexity", month: 1, status: "In progress", solved: 0, target: 3, difficulty: "Easy", notes: "" },
    { name: "Arrays", month: 1, status: "Not started", solved: 0, target: 8, difficulty: "Easy", notes: "" },
    { name: "Strings", month: 1, status: "Not started", solved: 0, target: 6, difficulty: "Easy", notes: "" },
    { name: "Searching & Sorting", month: 1, status: "Not started", solved: 0, target: 8, difficulty: "Easy", notes: "" },
    { name: "Two Pointers", month: 2, status: "Not started", solved: 0, target: 8, difficulty: "Medium", notes: "" },
    { name: "Hashing", month: 2, status: "Not started", solved: 0, target: 7, difficulty: "Medium", notes: "" },
    { name: "Recursion", month: 2, status: "Not started", solved: 0, target: 7, difficulty: "Medium", notes: "" },
    { name: "Linked Lists", month: 3, status: "Not started", solved: 0, target: 7, difficulty: "Medium", notes: "" },
    { name: "Stacks & Queues", month: 3, status: "Not started", solved: 0, target: 7, difficulty: "Medium", notes: "" },
    { name: "Trees & Heaps", month: 4, status: "Not started", solved: 0, target: 10, difficulty: "Medium", notes: "" },
    { name: "Greedy Algorithms", month: 4, status: "Not started", solved: 0, target: 5, difficulty: "Medium", notes: "" },
    { name: "Graphs", month: 5, status: "Not started", solved: 0, target: 8, difficulty: "Medium", notes: "" },
    { name: "Dynamic Programming", month: 5, status: "Not started", solved: 0, target: 8, difficulty: "Hard", notes: "" },
    { name: "Revision & Mock Interviews", month: 6, status: "Not started", solved: 0, target: 10, difficulty: "Mixed", notes: "" }
  ],

  web: [
    { name: "HTML", month: 1, status: "Not started", notes: "" },
    { name: "CSS & Responsive Design", month: 1, status: "Not started", notes: "" },
    { name: "JavaScript Fundamentals", month: 2, status: "Not started", notes: "" },
    { name: "DOM & Events", month: 2, status: "Not started", notes: "" },
    { name: "APIs & Async JavaScript", month: 3, status: "Not started", notes: "" },
    { name: "React", month: 4, status: "Not started", notes: "" },
    { name: "Node.js & Express", month: 5, status: "Not started", notes: "" },
    { name: "Database & CRUD", month: 5, status: "Not started", notes: "" },
    { name: "Authentication Basics", month: 5, status: "Not started", notes: "" },
    { name: "Full-Stack Project", month: 6, status: "Not started", notes: "" },
    { name: "Deployment & README", month: 6, status: "Not started", notes: "" }
  ],

  placement: [
    { name: "Java & OOP", status: "Not started", notes: "" },
    { name: "DBMS & SQL", status: "Not started", notes: "" },
    { name: "Operating Systems", status: "Not started", notes: "" },
    { name: "Computer Networks", status: "Not started", notes: "" },
    { name: "Resume Preparation", status: "Not started", notes: "" },
    { name: "Technical Mock Interviews", status: "Not started", notes: "" },
    { name: "HR Interview Practice", status: "Not started", notes: "" }
  ],

  dailyLogs: [],
  dailyTasks: {},

  projects: [
    {
      name: "Personal Portfolio",
      tech: "HTML, CSS",
      status: "Planned",
      progress: 0,
      link: "",
      notes: "Build a portfolio with your skills and projects."
    },
    {
      name: "Student Task Manager",
      tech: "JavaScript",
      status: "Planned",
      progress: 0,
      link: "",
      notes: "Create tasks, mark them complete and save progress."
    },
    {
      name: "Full-Stack Student App",
      tech: "React, Node.js, Database",
      status: "Planned",
      progress: 0,
      link: "",
      notes: "Build and deploy a full-stack application."
    }
  ]
};

// ---------- LOAD AND SAVE DATA ----------

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return JSON.parse(JSON.stringify(defaultState));
    }

    const parsed = JSON.parse(saved);

    // Merge saved data with defaults so new sections
    // can be introduced in future versions.
    return {
      ...JSON.parse(JSON.stringify(defaultState)),
      ...parsed
    };
  } catch (error) {
    console.error("Could not load DevTrack data:", error);
    return JSON.parse(JSON.stringify(defaultState));
  }
}

let state = loadState();
let currentView = "dashboard";

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Could not save DevTrack data:", error);
    showToast("Unable to save. Export a backup and check browser storage.");
    return false;
  }
}

// ---------- HELPER FUNCTIONS ----------

const $ = (selector) => document.querySelector(selector);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function today() {
  return new Date().toLocaleDateString("en-CA");
}

// Use a local date string instead of UTC for the current day.
function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function percentage(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

function completedCount(items) {
  return items.filter(item => item.status === "Completed").length;
}

function totalMinutes() {
  return state.dailyLogs.reduce((sum, log) => {
    return sum +
      Number(log.dsa || 0) +
      Number(log.web || 0) +
      Number(log.revision || 0);
  }, 0);
}

function studyDays() {
  return new Set(
    state.dailyLogs
      .filter(log =>
        Number(log.dsa || 0) +
        Number(log.web || 0) +
        Number(log.revision || 0) > 0
      )
      .map(log => log.date)
  ).size;
}

function roadmapDay() {
  const start = new Date(`${state.startDate}T00:00:00`);
  const now = new Date(`${localDateString()}T00:00:00`);

  return Math.max(1, Math.floor((now - start) / 86400000) + 1);
}

function roadmapMonth() {
  return Math.min(6, Math.ceil(roadmapDay() / 30));
}

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function pill(status) {
  let className = "";

  if (status === "Completed" || status === "Done") {
    className = "green";
  } else if (status === "In progress") {
    className = "orange";
  }

  return `<span class="pill ${className}">${escapeHTML(status)}</span>`;
}

function statusOptions(selected) {
  return ["Not started", "In progress", "Completed"]
    .map(status => `
      <option value="${status}" ${selected === status ? "selected" : ""}>
        ${status}
      </option>
    `).join("");
}

// ---------- NAVIGATION AND RENDERING ----------

const pageTitles = {
  dashboard: "Dashboard",
  dsa: "DSA Tracker",
  web: "Web Development",
  daily: "Daily Study Log",
  projects: "Projects",
  placement: "Placement Preparation"
};

function navigate(view) {
  currentView = view;
  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function render() {
  $("#page-title").textContent = pageTitles[currentView];

  $("#today-date").textContent =
    new Date().toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === currentView
    );
  });

  const renderers = {
    dashboard: renderDashboard,
    dsa: renderDSA,
    web: renderWeb,
    daily: renderDaily,
    projects: renderProjects,
    placement: renderPlacement
  };

  $("#app-content").innerHTML = renderers[currentView]();

  bindEvents();
}

// ---------- DASHBOARD ----------

function renderDashboard() {
  const solved = state.dsa.reduce(
    (sum, item) => sum + Number(item.solved || 0), 0
  );

  const target = state.dsa.reduce(
    (sum, item) => sum + Number(item.target || 0), 0
  );

  const dsaDone = completedCount(state.dsa);
  const webDone = completedCount(state.web);
  const placementDone = completedCount(state.placement);

  const allDone = dsaDone + webDone + placementDone;

  const allTotal =
    state.dsa.length +
    state.web.length +
    state.placement.length;

  const checks = state.dailyTasks[localDateString()] || {};

  const tasks = [
    ["dsa", "DSA practice", "60 minutes · solve problems"],
    ["web", "Web development", "45 minutes · learn and build"],
    ["revision", "Revision", "15 minutes · review concepts"]
  ];

  const week = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const key = localDateString(date);

    const log = state.dailyLogs.find(item => item.date === key);

    const minutes = log
      ? Number(log.dsa || 0) +
        Number(log.web || 0) +
        Number(log.revision || 0)
      : 0;

    week.push({
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      minutes,
      today: i === 0
    });
  }

  const maxMinutes = Math.max(120, ...week.map(day => day.minutes));

  return `
    <section class="welcome">
      <div>
        <h2>Small steps, big future! ✨</h2>
        <p>
          You're on Day ${roadmapDay()} of your six-month SDE roadmap.
          Stay consistent and keep learning.
        </p>
      </div>
      <div class="welcome-icon">🚀</div>
    </section>

    <section class="stats">
      <div class="stat-card">
        <div class="stat-label">
          DSA problems solved <span class="stat-icon">⌘</span>
        </div>
        <div class="stat-number">${solved}<span style="font-size:14px;color:#888"> / ${target}</span></div>
        <div class="stat-note">Your practice target</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">
          Web topics done <span class="stat-icon">◇</span>
        </div>
        <div class="stat-number">${webDone}<span style="font-size:14px;color:#888"> / ${state.web.length}</span></div>
        <div class="stat-note">Learn by building</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">
          Study time <span class="stat-icon">◷</span>
        </div>
        <div class="stat-number">${(totalMinutes() / 60).toFixed(1)}<span style="font-size:14px;color:#888"> hrs</span></div>
        <div class="stat-note">${studyDays()} days logged</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">
          Roadmap progress <span class="stat-icon">↗</span>
        </div>
        <div class="stat-number">${percentage(allDone, allTotal)}%</div>
        <div class="stat-note">${allDone} of ${allTotal} topics completed</div>
      </div>
    </section>

    <section class="grid-2">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>Your roadmap</h2>
            <p>Track your learning progress.</p>
          </div>
          <span class="pill">Month ${roadmapMonth()} of 6</span>
        </div>

        ${progressRow("DSA with Java", dsaDone, state.dsa.length)}
        ${progressRow("Web development", webDone, state.web.length)}
        ${progressRow("Placement preparation", placementDone, state.placement.length)}
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h2>Today's focus</h2>
            <p>Your two-hour daily study plan.</p>
          </div>
          <span class="pill green">${Object.values(checks).filter(Boolean).length}/3</span>
        </div>

        <div class="task-list">
          ${tasks.map(([key, title, subtitle]) => `
            <label class="task ${checks[key] ? "done" : ""}">
              <input type="checkbox"
                data-daily-task="${key}"
                ${checks[key] ? "checked" : ""}>
              <div>
                <strong>${title}</strong>
                <small>${subtitle}</small>
              </div>
            </label>
          `).join("")}
        </div>

        <div style="margin-top:14px">
          <button class="btn secondary" data-go="daily">
            Log study time →
          </button>
        </div>
      </div>
    </section>

    <section class="grid-2">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>Study time this week</h2>
            <p>Minutes recorded for each day.</p>
          </div>
        </div>

        <div class="week-bars">
          ${week.map(day => `
            <div class="bar-column">
              <span class="bar-value">${day.minutes ? day.minutes + "m" : "—"}</span>
              <div class="bar ${day.today ? "today" : ""}"
                style="height:${Math.max(4, day.minutes / maxMinutes * 95)}px">
              </div>
              <span class="bar-label">${day.label}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h2>Quick actions</h2>
            <p>Update your progress.</p>
          </div>
        </div>

        <div class="task-list">
          <button class="task" data-go="dsa">
            <span class="stat-icon">⌘</span>
            <div><strong>Update DSA</strong><small>Problems and topics</small></div>
          </button>

          <button class="task" data-go="web">
            <span class="stat-icon">◇</span>
            <div><strong>Update web development</strong><small>Track new concepts</small></div>
          </button>

          <button class="task" data-go="projects">
            <span class="stat-icon">▣</span>
            <div><strong>Review projects</strong><small>Build your portfolio</small></div>
          </button>
        </div>
      </div>
    </section>
  `;
}

function progressRow(title, done, total) {
  return `
    <div class="progress-row">
      <div class="progress-label">
        <span>${title}</span>
        <span>${done} / ${total}</span>
      </div>
      <div class="progress-line">
        <span style="width:${percentage(done, total)}%"></span>
      </div>
    </div>
  `;
}

// ---------- DSA TRACKER ----------

function renderDSA() {
  const solved = state.dsa.reduce(
    (sum, item) => sum + Number(item.solved || 0), 0
  );

  const target = state.dsa.reduce(
    (sum, item) => sum + Number(item.target || 0), 0
  );

  return `
    <div class="notice">
      Track each DSA topic, record problems solved, and save notes
      about mistakes or patterns you want to revise.
    </div>

    <section class="stats">
      <div class="stat-card">
        <div class="stat-label">Problems solved</div>
        <div class="stat-number">${solved}</div>
        <div class="stat-note">Across all topics</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Practice target</div>
        <div class="stat-number">${target}</div>
        <div class="stat-note">Planned problem count</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Topics completed</div>
        <div class="stat-number">${completedCount(state.dsa)} / ${state.dsa.length}</div>
        <div class="stat-note">DSA learning path</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Problem target progress</div>
        <div class="stat-number">${percentage(solved, target)}%</div>
        <div class="stat-note">Based on solved count</div>
      </div>
    </section>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>DSA learning path</h2>
          <p>Java · algorithms · problem-solving</p>
        </div>
        <div class="actions">
          <button class="btn" data-add-topic="dsa">+ Add topic</button>
          <button class="btn secondary" data-export>Export backup</button>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Status</th>
              <th>Solved</th>
              <th>Target</th>
              <th>Difficulty</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.dsa.map((item, i) => `
              <tr>
                <td>
                  <strong>${escapeHTML(item.name)}</strong><br>
                  <small class="muted">Month ${item.month}</small>
                </td>

                <td>
                  <select data-dsa-status="${i}">
                    ${statusOptions(item.status)}
                  </select>
                </td>

                <td>
                  <input type="number" min="0" max="99999"
                    value="${Number(item.solved) || 0}"
                    data-dsa-solved="${i}" aria-label="Problems solved">
                </td>

                <td>${item.target}</td>

                <td>
                  <select data-dsa-difficulty="${i}">
                    ${["Easy", "Medium", "Hard", "Mixed"].map(level => `
                      <option ${item.difficulty === level ? "selected" : ""}>
                        ${level}
                      </option>
                    `).join("")}
                  </select>
                </td>

                <td>
                  <button class="btn ghost" data-edit-dsa="${i}">Notes</button>
                </td>
                <td><button class="btn danger" data-delete-topic="dsa" data-topic-index="${i}">Delete</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- WEB DEVELOPMENT TRACKER ----------

function renderWeb() {
  return `
    <section class="welcome">
      <div>
        <h2>Learn it. Build it. Ship it. 🌐</h2>
        <p>Move from HTML and CSS to JavaScript, React and full-stack projects.</p>
      </div>
      <div class="welcome-icon">🧩</div>
    </section>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>Web development roadmap</h2>
          <p>${completedCount(state.web)} of ${state.web.length} topics completed</p>
        </div>
        <div class="actions">
          <span class="pill">${percentage(completedCount(state.web), state.web.length)}%</span>
          <button class="btn" data-add-topic="web">+ Add topic</button>
        </div>
      </div>

      <div class="progress-line">
        <span style="width:${percentage(completedCount(state.web), state.web.length)}%"></span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Topic</th><th>Status</th><th>Notes</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${state.web.map((item, i) => `
              <tr>
                <td>
                  <strong>${escapeHTML(item.name)}</strong><br>
                  <small class="muted">Month ${item.month}</small>
                </td>
                <td>
                  <select data-web-status="${i}">
                    ${statusOptions(item.status)}
                  </select>
                </td>
                <td>
                  <button class="btn ghost" data-edit-web="${i}">Notes</button>
                </td>
                <td><button class="btn danger" data-delete-topic="web" data-topic-index="${i}">Delete</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- DAILY STUDY LOG ----------

function renderDaily() {
  const date = localDateString();

  const log = state.dailyLogs.find(item => item.date === date) || {
    date,
    dsa: 0,
    web: 0,
    revision: 0,
    note: ""
  };

  const recent = [...state.dailyLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return `
    <section class="grid-2">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>Log your study time</h2>
            <p>Your daily target is 120 minutes.</p>
          </div>
          <span class="pill green">2 hours/day</span>
        </div>

        <form id="daily-form">
          <div class="form-grid">
            <div class="field">
              <label for="log-date">Study date</label>
              <input id="log-date" type="date"
                value="${escapeHTML(log.date)}" required>
            </div>

            <div class="field">
              <label for="log-dsa">DSA minutes</label>
              <input id="log-dsa" type="number" min="0" max="1440"
                value="${Number(log.dsa) || 0}" required>
            </div>

            <div class="field">
              <label for="log-web">Web development minutes</label>
              <input id="log-web" type="number" min="0" max="1440"
                value="${Number(log.web) || 0}" required>
            </div>

            <div class="field">
              <label for="log-revision">Revision minutes</label>
              <input id="log-revision" type="number" min="0" max="1440"
                value="${Number(log.revision) || 0}" required>
            </div>

            <div class="field" style="grid-column:1/-1">
              <label for="log-note">What did you learn today?</label>
              <textarea id="log-note"
                placeholder="Write down concepts, mistakes or wins...">${escapeHTML(log.note || "")}</textarea>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn" type="submit">Save study log</button>
          </div>
        </form>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h2>Your totals</h2>
            <p>Calculated from your saved study logs.</p>
          </div>
        </div>

        <div class="progress-row">
          <div class="progress-label">
            <span>Total study time</span>
            <span>${(totalMinutes() / 60).toFixed(1)} hours</span>
          </div>
        </div>

        <div class="progress-row">
          <div class="progress-label">
            <span>Days studied</span>
            <span>${studyDays()}</span>
          </div>
        </div>

        <div class="notice">
          Tip: use your notes to record problems you got wrong
          and concepts you want to revise.
        </div>

        <button class="btn secondary" data-export>Export backup</button>
      </div>
    </section>

    <div class="section-title">
      <div>
        <h2>Recent study logs</h2>
        <p>Your latest saved sessions.</p>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>DSA</th>
              <th>Web</th>
              <th>Revision</th>
              <th>Total</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            ${recent.length ? recent.map(item => {
              const total =
                Number(item.dsa || 0) +
                Number(item.web || 0) +
                Number(item.revision || 0);

              return `
                <tr>
                  <td>${escapeHTML(item.date)}</td>
                  <td>${Number(item.dsa) || 0} min</td>
                  <td>${Number(item.web) || 0} min</td>
                  <td>${Number(item.revision) || 0} min</td>
                  <td><strong>${total} min</strong></td>
                  <td>${escapeHTML(item.note || "—")}</td>
                </tr>
              `;
            }).join("") : `
              <tr>
                <td colspan="6" class="empty">
                  No study logs yet. Save your first log above!
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- PROJECT TRACKER ----------

function renderProjects() {
  return `
    <div class="section-title">
      <div>
        <h2>Your projects</h2>
        <p>Build a portfolio of practical work.</p>
      </div>
      <button class="btn" data-add-project>+ Add project</button>
    </div>

    <div class="project-grid">
      ${state.projects.map((project, i) => `
        <article class="project-card">
          <div style="display:flex;justify-content:space-between;gap:10px">
            <h3>${escapeHTML(project.name)}</h3>
            ${pill(
              project.status === "Done"
                ? "Completed"
                : project.status === "In progress"
                  ? "In progress"
                  : "Not started"
            )}
          </div>

          <p>${escapeHTML(project.notes || "No notes yet.")}</p>

          <div class="progress-label">
            <span>Progress</span>
            <span>${Number(project.progress) || 0}%</span>
          </div>

          <div class="progress-line">
            <span style="width:${Math.max(0, Math.min(100, Number(project.progress) || 0))}%"></span>
          </div>

          <small class="muted">${escapeHTML(project.tech || "Technologies not set")}</small>

          ${project.link ? `
            <p>
              <a href="${safeProjectURL(project.link)}"
                 target="_blank" rel="noopener noreferrer">
                Open project ↗
              </a>
            </p>
          ` : ""}

          <div class="project-meta">
            <select data-project-status="${i}" aria-label="Project status">
              ${["Planned", "In progress", "Done"].map(status => `
                <option ${project.status === status ? "selected" : ""}>
                  ${status}
                </option>
              `).join("")}
            </select>

            <div class="actions">
              <button class="btn ghost" data-edit-project="${i}">Edit</button>
              <button class="btn danger" data-delete-project="${i}">Delete</button>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function safeProjectURL(value) {
  try {
    const url = new URL(value, window.location.href);

    if (["http:", "https:"].includes(url.protocol)) {
      return escapeHTML(url.href);
    }
  } catch (error) {
    return "#";
  }

  return "#";
}

// ---------- PLACEMENT PREPARATION ----------

function renderPlacement() {
  return `
    <div class="notice">
      Keep placement preparation alongside DSA and web development.
      Track CS fundamentals, resume preparation and mock interviews.
    </div>

    <section class="stats">
      <div class="stat-card">
        <div class="stat-label">Completed topics</div>
        <div class="stat-number">${completedCount(state.placement)} / ${state.placement.length}</div>
        <div class="stat-note">Placement checklist</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Progress</div>
        <div class="stat-number">${percentage(completedCount(state.placement), state.placement.length)}%</div>
        <div class="stat-note">Update as you learn</div>
      </div>
    </section>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>Placement checklist</h2>
          <p>Prepare for technical interviews and campus placements.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Topic</th><th>Status</th><th>Notes</th></tr>
          </thead>

          <tbody>
            ${state.placement.map((item, i) => `
              <tr>
                <td><strong>${escapeHTML(item.name)}</strong></td>
                <td>
                  <select data-placement-status="${i}">
                    ${statusOptions(item.status)}
                  </select>
                </td>
                <td>
                  <button class="btn ghost" data-edit-placement="${i}">Notes</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- EVENT HANDLERS ----------

function bindEvents() {
  // Navigate between sections.
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.go));
  });

  // Daily checklist.
  document.querySelectorAll("[data-daily-task]").forEach(input => {
    input.addEventListener("change", () => {
      const key = localDateString();

      if (!state.dailyTasks[key]) {
        state.dailyTasks[key] = {};
      }

      state.dailyTasks[key][input.dataset.dailyTask] = input.checked;

      saveState();
      render();
    });
  });

  // DSA status.
  document.querySelectorAll("[data-dsa-status]").forEach(input => {
    input.addEventListener("change", () => {
      state.dsa[Number(input.dataset.dsaStatus)].status = input.value;
      saveState();
      render();
      showToast("DSA progress saved!");
    });
  });

  // DSA problem count.
  document.querySelectorAll("[data-dsa-solved]").forEach(input => {
    input.addEventListener("change", () => {
      state.dsa[Number(input.dataset.dsaSolved)].solved =
        Math.max(0, Number(input.value) || 0);

      saveState();
      render();
      showToast("Problem count saved!");
    });
  });

  // DSA difficulty.
  document.querySelectorAll("[data-dsa-difficulty]").forEach(input => {
    input.addEventListener("change", () => {
      state.dsa[Number(input.dataset.dsaDifficulty)].difficulty = input.value;
      saveState();
      showToast("Difficulty updated!");
    });
  });

  // Notes.
  document.querySelectorAll("[data-edit-dsa]").forEach(button => {
    button.addEventListener("click", () => {
      editNotes(state.dsa, Number(button.dataset.editDsa));
    });
  });

  document.querySelectorAll("[data-edit-web]").forEach(button => {
    button.addEventListener("click", () => {
      editNotes(state.web, Number(button.dataset.editWeb));
    });
  });

  document.querySelectorAll("[data-edit-placement]").forEach(button => {
    button.addEventListener("click", () => {
      editNotes(state.placement, Number(button.dataset.editPlacement));
    });
  });

  // Web development status.
  document.querySelectorAll("[data-web-status]").forEach(input => {
    input.addEventListener("change", () => {
      state.web[Number(input.dataset.webStatus)].status = input.value;
      saveState();
      render();
      showToast("Web progress saved!");
    });
  });

  // Placement status.
  document.querySelectorAll("[data-placement-status]").forEach(input => {
    input.addEventListener("change", () => {
      state.placement[Number(input.dataset.placementStatus)].status = input.value;
      saveState();
      render();
      showToast("Placement progress saved!");
    });
  });

  // Daily study form.
  const dailyForm = $("#daily-form");

  if (dailyForm) {
    dailyForm.addEventListener("submit", saveDailyLog);
  }

  // Project status.
  document.querySelectorAll("[data-project-status]").forEach(input => {
    input.addEventListener("change", () => {
      const project = state.projects[Number(input.dataset.projectStatus)];

      project.status = input.value;

      if (project.status === "Done") {
        project.progress = 100;
      } else if (project.status === "Planned") {
        project.progress = 0;
      } else if (project.progress === 0) {
        project.progress = 10;
      }

      saveState();
      render();
      showToast("Project updated!");
    });
  });

  // Project editing.
  document.querySelectorAll("[data-edit-project]").forEach(button => {
    button.addEventListener("click", () => {
      editProject(Number(button.dataset.editProject));
    });
  });

  const addButton = $("[data-add-project]");

  if (addButton) {
    addButton.addEventListener("click", () => editProject(-1));
  }

  // Project deletion.
  document.querySelectorAll("[data-delete-project]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deleteProject);
      const name = state.projects[index].name;

      if (confirm(`Delete "${name}"? This cannot be undone.`)) {
        state.projects.splice(index, 1);
        saveState();
        render();
        showToast("Project deleted.");
      }
    });
  });

  // Add topics to either roadmap.
  document.querySelectorAll("[data-add-topic]").forEach(button => {
    button.addEventListener("click", () => addTopic(button.dataset.addTopic));
  });

  // Delete a topic after confirmation.
  document.querySelectorAll("[data-delete-topic]").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.deleteTopic;
      const index = Number(button.dataset.topicIndex);
      const list = type === "dsa" ? state.dsa : state.web;
      const item = list[index];
      if (!item) return;
      if (confirm(`Delete the topic "${item.name}"? This cannot be undone.`)) {
        list.splice(index, 1);
        saveState();
        render();
        showToast("Topic deleted.");
      }
    });
  });

  // Export a backup.
  document.querySelectorAll("[data-export]").forEach(button => {
    button.addEventListener("click", exportBackup);
  });
}

// ---------- ADD TOPICS ----------

function addTopic(type) {
  if (type !== "dsa" && type !== "web") return;

  const list = type === "dsa" ? state.dsa : state.web;
  const label = type === "dsa" ? "DSA" : "Web development";
  const nameInput = prompt(`Enter the new ${label} topic name:`);
  if (nameInput === null) return;

  const name = nameInput.trim();
  if (!name) {
    showToast("Topic name is required.");
    return;
  }

  if (list.some(item => item.name.trim().toLowerCase() === name.toLowerCase())) {
    showToast("That topic already exists in this section.");
    return;
  }

  const monthInput = prompt("Roadmap month (1-6):", "1");
  if (monthInput === null) return;
  const month = Number(monthInput);
  if (!Number.isInteger(month) || month < 1 || month > 6) {
    showToast("Enter a month from 1 to 6.");
    return;
  }

  let item;
  if (type === "dsa") {
    const targetInput = prompt("How many practice problems is your target?", "5");
    if (targetInput === null) return;
    const target = Number(targetInput);
    if (!Number.isInteger(target) || target < 0 || target > 99999) {
      showToast("Enter a valid problem target (0 or more).");
      return;
    }
    const difficultyInput = prompt("Difficulty: Easy, Medium, Hard, or Mixed", "Medium");
    if (difficultyInput === null) return;
    const allowed = ["Easy", "Medium", "Hard", "Mixed"];
    const difficulty = allowed.find(level => level.toLowerCase() === difficultyInput.trim().toLowerCase());
    if (!difficulty) {
      showToast("Choose Easy, Medium, Hard, or Mixed.");
      return;
    }
    item = { name, month, status: "Not started", solved: 0, target, difficulty, notes: "", custom: true };
  } else {
    item = { name, month, status: "Not started", notes: "", custom: true };
  }

  list.push(item);
  saveState();
  render();
  showToast(`${label} topic added and saved!`);
}

// ---------- NOTES ----------

function editNotes(items, index) {
  const item = items[index];

  const notes = prompt(
    `Learning notes for ${item.name}:`,
    item.notes || ""
  );

  if (notes === null) return;

  item.notes = notes;

  saveState();
  render();

  showToast("Notes saved!");
}

// ---------- SAVE STUDY LOG ----------

function saveDailyLog(event) {
  event.preventDefault();

  const date = $("#log-date").value;

  const log = {
    date,
    dsa: Number($("#log-dsa").value),
    web: Number($("#log-web").value),
    revision: Number($("#log-revision").value),
    note: $("#log-note").value.trim()
  };

  if (!date) {
    showToast("Please choose a date.");
    return;
  }

  const numbers = [log.dsa, log.web, log.revision];

  if (numbers.some(number =>
    !Number.isFinite(number) || number < 0 || number > 1440
  )) {
    showToast("Enter study minutes between 0 and 1440.");
    return;
  }

  // One log per date. Saving again updates that date.
  state.dailyLogs = state.dailyLogs.filter(item => item.date !== date);
  state.dailyLogs.push(log);

  saveState();
  render();

  showToast("Study log saved successfully!");
}

// ---------- ADD OR EDIT PROJECT ----------

function editProject(index) {
  const existing = index >= 0
    ? state.projects[index]
    : {
        name: "",
        tech: "",
        status: "Planned",
        progress: 0,
        link: "",
        notes: ""
      };

  const name = prompt("Project name:", existing.name);

  if (name === null) return;

  if (!name.trim()) {
    showToast("Project name is required.");
    return;
  }

  const tech = prompt("Technologies:", existing.tech || "");
  if (tech === null) return;

  const statusInput = prompt(
    "Status: Planned, In progress, or Done",
    existing.status
  );

  if (statusInput === null) return;

  const status = ["Planned", "In progress", "Done"].includes(statusInput)
    ? statusInput
    : "Planned";

  const progressInput = prompt(
    "Progress from 0 to 100:",
    String(existing.progress || 0)
  );

  if (progressInput === null) return;

  const link = prompt(
    "GitHub or live project URL (optional):",
    existing.link || ""
  );

  if (link === null) return;

  const notes = prompt("Project notes:", existing.notes || "");

  if (notes === null) return;

  let progress = Math.max(
    0,
    Math.min(100, Number(progressInput) || 0)
  );

  if (status === "Done") progress = 100;
  if (status === "Planned") progress = 0;

  const project = {
    name: name.trim(),
    tech: tech.trim(),
    status,
    progress,
    link: link.trim(),
    notes: notes.trim()
  };

  if (index >= 0) {
    state.projects[index] = project;
  } else {
    state.projects.push(project);
  }

  saveState();
  render();

  showToast("Project saved!");
}

// ---------- EXPORT BACKUP ----------

function exportBackup() {
  const blob = new Blob(
    [JSON.stringify(state, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "devtrack-backup.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showToast("Backup downloaded!");
}

// ---------- INITIALIZE APP ----------

$("#navigation").addEventListener("click", event => {
  const button = event.target.closest("[data-view]");

  if (button) {
    navigate(button.dataset.view);
  }
});

render();