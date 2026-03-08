const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
const DEMO_USER = 'admin';
const DEMO_PASS = 'admin123';

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const loader = document.getElementById('loader');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = usernameInput.value;
    const pass = passwordInput.value;

    if (user === DEMO_USER && pass === DEMO_PASS) {
        loginError.classList.add('hidden');
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        
    } else {
        loginError.classList.remove('hidden');
    }
});

function showLoader(show) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}