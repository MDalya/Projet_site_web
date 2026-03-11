// ... (Initialisation Firebase en haut) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (Logique Login existante) ...

    // AJOUT DE TACHE (Vérifie bien les IDs 'addBtn' et 'taskInput')
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', async () => {
            const input = document.getElementById('taskInput');
            const category = document.getElementById('taskCategory').value;
            const userMail = localStorage.getItem('userMail');

            if (input.value.trim() !== "") {
                try {
                    await addDoc(collection(db, "tasks"), {
                        text: input.value,
                        category: category,
                        user: userMail,
                        status: 'indetermine'
                    });
                    input.value = ""; // Vide le champ après ajout
                    console.log("Tâche ajoutée !");
                } catch (e) {
                    console.error("Erreur d'ajout : ", e);
                }
            } else {
                alert("Ecris quelque chose d'abord !");
            }
        });
    }

    // ... (Le reste : logout, loadTasks, etc.) ...
});