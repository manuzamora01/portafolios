/**
 * Lógica Dinámica de la Interfaz del Chat de IA Minimalista
 * Arquitectura de Portafolio OS
 */

let portfolioData = null;
const chatMessagesContainer = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// ==========================================
// MENÚS REUTILIZABLES (RECURSIVIDAD)
// ==========================================
const menuSobreMi = `
    <div class="chat-inline-menu" style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <button class="chat-inline-btn" data-action="bio">📝 Biografía</button>
        <button class="chat-inline-btn" data-action="trayectoria">💼 Trayectoria Laboral</button>
        <button class="chat-inline-btn" data-action="estudios">🎓 Estudios</button>
    </div>
`;

const menuCertificaciones = `
    <div class="chat-inline-menu" style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <button class="chat-inline-btn" data-action="certs_Cloud_Computing">☁️ Cloud</button>
        <button class="chat-inline-btn" data-action="certs_Networking">🌐 Networking</button>
        <button class="chat-inline-btn" data-action="certs_Sistemas_Operativos">🐧 Sistemas Operativos</button>
        <button class="chat-inline-btn" data-action="certs_Enterprise_Software">🏢 Enterprise</button>
        <button class="chat-inline-btn" data-action="certs_all">📚 Mostrar Todas</button>
    </div>
`;

const menuProyectos = `
    <div class="chat-inline-menu" style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <button class="chat-inline-btn" data-action="projects_python">🐍 Python</button>
        <button class="chat-inline-btn" data-action="projects_infra_cloud">☁️ Infra & Cloud</button>
        <button class="chat-inline-btn" data-action="projects_all">🚀 Mostrar Todos</button>
    </div>
`;

// ==========================================
// INICIALIZACIÓN DEL SISTEMA
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    initThemeToggle();
    
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error("Error HTTP: " + response.status);
        portfolioData = await response.json();
        
        renderHeaderContact(portfolioData.contact);
        setupEventListeners();
        
        // Arranca la conversación inicial
        iniciarConversacion();

    } catch (error) {
        console.error("No se pudo cargar data.json:", error);
    }
});

function iniciarConversacion() {
    chatMessagesContainer.innerHTML = '';
    handleUserAction('inicio', '🏠 Inicio', true);
}

// ==========================================
// SISTEMA DE TEMAS Y UI BASE
// ==========================================
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('app-theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    toggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('app-theme', newTheme);
    });
}

function renderHeaderContact(contact) {
    const contactContainer = document.getElementById('header-contact');
    contactContainer.innerHTML = `
        <a href="mailto:${contact.email}" title="Email">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
        <a href="${contact.github}" target="_blank" title="GitHub">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
        <a href="${contact.linkedin}" target="_blank" title="LinkedIn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
    `;
}

// ==========================================
// ESCUCHA DE EVENTOS (BOTONES Y TEXTO)
// ==========================================
function setupEventListeners() {
    // Botón de nueva conversación superior
    document.getElementById('new-chat-btn').addEventListener('click', iniciarConversacion);

    // Delegación de eventos para todos los botones del chat
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.getAttribute('data-action');
            // Limpia los emojis del texto del botón para que el mensaje del usuario sea más limpio
            const text = btn.textContent.replace(/[\u1000-\uFFFF]/g, '').trim(); 
            handleUserAction(action, text);
        }
    });

    // Envío por campo de texto
    const handleSend = () => {
        const text = chatInput.value.trim();
        if (text !== '') {
            processTextInput(text);
            chatInput.value = '';
        }
    };
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

