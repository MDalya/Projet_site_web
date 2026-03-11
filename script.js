document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('dalyaTasks')) || [];
    const taskGrid = document.getElementById('taskGrid');

    function render() {
        taskGrid.innerHTML = "";
        let completed = 0;
        tasks.forEach(t => {
            if(t.status === 'termine') completed++;
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${t.text}</h3><button onclick="update(${t.id})">Terminer</button>`;
            taskGrid.appendChild(card);
        });
        document.getElementById('progressBar').style.width = (tasks.length ? (completed / tasks.length)*100 : 0) + "%";
        localStorage.setItem('dalyaTasks', JSON.stringify(tasks));
    }

    document.getElementById('addBtn').onclick = () => {
        const text = document.getElementById('taskInput').value;
        if(text) {
            tasks.push({id: Date.now(), text, status: 'encours'});
            render();
        }
    };

    window.update = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, status: 'termine'} : t);
        render();
    };
    render();
});