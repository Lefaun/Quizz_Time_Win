document.getElementById('addQuestion').addEventListener('click', function() {
    const container = document.createElement('div');
    container.className = 'submit-form';
    container.innerHTML = `
        <div class="form-group">
            <label>Questão:</label>
            <input type="text" class="question" required>
        </div>
        <div class="form-group">
            <label>Opção 1:</label>
            <input type="text" class="option1" required>
        </div>
        <div class="form-group">
            <label>Opção 2:</label>
            <input type="text" class="option2" required>
        </div>
        <div class="form-group">
            <label>Resposta Correta:</label>
            <select class="correctAnswer" required>
                <option value="0">Opção 1</option>
                <option value="1">Opção 2</option>
            </select>
        </div>
    `;
    document.getElementById('questionsContainer').appendChild(container);
});

document.getElementById('quizForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const statusMessage = document.getElementById('submitResult');
    statusMessage.textContent = 'Enviando questões...';
    statusMessage.className = '';

    const questions = [];
    const forms = document.getElementsByClassName('submit-form');
    
    for (let form of forms) {
        questions.push({
            question: form.querySelector('.question').value,
            option1: form.querySelector('.option1').value,
            option2: form.querySelector('.option2').value,
            correctAnswer: parseInt(form.querySelector('.correctAnswer').value)
        });
    }

    try {
        const response = await fetch('/api/submit-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questions })
        });

        const result = await response.json();
        
        if (response.ok) {
            statusMessage.textContent = `${questions.length} questões adicionadas com sucesso!`;
            statusMessage.className = 'success';
            this.reset();
            // Remove additional question forms
            const container = document.getElementById('questionsContainer');
            while (container.children.length > 1) {
                container.removeChild(container.lastChild);
            }
        } else {
            statusMessage.textContent = `Erro: ${result.error}`;
            statusMessage.className = 'error';
        }
    } catch (error) {
        statusMessage.textContent = 'Falha ao enviar questões. Por favor, tente novamente.';
        statusMessage.className = 'error';
        console.error('Erro:', error);
    }
});
