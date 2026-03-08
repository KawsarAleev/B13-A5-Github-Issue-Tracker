const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
const DEMO_USER = 'admin';
const DEMO_PASS = 'admin123';
const ICON_OPEN = './assets/Open-Status.png';
const ICON_CLOSED = './assets/Closed- Status .png';

let allIssues = [];

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const loader = document.getElementById('loader');
const issuesContainer = document.getElementById('issues-container');
const issueCountSpan = document.getElementById('issue-count');
const noResultsDiv = document.getElementById('no-results');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = usernameInput.value;
    const pass = passwordInput.value;

    if (user === DEMO_USER && pass === DEMO_PASS) {
        loginError.classList.add('hidden');
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        fetchIssues();
    } else {
        loginError.classList.remove('hidden');
    }
});

async function fetchIssues() {
    showLoader(true);
    try {
        const response = await fetch(`${API_BASE}/issues`);
        const result = await response.json();
        if (result.status === 'success') {
            allIssues = result.data;
            renderIssues(allIssues);
        }
    } catch (error) {
        console.error(error);
    } finally {
        showLoader(false);
    }
}

function generateLabelHTML(labelName) {
    const label = labelName.toLowerCase();
    let styleClass = '';
    let iconSrc = '';

    if (label === 'bug') {
        styleClass = 'bg-red-50 text-red-600 border border-red-100';
        iconSrc = './assets/Bug.svg';
    } else if (label === 'help wanted') {
        styleClass = 'bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]';
        iconSrc = './assets/Help.svg';
    } else if (label === 'enhancement') {
        styleClass = 'bg-green-50 text-green-600 border border-green-100';
        iconSrc = './assets/Enhancement.svg';
    } else {
        styleClass = 'bg-blue-50 text-blue-600 border border-blue-100';
    }

    const iconHtml = iconSrc ? `<img src="${iconSrc}" class="mr-1.5 w-3 h-3" alt="${label}">` : '';

    return `
    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styleClass}">
    ${iconHtml} ${labelName}
    </span>`;
}

function renderIssues(issues) {
    issuesContainer.innerHTML = '';
    issueCountSpan.innerText = issues.length;

    if (issues.length === 0) {
        noResultsDiv.classList.remove('hidden');
    } else {
        noResultsDiv.classList.add('hidden');
    }

    issues.forEach(issue => {
        const card = document.createElement('div');
        const isClosed = issue.status === 'closed';
        const borderColor = isClosed ? 'border-[#a855f7]' : 'border-[#22c55e]'; 
        const statusIcon = isClosed ? ICON_CLOSED : ICON_OPEN;

        let priorityClass = '';
        if(issue.priority === 'high') priorityClass = 'bg-red-50 text-red-500 border border-red-100';
        else if(issue.priority === 'medium') priorityClass = 'bg-orange-50 text-orange-500 border border-orange-100';
        else priorityClass = 'bg-gray-100 text-gray-500 border border-gray-200';

        const dateStr = new Date(issue.createdAt).toLocaleDateString('en-US');
        const labelsHtml = issue.labels.map(lbl => generateLabelHTML(lbl)).join('');

        card.className = `bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden relative border-t-[3px] ${borderColor}`;
        
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
                <div class="flex flex-wrap gap-2 mt-auto">${labelsHtml}</div>
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

function showLoader(show) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}