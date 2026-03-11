document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('dalyaTasks')) || [];
    const catEmojis = { 'Cours': '📚', 'Perso': '🏠', 'Travail': '💼', 'Asso': '🤝' };

    function render() {
        const taskGrid = document.getElementById('taskGrid');
        taskGrid.innerHTML = "";
        tasks.forEach(t => {
            const card = document.createElement('div');
            card.className = `card ${t.status}`;
            card.innerHTML = `
                <h3>${catEmojis[t.category]} ${t.text}</h3>
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
        const text = document.getElementById('taskInput').value;
        const category = document.getElementById('taskCategory').value;
        if(text) {
            tasks.push({id: Date.now(), text, category, status: 'encours'});
            document.getElementById('taskInput').value = "";
            render();
        }
    };
    render();
});