function processTextInput(text) {
    const lowerText = text.toLowerCase();
    let action = 'desconocido';

    // Procesamiento básico de palabras clave (NLP Simple)
    if (lowerText.includes('hola') || lowerText.includes('inicio')) action = 'inicio';
    else if (lowerText.includes('sobre') || lowerText.includes('ti') || lowerText.includes('bio')) action = 'sobre-mi';
    else if (lowerText.includes('experiencia') || lowerText.includes('trabajo') || lowerText.includes('trayectoria')) action = 'trayectoria';
    else if (lowerText.includes('estudio') || lowerText.includes('educacion') || lowerText.includes('universidad')) action = 'estudios';
    else if (lowerText.includes('proyecto')) action = 'proyectos';
    else if (lowerText.includes('skill') || lowerText.includes('tecnologia') || lowerText.includes('herramienta')) action = 'skills';
    else if (lowerText.includes('certificacione') || lowerText.includes('titulo')) action = 'certificaciones';

    handleUserAction(action, text, false);
}

// ==========================================
// MOTOR DE PROCESAMIENTO DEL CHAT (LLM FAKE)
// ==========================================
async function handleUserAction(action, userText, isSystemInit = false) {
    // 1. Mostrar mensaje del usuario
    if (!isSystemInit) {
        appendUserMessage(userText);
        scrollToBottom();
    }

    // 2. Mostrar indicador de "Escribiendo..."
    const typingId = appendTypingIndicator();
    scrollToBottom();

    // 3. Simular tiempo de respuesta (delay aleatorio)
    const delay = Math.floor(Math.random() * 500) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    document.getElementById(typingId).remove();

    let aiIntroText = "";
    let aiHtmlContent = "";

    // --- LÓGICA DE SUBCATEGORÍAS PARA PROYECTOS ---
    if (action.startsWith('projects_')) {
        const topic = action.split('_').slice(1).join('_');
        if (topic === 'all') {
            aiIntroText = "Aquí tienes la lista completa de proyectos realizados por Manuel:";
            aiHtmlContent = buildProjectsVerticalHTML(portfolioData.projects, null) + menuProyectos;
        } else {
            const formattedTopic = topic.replace('_', ' & ');
            aiIntroText = `Estos son los proyectos relacionados con **${formattedTopic}**:`;
            aiHtmlContent = buildProjectsVerticalHTML(portfolioData.projects, topic) + menuProyectos;
        }
        appendAIMessage(aiIntroText, aiHtmlContent);
        scrollToBottom();
        return;
    }

    // --- LÓGICA DE SUBCATEGORÍAS PARA CERTIFICACIONES ---
    if (action.startsWith('certs_')) {
        const topic = action.split('_').slice(1).join('_');
        if (topic === 'all') {
            aiIntroText = "Aquí tienes todas las certificaciones oficiales de Manuel:";
            aiHtmlContent = buildCertificationsHTML(portfolioData.certifications, null) + menuCertificaciones;
        } else {
            const formattedTopic = topic.replace('_', ' ');
            aiIntroText = `Estas son las certificaciones en el área de **${formattedTopic}**:`;
            aiHtmlContent = buildCertificationsHTML(portfolioData.certifications, topic) + menuCertificaciones;
        }
        appendAIMessage(aiIntroText, aiHtmlContent);
        scrollToBottom();
        return;
    }

    // --- LÓGICA DE ACCIONES PRINCIPALES ---
    switch(action) {
        case 'inicio':
            aiIntroText = `¡Hola! Soy el asistente virtual de **${portfolioData.hero.name}**, **${portfolioData.hero.role}**.<br><br>${portfolioData.hero.valueProposition}`;
            aiHtmlContent = `
                <div class="chat-inline-menu">
                    <a href="${portfolioData.hero.resumeLink}" target="_blank" class="chat-inline-btn">📄 Ver Currículum</a>
                    <button class="chat-inline-btn" data-action="sobre-mi">👤 Sobre mí</button>
                </div>
            `;
            break;
        
        case 'sobre-mi':
            aiIntroText = "Excelente. ¿Qué aspecto de la trayectoria de Manuel te gustaría conocer?";
            aiHtmlContent = menuSobreMi; // Inyecta el menú completo
            break;

        case 'bio':
            aiIntroText = portfolioData.about.bio;
            aiHtmlContent = `<p style="font-style:italic; color:var(--text-muted); margin-top:1rem;">Filosofía: "${portfolioData.about.philosophy}"</p>` + menuSobreMi;
            break;

        case 'trayectoria':
            aiIntroText = "Esta es su experiencia profesional hasta la fecha:";
            aiHtmlContent = buildExperienceHTML(portfolioData.history.experience) + menuSobreMi;
            break;

        case 'estudios':
            aiIntroText = "Esta es su formación académica oficial:";
            aiHtmlContent = buildEducationHTML(portfolioData.history.education) + menuSobreMi;
            break;

        case 'proyectos':
            aiIntroText = "Manuel ha trabajado en diversas áreas técnicas. ¿Qué tipo de proyectos te interesa explorar?";
            aiHtmlContent = menuProyectos; // Muestra el menú de categorías
            break;

        case 'skills':
            aiIntroText = "Domina las siguientes herramientas y tecnologías, organizadas por área:";
            aiHtmlContent = buildSkillsHTML(portfolioData.skills);
            break;

        case 'certificaciones':
            aiIntroText = "Cuenta con certificaciones oficiales avaladas por la industria. Selecciona un área:";
            aiHtmlContent = menuCertificaciones; // Muestra el menú de tópicos
            break;

        default:
            aiIntroText = "No he logrado entender ese comando. Por favor, selecciona una de las opciones sugeridas o escribe comandos como 'proyectos' o 'experiencia'.";
    }

    // 4. Mostrar respuesta final de la IA
    appendAIMessage(aiIntroText, aiHtmlContent);
    scrollToBottom();
}

