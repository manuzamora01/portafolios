/**
 * Portafolio Dinámico - Manuel Zamora del Cerro
 * Core de control y lógica de la interfaz de la Terminal
 */

document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
});

let systemEmail = "";

async function initPortfolio() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        systemEmail = data.contact.email;

        renderHeader(data.hero.name, data.contact);
        renderHero(data.hero);
        renderAboutTabs(data.about, data.history);
        renderCertifications(data.certifications);
        renderSkills(data.skills);
        renderProjects(data.projects);
        renderFooter(data.hero.name);

        setupTabSystem();
        setupIntersectionObserver();
        initTypewriterEffect(data.hero.role);

    } catch (error) {
        console.error('Error del sistema:', error);
        mostrarErrorEnPantalla();
    }
}

function renderHeader(name, contact) {
    const firstName = name.split(' ')[0].toLowerCase();
    document.getElementById('nav-logo').textContent = `${firstName}_`;
    
    const socialsContainer = document.getElementById('header-socials');
    socialsContainer.innerHTML = `
        <button id="clip-email-btn" title="Copiar correo electrónico">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
        </button>
        <a href="${contact.github}" target="_blank" rel="noopener noreferrer" title="Ver GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
        </a>
        <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer" title="Ver LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
            </svg>
        </a>
    `;

    document.getElementById('clip-email-btn').addEventListener('click', copiarCorreoAlPortapapeles);
}

function renderHero(hero) {
    const heroContent = document.getElementById('hero-content');
    heroContent.innerHTML = `
        <p class="hero-greeting hidden-element">> system.boot()</p>
        <h1 class="hero-title hidden-element">${hero.name}</h1>
        <h2 id="typewriter-role" class="hero-role terminal-cursor"></h2>
        <p class="hero-desc hidden-element">${hero.valueProposition}</p>
        <div class="hidden-element" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <a href="${hero.resumeLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Ejecutar CV.exe</a>
            <a href="#about" class="btn btn-outline">cd ./sobre_mi</a>
        </div>
    `;
}

