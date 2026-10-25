// ── Component Loader ──────────────────────────────────────────────
const COMPONENT_BASE = 'components/';

function loadComponent(selector, file) {
    fetch(COMPONENT_BASE + file)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to load ${file}`);
            return res.text();
        })
        .then(html => {
            const el = document.querySelector(selector);
            if (el) el.innerHTML = html;

            updateLayout();
            highlightActiveNav();
            updateUIState();
        })
        .catch(err => console.warn('Component load error:', err));
}

loadComponent('#sidebar-container', 'sidebar.html');
loadComponent('#topbar-container', 'topbar.html');
loadComponent('#mobile-menu-container', 'mobile-menu.html');

// ── Mobile Menu Toggle ────────────────────────────────────────────
document.addEventListener('click', function (e) {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;

    if (e.target.closest('#openMenuBtn') || e.target.closest('#openMenuBtnTop')) {
        menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    if (e.target.closest('#closeMenuBtn')) {
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ── Layout Toggle ──────────────────────────────────────────────────
let isTopbarLayout = false;

function updateLayout() {
    const sidebar = document.getElementById('sidebar');
    const topbar = document.getElementById('topbar');
    if (!sidebar || !topbar) return;

    if (isTopbarLayout) {
        sidebar.className = 'hidden';
        topbar.className = 'w-full border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-40 transition-colors duration-300';
    } else {
        sidebar.className = 'hidden lg:flex flex-col w-[280px] h-[calc(100vh)] sticky top-0 border-r border-[var(--border)] bg-[var(--background)] p-6 overflow-y-auto shrink-0 transition-all z-20';
        // Hanya sembunyikan topbar versi desktop (lg:hidden), sehingga header mobile tetap tampil tunggal di atas
        topbar.className = 'block lg:hidden w-full border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-40 transition-colors duration-300';
    }
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('#toggleLayoutBtnSide') || e.target.closest('#toggleLayoutBtnTop');
    if (btn) {
        isTopbarLayout = !isTopbarLayout;
        updateLayout();
    }
});

// ── Active Nav Highlight ──────────────────────────────────────────
function highlightActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-item[href], #topbar a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === current) {
            link.classList.add('active', 'text-[var(--text-main)]');
        } else {
            link.classList.remove('active');
        }
    });
}

// ── Theme & Language Toggle ───────────────────────────────────────
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateUIState();
}

function applyLanguage(lang) {
    localStorage.setItem('lang', lang);
    updateUIState();
}

// Sinkronkan UI Switch untuk Sidebar dan Topbar sekaligus
function updateUIState() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const currentLang = localStorage.getItem('lang') || 'us';

    // Cari semua elemen switch tema dan perbarui checkmark-nya
    document.querySelectorAll('input[id*="themeSwitch"]').forEach(switchEl => {
        switchEl.checked = (currentTheme === 'dark');
    });

    // Cari semua elemen switch bahasa dan perbarui checkmark-nya
    document.querySelectorAll('input[id*="languageSwitch"]').forEach(switchEl => {
        switchEl.checked = (currentLang === 'id');
    });
}

// Event Delegation (Mendeteksi klik di sidebar ataupun topbar otomatis)
document.addEventListener('change', function (e) {
    if (e.target.id && e.target.id.includes('themeSwitch')) {
        const newTheme = e.target.checked ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    if (e.target.id && e.target.id.includes('languageSwitch')) {
        const newLang = e.target.checked ? 'id' : 'us';
        applyLanguage(newLang);
    }
});

// ── Inisialisasi awal ─────────────────────────────────────────────
function initApp() {
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) savedTheme = 'dark'; 
    applyTheme(savedTheme);

    let savedLang = localStorage.getItem('lang');
    if (!savedLang) savedLang = 'us'; 
    applyLanguage(savedLang);
}

initApp();

document.addEventListener('DOMContentLoaded', function () {
    updateUIState();
    setTimeout(highlightActiveNav, 300);
});

const observer = new MutationObserver(() => {
    if (document.getElementById('sidebar') && document.getElementById('topbar')) {
        updateLayout();
        highlightActiveNav();
        updateUIState();
        observer.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

setTimeout(() => {
    if (document.getElementById('sidebar') && document.getElementById('topbar')) {
        updateLayout();
        highlightActiveNav();
        updateUIState();
        observer.disconnect();
    }
}, 500);