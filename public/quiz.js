// quiz.js
document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.querySelector('.submit-form form');
    const submitResult = document.getElementById('submitResult');

    submitForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            question: document.getElementById('question').value,
            option1: document.getElementById('option1').value,
            option2: document.getElementById('option2').value,
            correctAnswer: parseInt(document.getElementById('correctAnswer').value)
        };

        try {
            const response = await fetch('/api/submit-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (response.ok) {
                submitResult.textContent = 'Question added successfully!';
                submitResult.style.color = 'green';
                submitForm.reset();
            } else {
                submitResult.textContent = `Error: ${result.error}`;
                submitResult.style.color = 'red';
            }
        } catch (error) {
            submitResult.textContent = 'Failed to submit question. Please try again.';
            submitResult.style.color = 'red';
            console.error('Error:', error);
        }
    });
});
