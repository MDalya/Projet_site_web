document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('dalyaTasks')) || [];
    const taskGrid = document.getElementById('taskGrid');
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');

    function render() {
        taskGrid.innerHTML = "";
        let completed = 0;
        
        tasks.forEach(t => {
            if(t.status === 'termine') completed++;
            
            const card = document.createElement('div');
            card.className = 'card';
            // On ajoute les boutons avec des classes spécifiques pour le style
            card.innerHTML = `
                <h3>${t.text}</h3>
                <p>Catégorie: ${t.category}</p>
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button class="btn-termine" onclick="update(${t.id})">${t.status === 'termine' ? '✅' : 'En cours'}</button>
                    <button class="btn-supprimer" onclick="supprimer(${t.id})">Supprimer</button>
                </div>
            `;
            taskGrid.appendChild(card);
        });

        // Mise à jour de la barre
        const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
        document.getElementById('progressBar').style.width = percent + "%";
        document.getElementById('statsText').innerText = `${Math.round(percent)}% des tâches complétées`;
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
    }

    // Ajouter une tâche
    document.getElementById('addBtn').onclick = () => {
        const text = taskInput.value;
        if(text) {
            tasks.push({id: Date.now(), text, category: taskCategory.value, status: 'encours'});
            taskInput.value = "";
            render();
        }
    };

    // Changer statut
    window.update = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, status: t.status === 'encours' ? 'termine' : 'encours'} : t);
        render();
    };

    // Supprimer
    window.supprimer = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        render();
    };

    render();
});