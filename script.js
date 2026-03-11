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

// Variables globales
let tasks = [];
const loginPage = document.getElementById('loginPage');
const appDiv = document.getElementById('app');

// Vérification session
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
    loginPage.style.display = 'none';
    appDiv.style.display = 'block';
    document.getElementById('userName').innerText = localStorage.getItem('userNom');
    loadTasks();
}

function loadTasks() {
    const q = query(collection(db, "tasks"), where("user", "==", localStorage.getItem('userMail')));
    onSnapshot(q, (snapshot) => {
        tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        render();
    });
}

// ... Tes fonctions render, update (avec updateDoc), supprimer (avec deleteDoc) et addTask (avec addDoc) ...
// (N'oublie pas d'utiliser les fonctions Firebase importées en haut !)

document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location.reload(); };