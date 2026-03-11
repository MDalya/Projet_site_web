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
            card.innerHTML = `
                <h3>${t.text}</h3>
                <small>${t.category}</small>
                <button onclick="toggleStatus(${t.id})">${t.status === 'termine' ? '✅ Terminé' : 'En cours'}</button>
                <button class="btn-supprimer" onclick="supprimer(${t.id})">Supprimer</button>
            `;
            taskGrid.appendChild(card);
        });

        const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
        document.getElementById('progressBar').style.width = percent + "%";
        document.getElementById('statsText').innerText = `${Math.round(percent)}% des tâches complétées`;
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
    }

    document.getElementById('addBtn').onclick = () => {
        if(taskInput.value) {
            tasks.push({id: Date.now(), text: taskInput.value, category: taskCategory.value, status: 'encours'});
            taskInput.value = "";
            render();
        }
    };

    window.toggleStatus = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, status: t.status === 'encours' ? 'termine' : 'encours'} : t);
        render();
    };

    window.supprimer = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        render();
    };

    render();
});