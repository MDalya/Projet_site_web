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
    const loginBtn = document.getElementById('loginBtn');
    const guestBtn = document.getElementById('guestBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const addBtn = document.getElementById('addBtn');

    // Connexion avec validation
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const n = document.getElementById('loginNom').value.trim();
            const p = document.getElementById('loginPrenom').value.trim();
            const m = document.getElementById('loginMail').value.trim();
            if (!n || !p || !m) return alert("Merci de remplir tous les champs !");
            
            localStorage.setItem('userNom', `${n} ${p}`);
            localStorage.setItem('userMail', m);
            window.location.reload();
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            localStorage.setItem('userNom', "Invité");
            localStorage.setItem('userMail', "guest");
            localStorage.removeItem('userAvatar'); // L'invité n'a jamais de photo perso
            window.location.reload();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.reload();
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', async () => {
            const input = document.getElementById('taskInput');
            if (input.value.trim()) {
                await addDoc(collection(db, "tasks"), {
                    text: input.value,
                    category: document.getElementById('taskCategory').value,
                    user: localStorage.getItem('userMail'),
                    status: 'indetermine'
                });
                input.value = "";
            }
        });
    }

    // Affichage au chargement
    const userMail = localStorage.getItem('userMail');
    if (userMail) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('userName').innerText = localStorage.getItem('userNom');
        
        // Gestion de la photo de profil
        const imgElement = document.getElementById('profileImg');
        const savedAvatar = localStorage.getItem('userAvatar');
        
        if (userMail === "guest" || !savedAvatar) {
            imgElement.src = "icons/default-pp.png";
        } else {
            imgElement.src = savedAvatar;
        }
        
        loadTasks(userMail);
    }
});

function loadTasks(userMail) {
    const grid = document.getElementById('taskGrid');
    onSnapshot(query(collection(db, "tasks"), where("user", "==", userMail)), (snapshot) => {
        grid.innerHTML = "";
        snapshot.forEach(d => {
            const t = d.data();
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${t.text}</h3>
                <div class="card-actions">
                    <button class="btn-suppr" data-id="${d.id}">Supprimer</button>
                </div>`;
            card.querySelector('.btn-suppr').onclick = () => deleteDoc(doc(db, "tasks", d.id));
            grid.appendChild(card);
        });
    });
}