function renderAboutTabs(about, history) {
    // 1. Biografía
    document.getElementById('tab-bio').innerHTML = `
        <p style="margin-bottom: 1.5rem; font-size: 1.05rem;">> ${about.bio}</p>
        <div style="border-left: 2px solid var(--border-color); padding-left: 1rem; margin-top: 1rem;">
            <p style="color: var(--text-muted); font-style: italic;"># Core Philosophy: "${about.philosophy}"</p>
        </div>
    `;

    // 2. Experiencia con logos
    const expPanel = document.getElementById('tab-exp');
    if (history.experience.length === 0) {
        expPanel.innerHTML = `<p style="color: var(--text-muted);">> No hay registros en el archivo de log.</p>`;
    } else {
        expPanel.innerHTML = history.experience.map(item => `
            <div class="history-item">
                <img src="${item.logoUrl}" alt="Logo de ${item.company}" class="history-logo" loading="lazy">
                <div class="history-content">
                    <div class="history-header">
                        <span class="history-title">> ${item.role}</span>
                        <span class="history-period">[${item.period}]</span>
                    </div>
                    <div class="history-org">@ ${item.company}</div>
                    <p class="history-desc">${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    // 3. Educación con logos
    const eduPanel = document.getElementById('tab-edu');
    if (history.education.length === 0) {
        eduPanel.innerHTML = `<p style="color: var(--text-muted);">> No hay configuraciones guardadas.</p>`;
    } else {
        eduPanel.innerHTML = history.education.map(item => `
            <div class="history-item">
                <img src="${item.logoUrl}" alt="Logo de ${item.institution}" class="history-logo" loading="lazy">
                <div class="history-content">
                    <div class="history-header">
                        <span class="history-title">> ${item.degree}</span>
                        <span class="history-period">[${item.period}]</span>
                    </div>
                    <div class="history-org">Institution: ${item.institution}</div>
                    <p class="history-desc">${item.description}</p>
                </div>
            </div>
        `).join('');
    }
}

function renderCertifications(certificationsMap) {
    const certsContent = document.getElementById('certifications-content');
    let html = '<div class="certs-grid">';

    for (const [vendor, certList] of Object.entries(certificationsMap)) {
        html += `<h3 class="category-header hidden-element">> ./certs/${vendor.toLowerCase()}</h3>`;
        html += certList.map(cert => `
            <article class="cert-card hidden-element">
                <img src="${cert.badgeUrl}" alt="Badge oficial ${cert.title}" class="cert-badge" loading="lazy">
                <div class="cert-info">
                    <h3 class="cert-title">${cert.title}</h3>
                    <div class="cert-meta">
                        <span>Emisor: ${cert.issuer}</span> | <span>Año: ${cert.year}</span>
                    </div>
                    <div style="margin-top: 0.4rem;">
                        <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">Verificar_Hash()</a>
                    </div>
                </div>
            </article>
        `).join('');
    }
    html += '</div>';
    certsContent.innerHTML = html;
}

function renderSkills(skills) {
    const skillsContainer = document.getElementById('skills-container');
    const categoryTitles = { 
        cloud_infrastructure: 'Cloud & Systems', 
        automation_devops: 'DevOps & Automation', 
        networking_scripting: 'Net & Scripting' 
    };
    let html = '';

    for (const [category, skillList] of Object.entries(skills)) {
        html += `
            <div class="skill-category hidden-element">
                <h3>${categoryTitles[category] || category}</h3>
                <ul class="skill-list">
                    ${skillList.map(skill => `<li class="skill-tag">${skill}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    skillsContainer.innerHTML = html;
}

function renderProjects(projectsMap) {
    const projectsGrid = document.getElementById('projects-grid');
    let html = '';

    for (const [category, projectList] of Object.entries(projectsMap)) {
        html += `<h3 class="category-header hidden-element">> ./proyectos/${category}</h3>`;
        html += projectList.map(project => `
            <article class="project-card hidden-element">
                <img src="${project.imageUrl}" alt="Despliegue de ${project.title}" class="project-img" loading="lazy">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <p class="project-desc">> ${project.description}</p>
                    <div class="project-links">
                        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">[ View ]</a>
                        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">[ Code ]</a>
                    </div>
                </div>
            </article>
        `).join('');
    }
    projectsGrid.innerHTML = html;
}

function renderFooter(name) {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('footer-name').textContent = name;
}

// ==========================================
// INTERACCIONES Y SISTEMAS DE EVENTOS
// ==========================================

function setupTabSystem() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active-panel'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(target).classList.add('active-panel');
        });
    });
}

function copiarCorreoAlPortapapeles() {
    if (!systemEmail) return;
    
    navigator.clipboard.writeText(systemEmail).then(() => {
        mostrarToast("[ STDOUT ] Correo electrónico copiado al portapapeles.");
    }).catch(err => {
        console.error("Error al acceder al portapapeles: ", err);
    });
}

function mostrarToast(mensaje) {
    const toast = document.getElementById('system-toast');
    toast.textContent = mensaje;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function initTypewriterEffect(text) {
    const targetElement = document.getElementById('typewriter-role');
    let currentIndex = 0;
    
    function type() {
        if (currentIndex < text.length) {
            targetElement.textContent += text.charAt(currentIndex);
            currentIndex++;
            setTimeout(type, Math.floor(Math.random() * 40) + 25);
        }
    }
    setTimeout(type, 600);
}

function setupIntersectionObserver() {
    const options = { root: null, threshold: 0.12, rootMargin: "0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, options);

    document.querySelectorAll('.hidden-element').forEach(el => observer.observe(el));
}

function mostrarErrorEnPantalla() {
    document.querySelector('main').innerHTML = `
        <div class="container" style="text-align: center; padding: 20vh 0; color: #ff0000;">
            <h2>[ FATAL ERROR ]</h2>
            <p style="margin-top: 1rem;">>> No se pudo establecer conexión de lectura con data.json.</p>
        </div>
    `;
}