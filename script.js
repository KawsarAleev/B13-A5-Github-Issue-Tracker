const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
const DEMO_USER = "admin";
const DEMO_PASS = "admin123";
const ICON_OPEN = "./assets/Open-Status.png";
const ICON_CLOSED = "./assets/Closed- Status .png";

let allIssues = [];
let currentFilter = "all";

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const loader = document.getElementById("loader");
const issuesContainer = document.getElementById("issues-container");
const issueCountSpan = document.getElementById("issue-count");
const noResultsDiv = document.getElementById("no-results");
const searchInput = document.getElementById("search-input");
const searchInputMobile = document.getElementById("search-input-mobile");
const newIssueBtn = document.getElementById("new-issue-btn");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = usernameInput.value;
  const pass = passwordInput.value;

  if (user === DEMO_USER && pass === DEMO_PASS) {
    loginError.classList.add("hidden");
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    fetchIssues();
  } else {
    loginError.classList.remove("hidden");
  }
});

async function fetchIssues() {
  showLoader(true);
  try {
    const response = await fetch(`${API_BASE}/issues`);
    const result = await response.json();
    if (result.status === "success") {
      allIssues = result.data;
      renderIssues(allIssues);
    }
  } catch (error) {
    console.error(error);
  } finally {
    showLoader(false);
  }
}

async function fetchSingleIssue(id) {
  showLoader(true);
  try {
    const response = await fetch(`${API_BASE}/issue/${id}`);
    const result = await response.json();
    if (result.status === "success") {
      populateModal(result.data);
      document.getElementById("issue-modal").classList.remove("hidden");
    }
  } catch (error) {
    console.error(error);
  } finally {
    showLoader(false);
  }
}

async function searchIssues(query) {
  if (!query) {
    fetchIssues();
    return;
  }
  showLoader(true);
  try {
    const response = await fetch(`${API_BASE}/issues/search?q=${query}`);
    const result = await response.json();
    if (result.status === "success") {
      renderIssues(result.data, true);
    }
  } catch (error) {
    console.error(error);
  } finally {
    showLoader(false);
  }
}

function generateLabelHTML(labelName) {
  const label = labelName.toLowerCase();
  let styleClass = "";
  let iconSrc = "";

  if (label === "bug") {
    styleClass = "bg-red-50 text-red-600 border border-red-100";
    iconSrc = "./assets/Bug.svg";
  } else if (label === "help wanted") {
    styleClass = "bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]";
    iconSrc = "./assets/Help.svg";
  } else if (label === "enhancement") {
    styleClass = "bg-green-50 text-green-600 border border-green-100";
    iconSrc = "./assets/Enhancement.svg";
  } else {
    styleClass = "bg-blue-50 text-blue-600 border border-blue-100";
  }

  const iconHtml = iconSrc
    ? `<img src="${iconSrc}" class="mr-1.5 w-3 h-3" alt="${label}">`
    : "";

  return `
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styleClass}">
${iconHtml}
${labelName}
</span>
`;
}

