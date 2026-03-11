import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = { /* REMPLACE PAR TON OBJET CONFIG */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const catEmojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };

if (localStorage.getItem('userMail')) showApp();

document.getElementById('loginBtn').onclick = () => {
    const nom = document.getElementById('loginNom').value;
    const prenom = document.getElementById('loginPrenom').value;
    const mail = document.getElementById('loginMail').value;
    localStorage.setItem('userMail', mail);
    localStorage.setItem('userNom', `${nom} ${prenom}`);
    showApp();
};

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userName').innerText = localStorage.getItem('userNom');
    if(localStorage.getItem('userAvatar')) document.getElementById('profileImg').src = localStorage.getItem('userAvatar');
    loadTasks();
}

document.getElementById('fileInput').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('profileImg').src = event.target.result;
        localStorage.setItem('userAvatar', event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
});

function loadTasks() {
    const statusConfig = {
        'encours': { color: '#f7931a', label: 'En cours' },
        'termine': { color: '#238636', label: 'Terminé' },
        'indetermine': { color: '#8250df', label: 'Non déterminé' }
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

window.update = (id, status) => updateDoc(doc(db, "tasks", id), { status });
window.supprimer = (id) => deleteDoc(doc(db, "tasks", id));
document.getElementById('addBtn').onclick = () => {
    addDoc(collection(db, "tasks"), { text: document.getElementById('taskInput').value, category: document.getElementById('taskCategory').value, user: localStorage.getItem('userMail'), status: 'indetermine' });
};
document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location.reload(); };