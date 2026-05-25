// CONFIGURATION DE SECURITE STRICTE (Remplacer par votre email de contrôle)
const ALLOWED_ADMIN_EMAIL = "omardjamaabdi59@gmail.com";

// Surveillance de l'état d'authentification
auth.onAuthStateChanged(user => {
    if (user && user.email === ALLOWED_ADMIN_EMAIL) {
        showAdminZone();
    } else {
        if(user) auth.signOut(); // Force la déconnexion si l'utilisateur n'est pas l'admin désigné
        showLoginZone();
    }
});

// Gestion de la Connexion
document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const errorDiv = document.getElementById('login-error');

    if(email !== ALLOWED_ADMIN_EMAIL) {
        errorDiv.innerText = "Accès non autorisé.";
        errorDiv.classList.remove('hidden');
        return;
    }

    auth.signInWithEmailAndPassword(email, pass)
        .catch(err => {
            errorDiv.innerText = "Erreur d'authentification : " + err.message;
            errorDiv.classList.remove('hidden');
        });
});

// Déconnexion
document.getElementById('btn-logout').addEventListener('click', () => {
    auth.signOut().then(() => location.reload());
});

function showLoginZone() {
    document.getElementById('login-zone').classList.remove('hidden');
    document.getElementById('admin-zone').classList.add('hidden');
}

function showAdminZone() {
    document.getElementById('login-zone').classList.add('hidden');
    document.getElementById('admin-zone').classList.remove('hidden');
    loadAdminData();
}

// Fonction utilitaire d'affichage des notifications flash (Sauvegarde auto / Confirmation)
function showStatus(text, isError = false) {
    const statusDiv = document.getElementById('global-status');
    statusDiv.innerText = text;
    statusDiv.className = `status-msg ${isError ? 'status-error' : 'status-success'}`;
    statusDiv.classList.remove('hidden');
    setTimeout(() => statusDiv.classList.add('hidden'), 4000);
}

// CHARGEMENT ET UPDATE DE LA BASE DE DONNEES VIA LE DASHBOARD

async function loadAdminData() {
    // Remplissage du formulaire d'identité "À propos"
    const aboutDoc = await db.collection('portfolio').doc('about').get();
    if(aboutDoc.exists) {
        const d = aboutDoc.data();
        document.getElementById('adm-name').value = d.name || '';
        document.getElementById('adm-title').value = d.title || '';
        document.getElementById('adm-bio').value = d.bio || '';
        document.getElementById('adm-email').value = d.email || '';
        document.getElementById('adm-github').value = d.github || '';
        document.getElementById('adm-linkedin').value = d.linkedin || '';
        document.getElementById('adm-theme').value = d.themeColor || '#00ff66';
    }

    // Abonnements temps réel (Mise à jour automatique de l'interface admin)
    db.collection('skills').onSnapshot(snap => {
        const container = document.getElementById('adm-skills-list');
        container.innerHTML = '';
        snap.forEach(doc => {
            container.innerHTML += `
                <div style="display:inline-block; margin:5px; padding:5px 10px; background:#21262d; border-radius:4px;">
                    ${doc.data().name} <button onclick="deleteDoc('skills','${doc.id}')" style="padding:2px 5px; margin-left:5px;" class="btn-danger">X</button>
                </div>
            `;
        });
    });

    db.collection('projects').orderBy('date','desc').onSnapshot(snap => {
        const container = document.getElementById('adm-projects-list');
        container.innerHTML = '';
        snap.forEach(doc => {
            const p = doc.data();
            container.innerHTML += `
                <div style="padding:10px; border-bottom:1px solid var(--border-color); display:flex; justify-content:between; align-items:center;">
                    <div style="flex-grow:1;"><strong>${p.title}</strong> (${p.date})</div>
                    <button onclick="deleteDoc('projects','${doc.id}')" class="btn-danger">Supprimer</button>
                </div>
            `;
        });
    });

    db.collection('writeups').orderBy('date','desc').onSnapshot(snap => {
        const container = document.getElementById('adm-writeups-list');
        container.innerHTML = '';
        snap.forEach(doc => {
            const w = doc.data();
            container.innerHTML += `
                <div style="padding:10px; border-bottom:1px solid var(--border-color); display:flex; justify-content:between; align-items:center;">
                    <div style="flex-grow:1;"><strong>${w.title}</strong> [${w.category}]</div>
                    <button onclick="deleteDoc('writeups','${doc.id}')" class="btn-danger">Supprimer</button>
                </div>
            `;
        });
    });
}

// Soumission Formulaire À propos (Sauvegarde Générale)
document.getElementById('form-about').addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('portfolio').doc('about').set({
        name: document.getElementById('adm-name').value,
        title: document.getElementById('adm-title').value,
        bio: document.getElementById('adm-bio').value,
        email: document.getElementById('adm-email').value,
        github: document.getElementById('adm-github').value,
        linkedin: document.getElementById('adm-linkedin').value,
        themeColor: document.getElementById('adm-theme').value
    }).then(() => showStatus("Modifications globales publiées avec succès !"))
      .catch(err => showStatus("Erreur : " + err.message, true));
});

// Ajout Compétence
document.getElementById('form-skill').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('skill-name');
    db.collection('skills').add({ name: input.value })
        .then(() => { input.value = ''; showStatus("Compétence ajoutée."); });
});

// Ajout Projet
document.getElementById('form-project').addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('projects').add({
        title: document.getElementById('proj-title').value,
        date: document.getElementById('proj-date').value,
        description: document.getElementById('proj-desc').value,
        tech: document.getElementById('proj-tech').value,
        github: document.getElementById('proj-github').value,
        demo: document.getElementById('proj-demo').value,
        image: document.getElementById('proj-img').value
    }).then(() => { document.getElementById('form-project').reset(); showStatus("Projet ajouté sur l'espace public."); });
});

// Ajout Write-up
document.getElementById('form-writeup').addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('writeups').add({
        title: document.getElementById('wp-title').value,
        category: document.getElementById('wp-cat').value,
        date: document.getElementById('wp-date').value,
        link: document.getElementById('wp-link').value,
        description: document.getElementById('wp-desc').value
    }).then(() => { document.getElementById('form-writeup').reset(); showStatus("Write-up publié."); });
});

// Fonction globale de suppression (appelée directement par les boutons générés)
window.deleteDoc = function(collection, id) {
    if(confirm("Confirmer la suppression définitive ?")) {
        db.collection(collection).doc(id).delete()
            .then(() => showStatus("Élément supprimé de la base de données."));
    }
}