document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login');
    const resetButton = document.getElementById('reset');

    resetButton.addEventListener('click', function() {
        userInput.value = '';
        passwordInput.value = '';
    });

    loginButton.addEventListener('click', function() {
        const userValue = userInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (userValue === '') {
            alert('Invalid user');
            return;
        }

        if (passwordValue === '') {
            alert('Invalid password');
            return;
        }

        alert('Login successfully');
    });
});