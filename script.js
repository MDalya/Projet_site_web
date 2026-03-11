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
    // 1. Gestion Connexion
    const loginBtn = document.getElementById('loginBtn');
    const guestBtn = document.getElementById('guestBtn');

    if(loginBtn) loginBtn.addEventListener('click', () => {
        const n = document.getElementById('loginNom').value.trim();
        const p = document.getElementById('loginPrenom').value.trim();
        const m = document.getElementById('loginMail').value.trim();
        if(!n || !p || !m) return alert("Remplissez tout !");
        localStorage.setItem('userNom', n + " " + p);
        localStorage.setItem('userMail', m);
        location.reload();
    });

    if(guestBtn) guestBtn.addEventListener('click', () => {
        localStorage.setItem('userNom', "Invité");
        localStorage.setItem('userMail', "guest");
        location.reload();
    });

    // 2. Gestion Grille (Délégation)
    const grid = document.getElementById('taskGrid');
    if(grid) grid.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if(!id) return;
        
        if (e.target.classList.contains('btn-term')) await updateDoc(doc(db, "tasks", id), { status: 'termine' });
        if (e.target.classList.contains('btn-suppr')) await deleteDoc(doc(db, "tasks", id));
    });

    // 3. Charger App
    if(localStorage.getItem('userMail')) showApp();
});

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userName').innerText = localStorage.getItem('userNom');
    loadTasks();
}

function loadTasks() {
    onSnapshot(query(collection(db, "tasks"), where("user", "==", localStorage.getItem('userMail'))), (snapshot) => {
        const grid = document.getElementById('taskGrid');
        grid.innerHTML = "";
        snapshot.forEach(d => {
            grid.innerHTML += `
                <div class="card">
                    <h3>${d.data().text}</h3>
                    <button class="btn-term" data-id="${d.id}">Terminé</button>
                    <button class="btn-suppr" data-id="${d.id}">Supprimer</button>
                </div>`;
        });
    });
}