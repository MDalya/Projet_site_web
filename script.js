import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = { /* TON CONFIG ICI */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Connexion avec validation
    document.getElementById('loginBtn').addEventListener('click', () => {
        const n = document.getElementById('loginNom').value.trim();
        const p = document.getElementById('loginPrenom').value.trim();
        const m = document.getElementById('loginMail').value.trim();
        if (!n || !p || !m) return alert("Remplissez tous les champs !");
        
        localStorage.setItem('userNom', `${n} ${p}`);
        localStorage.setItem('userMail', m);
        showApp();
    });

    document.getElementById('guestBtn').addEventListener('click', () => {
        localStorage.setItem('userNom', "Invité");
        localStorage.setItem('userMail', "guest");
        localStorage.removeItem('userAvatar');
        showApp();
    });

    document.getElementById('addBtn').addEventListener('click', () => {
        const val = document.getElementById('taskInput').value;
        if(val) addDoc(collection(db, "tasks"), { text: val, category: document.getElementById('taskCategory').value, user: localStorage.getItem('userMail'), status: 'indetermine' });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.clear(); location.reload(); });

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
    
    const avatar = localStorage.getItem('userAvatar');
    document.getElementById('profileImg').src = avatar || "medias/default-avatar.png";
    loadTasks();
}

function loadTasks() {
    const statusConfig = { 'En cours': '#f7931a', 'Terminé': '#238636', 'Indéterminé': '#8250df' };
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