// ==========================================
// FUNCIONES DE DIBUJADO EN PANTALLA (UI)
// ==========================================
function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-message';
    msgDiv.innerHTML = `
        <div class="avatar user-avatar">Tú</div>
        <div class="message-content"><p>${text}</p></div>
    `;
    chatMessagesContainer.appendChild(msgDiv);
}

function appendTypingIndicator() {
    const msgId = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    msgDiv.id = msgId;
    msgDiv.innerHTML = `
        <div class="avatar ai-avatar">AI</div>
        <div class="message-content">
            <div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        </div>
    `;
    chatMessagesContainer.appendChild(msgDiv);
    return msgId;
}

function appendAIMessage(introText, htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    
    // Convertir **negritas** de formato markdown a etiquetas HTML <strong>
    const formattedText = introText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    msgDiv.innerHTML = `
        <div class="avatar ai-avatar">AI</div>
        <div class="message-content">
            <p>${formattedText}</p>
            ${htmlContent ? `<div class="chat-data-container">${htmlContent}</div>` : ''}
        </div>
    `;
    chatMessagesContainer.appendChild(msgDiv);
}

function scrollToBottom() {
    chatMessagesContainer.scrollTo({ top: chatMessagesContainer.scrollHeight, behavior: 'smooth' });
}

// ==========================================
// CONSTRUCTORES DE HTML (PARSERS DE DATOS)
// ==========================================

function buildExperienceHTML(arr) {
    if(!arr || !arr.length) return "<p>No hay datos.</p>";
    return arr.map(exp => `
        <div class="chat-card">
            <img src="${exp.logoUrl}" alt="${exp.company}" class="chat-logo">
            <div class="chat-card-content">
                <div class="chat-card-title">${exp.role}</div>
                <div class="chat-card-subtitle"><span>@ ${exp.company}</span><span>${exp.period}</span></div>
                <div class="chat-card-desc">${exp.description}</div>
            </div>
        </div>
    `).join('');
}

function buildEducationHTML(arr) {
    if(!arr || !arr.length) return "<p>No hay datos.</p>";
    return arr.map(edu => `
        <div class="chat-card">
            <img src="${edu.logoUrl}" alt="${edu.institution}" class="chat-logo">
            <div class="chat-card-content">
                <div class="chat-card-title">${edu.degree}</div>
                <div class="chat-card-subtitle"><span>${edu.institution}</span><span>${edu.period}</span></div>
                <div class="chat-card-desc">${edu.description}</div>
            </div>
        </div>
    `).join('');
}

