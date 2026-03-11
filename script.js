document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskGrid = document.getElementById('taskGrid');

    // 1. Charger les tâches sauvegardées au démarrage
    let tasks = JSON.parse(localStorage.getItem('dalyaTasks')) || [];
    renderTasks();

    // 2. Ajouter une tâche
    addBtn.addEventListener('click', () => {
        if (taskInput.value.trim() === "") return;

        const newTask = {
            id: Date.now(),
            text: taskInput.value,
            category: taskCategory.value,
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();
        taskInput.value = "";
    });

    // 3. Fonction pour dessiner la grille
    function renderTasks() {
        taskGrid.innerHTML = "";
        tasks.sort((a, b) => b.id - a.id).forEach(task => {
            const card = document.createElement('div');
            card.className = `card ${task.completed ? 'is-completed' : ''}`;
            card.innerHTML = `
                <div class="card-image">
                    <img src="https://ui-avatars.com/api/?name=${task.category}&background=random" alt="cat">
                </div>
                <div class="card-content">
                    <small>${task.category}</small>
                    <h3>${task.text}</h3>
                    <div class="card-buttons">
                        <button class="green" onclick="toggleTask(${task.id})">${task.completed ? '🔄 Refaire' : '✅ Terminé'}</button>
                        <button class="blue" onclick="deleteTask(${task.id})">🗑️ Supprimer</button>
                    </div>
                </div>
            `;
            taskGrid.appendChild(card);
        });
    }

    // 4. Fonctions globales (accessibles par onclick)
    window.toggleTask = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        saveAndRender();
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    };

    function saveAndRender() {
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
        renderTasks();
    }
});