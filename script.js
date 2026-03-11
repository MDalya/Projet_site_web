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
    // Connexion normale
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.addEventListener('click', () => {
        const nom = document.getElementById('loginNom').value.trim();
        const prenom = document.getElementById('loginPrenom').value.trim();
        const mail = document.getElementById('loginMail').value.trim();
        if (!nom || !prenom || !mail) return alert("Remplissez tous les champs !");
        
        localStorage.setItem('userNom', `${nom} ${prenom}`);
        localStorage.setItem('userMail', mail);
        location.reload();
    });

    // Connexion invité
    const guestBtn = document.getElementById('guestBtn');
    if(guestBtn) guestBtn.addEventListener('click', () => {
        localStorage.setItem('userNom', "Invité");
        localStorage.setItem('userMail', "guest");
        location.reload();
    });

    // Gestion des actions de tâches via délégation
    const grid = document.getElementById('taskGrid');
    if(grid) grid.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        if (e.target.classList.contains('btn-term')) updateDoc(doc(db, "tasks", id), { status: 'termine' });
        if (e.target.classList.contains('btn-suppr')) deleteDoc(doc(db, "tasks", id));
    });

    // Initialisation affichage
    if (localStorage.getItem('userMail')) showApp();
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
                    <button class="btn-term" data-id="${d.id}">✓</button>
                    <button class="btn-suppr" data-id="${d.id}">X</button>
                </div>`;
        });
    });
}