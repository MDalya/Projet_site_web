import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = { /* TON OBJET CONFIG ICI */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const catEmojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };

if (localStorage.getItem('userMail')) showApp();

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userName').innerText = localStorage.getItem('userNom');
    if(localStorage.getItem('userAvatar')) document.getElementById('profileImg').src = localStorage.getItem('userAvatar');
    loadTasks();
}

document.getElementById('loginBtn').onclick = () => {
    localStorage.setItem('userNom', `${document.getElementById('loginNom').value} ${document.getElementById('loginPrenom').value}`);
    localStorage.setItem('userMail', document.getElementById('loginMail').value);
    showApp();
};

document.getElementById('guestBtn').onclick = () => {
    localStorage.setItem('userNom', "Invité");
    localStorage.setItem('userMail', "guest");
    showApp();
};

function loadTasks() {
    const statusConfig = {
        'encours': { color: '#f7931a' },
        'termine': { color: '#238636' },
        'indetermine': { color: '#8250df' }
    };
    onSnapshot(query(collection(db, "tasks"), where("user", "==", localStorage.getItem('userMail'))), (snapshot) => {
        const grid = document.getElementById('taskGrid');
        grid.innerHTML = "";
        snapshot.forEach(doc => {
            const t = doc.data();
            const s = t.status || 'indetermine';
            grid.innerHTML += `
                <div class="card" style="border-left: 5px solid ${statusConfig[s].color};">
                    <h3>${catEmojis[t.category] || ''} ${t.text}</h3>
                    <div class="card-actions">
                        <button onclick="window.update('${doc.id}', 'termine')">✓</button>
                        <button onclick="window.update('${doc.id}', 'encours')">⏳</button>
                        <button onclick="window.update('${doc.id}', 'indetermine')">❓</button>
                        <button class="btn-supprimer" onclick="window.supprimer('${doc.id}')">X</button>
                    </div>
                </div>`;
        });
    });
}

document.getElementById('addBtn').onclick = () => {
    addDoc(collection(db, "tasks"), { text: document.getElementById('taskInput').value, category: document.getElementById('taskCategory').value, user: localStorage.getItem('userMail'), status: 'indetermine' });
};
window.update = (id, status) => updateDoc(doc(db, "tasks", id), { status });
window.supprimer = (id) => deleteDoc(doc(db, "tasks", id));
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location.reload(); };