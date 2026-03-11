import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDS6qeoE5mZ6vQbaEuY5mLG76CEhlyFyAc",
    authDomain: "projet-site-web-portfolio.firebaseapp.com",
    projectId: "projet-site-web-portfolio",
    storageBucket: "projet-site-web-portfolio.firebasestorage.app",
    messagingSenderId: "646439541766",
    appId: "1:646439541766:web:610bca11a9c95767a7b787",
    measurementId: "G-34K5W24YCK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // --- GESTION CONNEXION ---
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.addEventListener('click', () => {
        const n = document.getElementById('loginNom').value.trim();
        const p = document.getElementById('loginPrenom').value.trim();
        const m = document.getElementById('loginMail').value.trim();
        if (!n || !p || !m) return alert("Remplissez tous les champs !");
        localStorage.setItem('userNom', `${n} ${p}`);
        localStorage.setItem('userMail', m);
        location.reload();
    });

    const guestBtn = document.getElementById('guestBtn');
    if (guestBtn) guestBtn.addEventListener('click', () => {
        localStorage.setItem('userNom', "Invité");
        localStorage.setItem('userMail', "guest");
        localStorage.removeItem('userAvatar');
        location.reload();
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    // --- GESTION TÂCHES ---
    const addBtn = document.getElementById('addBtn');
    if (addBtn) addBtn.addEventListener('click', () => {
        const input = document.getElementById('taskInput');
        if (input.value.trim()) {
            addDoc(collection(db, "tasks"), {
                text: input.value,
                category: document.getElementById('taskCategory').value,
                user: localStorage.getItem('userMail'),
                status: 'indetermine'
            });
            input.value = "";
        }
    });

    // Délégation d'événements pour les boutons dans les cartes
    const grid = document.getElementById('taskGrid');
    if (grid) grid.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        if (e.target.classList.contains('btn-term')) updateDoc(doc(db, "tasks", id), { status: 'termine' });
        else if (e.target.classList.contains('btn-encours')) updateDoc(doc(db, "tasks", id), { status: 'encours' });
        else if (e.target.classList.contains('btn-indet')) updateDoc(doc(db, "tasks", id), { status: 'indetermine' });
        else if (e.target.classList.contains('btn-suppr')) deleteDoc(doc(db, "tasks", id));
    });

    // --- INITIALISATION ---
    if (localStorage.getItem('userMail')) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('userName').innerText = localStorage.getItem('userNom');
        
        // Photo par défaut si invité
        const avatar = localStorage.getItem('userAvatar');
        document.getElementById('profileImg').src = avatar || "medias/default-avatar.png";
        
        loadTasks();
    }
});

function loadTasks() {
    const statusColors = { 'encours': '#f7931a', 'termine': '#238636', 'indetermine': '#8250df' };
    const emojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };

    onSnapshot(query(collection(db, "tasks"), where("user", "==", localStorage.getItem('userMail'))), (snapshot) => {
        const grid = document.getElementById('taskGrid');
        grid.innerHTML = "";
        snapshot.forEach(d => {
            const t = d.data();
            grid.innerHTML += `
                <div class="card" style="border-left: 5px solid ${statusColors[t.status] || '#8250df'};">
                    <h3>${emojis[t.category] || '📌'} ${t.text}</h3>
                    <div class="card-actions">
                        <button class="btn-term" data-id="${d.id}">✓</button>
                        <button class="btn-encours" data-id="${d.id}">⏳</button>
                        <button class="btn-indet" data-id="${d.id}">❓</button>
                        <button class="btn-suppr btn-supprimer" data-id="${d.id}">X</button>
                    </div>
                </div>`;
        });
    });
}