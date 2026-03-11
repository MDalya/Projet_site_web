import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// --- CONFIGURATION FIREBASE ---
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

// --- LOGIQUE APPLICATION ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Boutons Connexion / Invité
    document.getElementById('loginBtn').addEventListener('click', () => {
        localStorage.setItem('userNom', `${document.getElementById('loginNom').value} ${document.getElementById('loginPrenom').value}`);
        localStorage.setItem('userMail', document.getElementById('loginMail').value);
        showApp();
    });

    document.getElementById('guestBtn').addEventListener('click', () => {
        localStorage.setItem('userNom', "Invité");
        localStorage.setItem('userMail', "guest");
        showApp();
    });

    // Ajout Tâche
    document.getElementById('addBtn').addEventListener('click', () => {
        const input = document.getElementById('taskInput');
        if(input.value) {
            addDoc(collection(db, "tasks"), { 
                text: input.value, 
                category: document.getElementById('taskCategory').value, 
                user: localStorage.getItem('userMail'), 
                status: 'indetermine' 
            });
            input.value = "";
        }
    });

    // Déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => { 
        localStorage.clear(); 
        location.reload(); 
    });

    // Gestion boutons de tâches (Délégation d'événements)
    document.getElementById('taskGrid').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        if (e.target.classList.contains('btn-term')) updateDoc(doc(db, "tasks", id), { status: 'termine' });
        else if (e.target.classList.contains('btn-encours')) updateDoc(doc(db, "tasks", id), { status: 'encours' });
        else if (e.target.classList.contains('btn-indet')) updateDoc(doc(db, "tasks", id), { status: 'indetermine' });
        else if (e.target.classList.contains('btn-supprimer')) deleteDoc(doc(db, "tasks", id));
    });

    if (localStorage.getItem('userMail')) showApp();
});

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userName').innerText = localStorage.getItem('userNom');
    loadTasks();
}

function loadTasks() {
    const statusConfig = { 'encours': '#f7931a', 'termine': '#238636', 'indetermine': '#8250df' };
    const catEmojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };

    onSnapshot(query(collection(db, "tasks"), where("user", "==", localStorage.getItem('userMail'))), (snapshot) => {
        const grid = document.getElementById('taskGrid');
        grid.innerHTML = "";
        snapshot.forEach(d => {
            const t = d.data();
            grid.innerHTML += `
                <div class="card" style="border-left: 5px solid ${statusConfig[t.status || 'indetermine']};">
                    <h3>${catEmojis[t.category]} ${t.text}</h3>
                    <div class="card-actions">
                        <button class="btn-term" data-id="${d.id}">✓</button>
                        <button class="btn-encours" data-id="${d.id}">⏳</button>
                        <button class="btn-indet" data-id="${d.id}">❓</button>
                        <button class="btn-supprimer" data-id="${d.id}">X</button>
                    </div>
                </div>`;
        });
    });
}