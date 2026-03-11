import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = { /* TON CONFIG ICI */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Connexion
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

    document.getElementById('addBtn').addEventListener('click', () => {
        addDoc(collection(db, "tasks"), { text: document.getElementById('taskInput').value, category: document.getElementById('taskCategory').value, user: localStorage.getItem('userMail'), status: 'indetermine' });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.clear(); location.reload(); });

    // Délégation d'événements pour les boutons dynamiques
    document.getElementById('taskGrid').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('btn-term')) updateDoc(doc(db, "tasks", id), { status: 'termine' });
        if (e.target.classList.contains('btn-encours')) updateDoc(doc(db, "tasks", id), { status: 'encours' });
        if (e.target.classList.contains('btn-indet')) updateDoc(doc(db, "tasks", id), { status: 'indetermine' });
        if (e.target.classList.contains('btn-supprimer')) deleteDoc(doc(db, "tasks", id));
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