function renderIssues(issues, isSearchResult = false) {
  issuesContainer.innerHTML = "";

  let filteredIssues = issues;
  if (!isSearchResult && currentFilter !== "all") {
    filteredIssues = issues.filter((issue) => issue.status === currentFilter);
  }

  issueCountSpan.innerText = filteredIssues.length;

  if (filteredIssues.length === 0) {
    noResultsDiv.classList.remove("hidden");
  } else {
    noResultsDiv.classList.add("hidden");
  }

  filteredIssues.forEach((issue) => {
    const card = document.createElement("div");
    const isClosed = issue.status === "closed";

    const borderColor = isClosed ? "border-[#a855f7]" : "border-[#22c55e]";
    const statusIcon = isClosed ? ICON_CLOSED : ICON_OPEN;

    let priorityClass = "";
    if (issue.priority === "high")
      priorityClass = "bg-red-50 text-red-500 border border-red-100";
    else if (issue.priority === "medium")
      priorityClass = "bg-orange-50 text-orange-500 border border-orange-100";
    else priorityClass = "bg-gray-100 text-gray-500 border border-gray-200";

    const dateStr = new Date(issue.createdAt).toLocaleDateString("en-US");

    card.className = `bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden relative border-t-[3px] ${borderColor}`;
    card.onclick = () => fetchSingleIssue(issue.id);

    const labelsHtml = issue.labels
      .map((lbl) => generateLabelHTML(lbl))
      .join("");

    card.innerHTML = `
            <div class="p-5">
                <div class="flex justify-between items-start mb-3">
                    <img src="${statusIcon}" alt="${issue.status}" class="w-7 h-7 object-contain"
                        onerror="this.style.display='none'">
                    <span
                        class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityClass}">${issue.priority}</span>
                </div>
                <h3 class="font-bold text-gray-900 text-[15px] mb-2 line-clamp-2 leading-snug">${issue.title}</h3>
                <p class="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">${issue.description}</p>

                <div class="flex flex-wrap gap-2 mt-auto">
                    ${labelsHtml}
                </div>
            </div>
            <div
                class="px-5 py-3 border-t border-gray-100 text-[11px] text-gray-400 font-medium flex flex-col gap-0.5 bg-gray-50/30">
                <p class="text-gray-500">#${issue.id} by ${issue.author}</p>
                <p>${dateStr}</p>
            </div>
`;

    issuesContainer.appendChild(card);
  });
}

function switchTab(tab) {
  currentFilter = tab;
  searchInput.value = "";
  searchInputMobile.value = "";
  const baseBtn =
    "px-5 py-2 rounded-md text-sm font-medium transition-all border";
  const activeBtn = "bg-[#4F46E5] text-white border-transparent shadow-sm";
  const inactiveBtn = "bg-white text-gray-600 border-gray-200 hover:bg-gray-50";

  document.getElementById("tab-all").className =
    `${baseBtn} ${tab === "all" ? activeBtn : inactiveBtn}`;
  document.getElementById("tab-open").className =
    `${baseBtn} ${tab === "open" ? activeBtn : inactiveBtn}`;
  document.getElementById("tab-closed").className =
    `${baseBtn} ${tab === "closed" ? activeBtn : inactiveBtn}`;

  if (allIssues.length > 0) {
    renderIssues(allIssues);
  } else {
    fetchIssues();
  }
}

function handleSearch() {
  const query = searchInput.value.trim() || searchInputMobile.value.trim();
  if (query) {
    searchIssues(query);
  } else {
    fetchIssues();
  }
}

newIssueBtn.addEventListener("click", handleSearch);

[searchInput, searchInputMobile].forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
});

function populateModal(issue) {
  document.getElementById("modal-title").innerText = issue.title;
  document.getElementById("modal-desc").innerText = issue.description;
  document.getElementById("modal-author").innerText = issue.author;
  document.getElementById("modal-assignee").innerText =
    issue.assignee || "Unassigned";
  document.getElementById("modal-date").innerText = new Date(
    issue.createdAt,
  ).toLocaleDateString("en-GB");

  const statusBadge = document.getElementById("modal-status-badge");
  if (issue.status === "open") {
    statusBadge.innerHTML = "Open";
    statusBadge.className =
      "px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide bg-[#00A96E] border-none shadow-sm";
  } else {
    statusBadge.innerHTML = "Closed";
    statusBadge.className =
      "px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide bg-[#a855f7] border-none shadow-sm";
  }

  const prioritySpan = document.getElementById("modal-priority");
  prioritySpan.innerText = issue.priority.toUpperCase();
  let pClass = "bg-gray-100 text-gray-600";
  if (issue.priority === "high") pClass = "bg-[#EF4444] text-white";
  if (issue.priority === "medium")
    pClass = "bg-orange-50 text-orange-600 border border-orange-100";

  prioritySpan.className = `inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${pClass}`;

  const labelContainer = document.getElementById("modal-labels");
  labelContainer.innerHTML = issue.labels
    .map((lbl) => generateLabelHTML(lbl))
    .join("");
}

function closeModal() {
  document.getElementById("issue-modal").classList.add("hidden");
}

function showLoader(show) {
  if (show) loader.classList.remove("hidden");
  else loader.classList.add("hidden");
}