// Proyectos en GRID COMPACTO (Verticales, lado a lado)
function buildProjectsVerticalHTML(projObj, specificTopic) {
    let html = '';
    for (const [cat, list] of Object.entries(projObj)) {
        if (specificTopic && cat !== specificTopic) continue;

        html += `<h4 style="margin-top:1rem; margin-bottom: 0.2rem; color: var(--accent); font-size: 0.9rem;">${cat.replace('_', ' ').toUpperCase()}</h4>`;
        html += `<div class="projects-grid">`;
        html += list.map(p => `
            <div class="chat-card-vertical">
                <img src="${p.imageUrl}" alt="${p.title}" class="chat-img-vertical">
                <div class="chat-card-vertical-content">
                    <div class="chat-card-title">${p.title}</div>
                    <div class="chat-card-desc">${p.description}</div>
                    <div class="chat-tags" style="margin-bottom: 0.8rem;">
                        ${p.technologies.map(t => `<span class="chat-tag">#${t}</span>`).join('')}
                    </div>
                    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                        ${p.repoUrl !== '#' ? `<a href="${p.repoUrl}" target="_blank" class="chat-link" style="margin:0; font-size:0.75rem;">🐙 Source</a>` : ''}
                        ${p.demoUrl !== '#' ? `<a href="${p.demoUrl}" target="_blank" class="chat-link" style="margin:0; font-size:0.75rem;">🔗 Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        html += `</div>`;
    }
    return html;
}

// Ayudante para inyectar iconos en las etiquetas de Skills
function getTechIcon(techName) {
    const name = techName.toLowerCase();
    if (name.includes('aws') || name.includes('azure') || name.includes('cloud')) return '☁️';
    if (name.includes('linux') || name.includes('ubuntu')) return '🐧';
    if (name.includes('windows')) return '🪟';
    if (name.includes('docker')) return '🐳';
    if (name.includes('kubernetes')) return '☸️';
    if (name.includes('python')) return '🐍';
    if (name.includes('bash') || name.includes('shell') || name.includes('powershell')) return '💻';
    if (name.includes('tcp') || name.includes('vpn') || name.includes('firewall')) return '🛡️';
    if (name.includes('terraform') || name.includes('ansible') || name.includes('ci/cd')) return '⚙️';
    return '🔧';
}

function buildSkillsHTML(skillsObj) {
    let html = '';
    for (const [category, list] of Object.entries(skillsObj)) {
        html += `
            <div style="margin-bottom: 1rem;">
                <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase;">${category.replace('_', ' ')}</p>
                <div class="chat-tags">
                    ${list.map(s => `<span class="chat-tag"><span class="chat-tag-icon">${getTechIcon(s)}</span>${s}</span>`).join('')}
                </div>
            </div>
        `;
    }
    return html;
}

// Certificaciones en GRID COMPACTO (Lado a lado)
function buildCertificationsHTML(certsObj, specificTopic) {
    let html = '';
    for (const [topic, list] of Object.entries(certsObj)) {
        if (specificTopic && topic !== specificTopic) continue;

        html += `<div style="margin-bottom: 1rem;">
                    <p style="font-weight: 600; margin-bottom: 0.5rem; color: var(--accent); font-size: 0.9rem;">${topic.replace('_', ' ').toUpperCase()}</p>`;
        html += `<div class="certs-grid">`;
        html += list.map(cert => `
            <div class="chat-card-cert">
                <img src="${cert.badgeUrl}" alt="${cert.title}" class="chat-logo">
                <div class="chat-card-cert-title">${cert.title}</div>
                <div class="chat-card-cert-subtitle">${cert.issuer} • ${cert.year}</div>
                ${cert.credentialUrl !== '#' ? `<a href="${cert.credentialUrl}" target="_blank" class="chat-link" style="margin:0; padding: 0.2rem 0.6rem; font-size: 0.7rem;">Verificar ↗</a>` : ''}
            </div>
        `).join('');
        html += `</div></div>`;
    }
    
    if (html === '') return "<p>No hay certificaciones en esta categoría.</p>";
    return html;
}