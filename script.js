import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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
const catEmojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };

// 1. Gestion de la connexion
if (localStorage.getItem('userMail')) showApp();

document.getElementById('loginBtn').onclick = () => {
    const nom = document.getElementById('loginNom').value;
    const prenom = document.getElementById('loginPrenom').value;
    const mail = document.getElementById('loginMail').value;
    
    if (nom && prenom && mail) {
        localStorage.setItem('userMail', mail);
        localStorage.setItem('userNom', `${nom} ${prenom}`);
        showApp();
    }
};

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userName').innerText = localStorage.getItem('userNom');
    
    // Rétablir photo si présente
    const savedImg = localStorage.getItem('userAvatar');
    if(savedImg) document.getElementById('profileImg').src = savedImg;
    
    loadTasks();
}

// 2. Upload Photo (Local)
document.getElementById('fileInput').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('profileImg').src = event.target.result;
        localStorage.setItem('userAvatar', event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
});

// 3. Gestion Tâches Firestore
function loadTasks() {
    const q = query(collection(db, "tasks"), where("user", "==", localStorage.getItem('userMail')));
    onSnapshot(q, (snapshot) => {
        const grid = document.getElementById('taskGrid');
        grid.innerHTML = "";
        snapshot.forEach(doc => {
            const t = doc.data();
            grid.innerHTML += `
                <div class="card">
                    <h3>${catEmojis[t.category] || ''} ${t.text}</h3>
                    <button class="btn-supprimer" onclick="window.supprimer('${doc.id}')">Supprimer</button>
                </div>`;
        });
    });
}

document.getElementById('addBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    const cat = document.getElementById('taskCategory').value;
    if(input.value) {
        addDoc(collection(db, "tasks"), { 
            text: input.value,
            category: cat,
            user: localStorage.getItem('userMail') 
        });
        input.value = "";
    }
};

// Exposer supprimer au scope global pour le bouton HTML
window.supprimer = (id) => deleteDoc(doc(db, "tasks", id));

// 4. Déconnexion
document.getElementById('logoutBtn').onclick = () => { 
    localStorage.clear(); 
    location.reload(); 
};