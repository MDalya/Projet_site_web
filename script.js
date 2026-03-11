document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('dalyaTasks')) || [];
    const catEmojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };
    
    // Upload image
    const fileInput = document.getElementById('fileInput');
    const profileImg = document.getElementById('profileImg');
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) profileImg.src = savedAvatar;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImg.src = event.target.result;
                localStorage.setItem('userAvatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    function render() {
        const taskGrid = document.getElementById('taskGrid');
        taskGrid.innerHTML = "";
        
        let completed = tasks.filter(t => t.status === 'termine').length;
        const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
        
        document.getElementById('progressBar').style.width = percent + "%";
        document.getElementById('statsText').innerText = `${percent}% des tâches complétées`;

        tasks.forEach(t => {
            const card = document.createElement('div');
            card.className = `card ${t.status}`;
            card.innerHTML = `
                <h3>${catEmojis[t.category] || ''} ${t.text}</h3>
                <button class="btn-encours" onclick="update(${t.id}, 'encours')">En cours</button>
                <button class="btn-termine" onclick="update(${t.id}, 'termine')">Terminé</button>
                <button class="btn-attente" onclick="update(${t.id}, 'attente')">En attente</button>
                <button class="btn-supprimer" onclick="supprimer(${t.id})">Supprimer</button>
            `;
            taskGrid.appendChild(card);
        });
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
    }

    window.update = (id, status) => {
        tasks = tasks.map(t => t.id === id ? {...t, status} : t);
        render();
    };

    window.supprimer = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        render();
    };

    document.getElementById('addBtn').onclick = () => {
        const input = document.getElementById('taskInput');
        const cat = document.getElementById('taskCategory');
        if(input.value) {
            tasks.push({id: Date.now(), text: input.value, category: cat.value, status: 'encours'});
            input.value = "";
            render();
        }
    };
    render();
});