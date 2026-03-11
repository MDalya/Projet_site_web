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
    const userMail = localStorage.getItem('userMail');

    // --- CONNEXION ---
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        const n = document.getElementById('loginNom').value.trim();
        const p = document.getElementById('loginPrenom').value.trim();
        const m = document.getElementById('loginMail').value.trim();
        if (!n || !p || !m) return alert("Remplissez tout !");
        localStorage.setItem('userNom', `${n} ${p}`);
        localStorage.setItem('userMail', m);
        window.location.reload();
    });

    document.getElementById('guestBtn')?.addEventListener('click', () => {
        localStorage.setItem('userNom', "Invité");
        localStorage.setItem('userMail', "guest");
        window.location.reload();
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.reload();
    });

    // --- PHOTO DE PROFIL ---
    const fileInput = document.getElementById('fileInput');
    const avatarLabel = document.getElementById('avatarLabel');
    if (userMail === "guest") {
        avatarLabel.style.cursor = "default";
        avatarLabel.style.pointerEvents = "none";
    } else {
        fileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('profileImg').src = ev.target.result;
                    localStorage.setItem('userAvatar', ev.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- AJOUT TACHE ---
    document.getElementById('addBtn')?.addEventListener('click', async () => {
        const input = document.getElementById('taskInput');
        if (input.value.trim()) {
            await addDoc(collection(db, "tasks"), {
                text: input.value,
                category: document.getElementById('taskCategory').value,
                user: userMail,
                status: 'indetermine'
            });
            input.value = "";
        }
    });

    // --- INITIALISATION ---
    if (userMail) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('userName').innerText = localStorage.getItem('userNom');
        
        const savedAvatar = localStorage.getItem('userAvatar');
        if (userMail !== "guest" && savedAvatar) {
            document.getElementById('profileImg').src = savedAvatar;
        }
        
        loadTasks(userMail);
    }
});

function loadTasks(userMail) {
    const grid = document.getElementById('taskGrid');
    const emojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };
    const statusColors = { 'termine': '#238636', 'encours': '#f7931a', 'indetermine': '#8250df' };

    onSnapshot(query(collection(db, "tasks"), where("user", "==", userMail)), (snapshot) => {
        grid.innerHTML = "";
        snapshot.forEach(d => {
            const t = d.data();
            const color = statusColors[t.status] || '#8250df';
            const card = document.createElement('div');
            card.className = 'card';
            card.style.borderLeft = `5px solid ${color}`;
            card.innerHTML = `
                <h3>${emojis[t.category] || '📌'} ${t.text}</h3>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button class="b-st" data-s="termine" style="background:#238636; border:none; color:white; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:10px;">Fait</button>
                    <button class="b-st" data-s="encours" style="background:#f7931a; border:none; color:white; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:10px;">Cours</button>
                    <button class="b-st" data-s="indetermine" style="background:#8250df; border:none; color:white; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:10px;">Attente</button>
                    <button class="b-del" style="background:#f85149; border:none; color:white; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:10px; margin-left:auto;">X</button>
                </div>`;
            
            card.querySelectorAll('.b-st').forEach(b => b.onclick = () => updateDoc(doc(db, "tasks", d.id), { status: b.dataset.s }));
            card.querySelector('.b-del').onclick = () => deleteDoc(doc(db, "tasks", d.id));
            grid.appendChild(card);
        });
    });
}