import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

// --- Logique Dashboard ---
const userMail = localStorage.getItem('userMail');
if (userMail) showApp();

document.getElementById('loginBtn').onclick = () => {
    localStorage.setItem('userMail', document.getElementById('loginMail').value);
    localStorage.setItem('userNom', document.getElementById('loginNom').value);
    showApp();
};

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('userName').innerText = localStorage.getItem('userNom');
    loadTasks();
}

function loadTasks() {
    const q = query(collection(db, "tasks"), where("user", "==", localStorage.getItem('userMail')));
    onSnapshot(q, (snapshot) => {
        const taskGrid = document.getElementById('taskGrid');
        taskGrid.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = "card";
            card.innerHTML = `<h3>${data.text}</h3><button onclick="supprimer('${doc.id}')">Supprimer</button>`;
            taskGrid.appendChild(card);
        });
    });
}

document.getElementById('addBtn').onclick = async () => {
    const text = document.getElementById('taskInput').value;
    await addDoc(collection(db, "tasks"), { text, user: localStorage.getItem('userMail') });
};

window.supprimer = async (id) => { await deleteDoc(doc(db, "tasks", id)); };

document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location.reload(); };