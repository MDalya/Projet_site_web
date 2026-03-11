document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskGrid = document.getElementById('taskGrid');
    let tasks = JSON.parse(localStorage.getItem('dalyaTasks')) || [];

    function updateStats() {
        const total = tasks.length;
        const done = tasks.filter(t => t.completed).length;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        document.getElementById('progressBar').style.width = pct + "%";
        document.getElementById('statsText').innerText = `${pct}% complété`;
    }

    function renderTasks() {
        taskGrid.innerHTML = "";
        tasks.sort((a, b) => b.id - a.id).forEach(task => {
            const card = document.createElement('div');
            card.className = `card ${task.completed ? 'is-completed' : ''}`;
            card.innerHTML = `
                <span class="card-category">${task.category}</span>
                <h3>${task.text}</h3>
                <div class="card-buttons">
                    <button class="btn-task" onclick="toggleTask(${task.id})">${task.completed ? '🔄' : '✅'} Fait</button>
                    <button class="btn-task" onclick="deleteTask(${task.id})">🗑️ Suppr</button>
                </div>
            `;
            taskGrid.appendChild(card);
        });
        updateStats();
    }

    addBtn.addEventListener('click', () => {
        if (taskInput.value.trim() === "") return;
        tasks.push({ id: Date.now(), text: taskInput.value, category: taskCategory.value, completed: false });
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
        taskInput.value = "";
        renderTasks();
    });

    window.toggleTask = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
        renderTasks();
    };

    renderTasks();
});