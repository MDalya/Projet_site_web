document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('dalyaTasks')) || [];
    const taskGrid = document.getElementById('taskGrid');

    function render() {
        taskGrid.innerHTML = "";
        let completedCount = 0;

        tasks.forEach(t => {
            if(t.status === 'termine') completedCount++;
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${t.text} (${t.cat})</h3>
                <div class="card-buttons">
                    <button class="btn-encours" onclick="update(${t.id}, 'encours')">En cours</button>
                    <button class="btn-termine" onclick="update(${t.id}, 'termine')">Terminé</button>
                    <button class="btn-supprimer" onclick="del(${t.id})">Supprimer</button>
                </div>
            `;
            taskGrid.appendChild(card);
        });

        // Actualisation barre progression
        const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
        document.getElementById('progressBar').style.width = pct + "%";
        document.getElementById('statsText').innerText = pct + "% des tâches complétées";
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
    }

    document.getElementById('addBtn').onclick = () => {
        const text = document.getElementById('taskInput').value;
        const cat = document.getElementById('taskCategory').value;
        if(text) {
            tasks.push({id: Date.now(), text, cat, status: 'encours'});
            document.getElementById('taskInput').value = "";
            render();
        }
    };

    window.update = (id, status) => {
        tasks = tasks.map(t => t.id === id ? {...t, status} : t);
        render();
    };

    window.del = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        render();
    };

    render();
});