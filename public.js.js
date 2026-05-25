// Application de la couleur de thème stockée
function applyTheme(color) {
    if (color) {
        document.documentElement.style.setProperty('--accent-color', color);
    }
}

// Chargement global des données publiques
async function loadPortfolioData() {
    try {
        // 1. Profil & Thème
        const aboutDoc = await db.collection('portfolio').doc('about').get();
        if (aboutDoc.exists) {
            const data = aboutDoc.data();
            document.getElementById('pub-name').innerText = data.name || 'Mon Nom';
            document.getElementById('pub-title').innerText = data.title || 'Mon Titre';
            document.getElementById('pub-bio').innerText = data.bio || 'Ma Biographie';
            applyTheme(data.themeColor);
            
            // Liens de contact
            const contactDiv = document.getElementById('contact-links');
            contactDiv.innerHTML = `
                ${data.email ? `<p>📧 Email : <a href="mailto:${data.email}">${data.email}</a></p>` : ''}
                ${data.github ? `<p>💻 GitHub : <a href="${data.github}" target="_blank">${data.github}</a></p>` : ''}
                ${data.linkedin ? `<p>👔 LinkedIn : <a href="${data.linkedin}" target="_blank">${data.linkedin}</a></p>` : ''}
            `;
        }

        // 2. Projets
        const projectsSnapshot = await db.collection('projects').orderBy('date', 'desc').get();
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        projectsSnapshot.forEach(doc => {
            const p = doc.data();
            const tags = p.tech.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
            projectsContainer.innerHTML += `
                <div class="card">
                    ${p.image ? `<img src="${p.image}" alt="${p.title}" style="width:100%; border-radius:4px; margin-bottom:10px;">` : ''}
                    <h3>${p.title}</h3>
                    <small style="color:var(--text-muted)">${p.date}</small>
                    <p style="margin: 10px 0;">${p.description}</p>
                    <div>${tags}</div>
                    <div style="margin-top: 15px;">
                        ${p.github ? `<a href="${p.github}" target="_blank" style="margin-right:15px;">⚙️ GitHub</a>` : ''}
                        ${p.demo ? `<a href="${p.demo}" target="_blank">🚀 Démo</a>` : ''}
                    </div>
                </div>
            `;
        });

        // 3. Compétences
        const skillsSnapshot = await db.collection('skills').get();
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = '';
        skillsSnapshot.forEach(doc => {
            const s = doc.data();
            skillsContainer.innerHTML += `<span class="tag" style="font-size:1rem; padding:5px 15px; margin: 5px;">${s.name}</span>`;
        });

        // 4. Write-ups
        const writeupsSnapshot = await db.collection('writeups').orderBy('date', 'desc').get();
        const writeupsContainer = document.getElementById('writeups-container');
        writeupsContainer.innerHTML = '';
        writeupsSnapshot.forEach(doc => {
            const w = doc.data();
            writeupsContainer.innerHTML += `
                <div class="card">
                    <span class="tag" style="float:right;">${w.category}</span>
                    <h3>${w.title}</h3>
                    <small style="color:var(--text-muted)">${w.date}</small>
                    <p style="margin-top:10px;">${w.description}</p>
                    ${w.link ? `<a href="${w.link}" target="_blank" style="display:inline-block; margin-top:10px;">📖 Lire le write-up →</a>` : ''}
                </div>
            `;
        });

    } catch (error) {
        console.error("Erreur lors du chargement des données : ", error);
    }
}

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', loadPortfolioData);