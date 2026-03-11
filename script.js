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
    // 1. Boutons de connexion
    const loginBtn = document.getElementById('loginBtn');
    const guestBtn = document.getElementById('guestBtn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => {
        const nom = document.getElementById('loginNom').value.trim();
        const prenom = document.getElementById('loginPrenom').value.trim();
        const mail = document.getElementById('loginMail').value.trim();
        
        if (!nom || !prenom || !mail) return alert("Remplissez tout !");
        
        localStorage.setItem('userNom', nom + " " + prenom);
        localStorage.setItem('userMail', mail);
        location.reload();
    });

    if (guestBtn) guestBtn.addEventListener('click', () => {
        localStorage.setItem('userNom', "Invité");
        localStorage.setItem('userMail', "guest");
        location.reload();
    });

    // 2. Affichage
    if (localStorage.getItem('userMail')) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('userName').innerText = localStorage.getItem('userNom');
    }
});