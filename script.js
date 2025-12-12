document.addEventListener('DOMContentLoaded', function() {
    const missYouBtn = document.getElementById('missYouBtn');
    const statusMessage = document.getElementById('statusMessage');

    missYouBtn.addEventListener('click', function() {
        // 1. Disable button and show loading state
        missYouBtn.disabled = true;
        missYouBtn.textContent = 'Sending Signal... 🛰️';
        statusMessage.classList.add('hidden');

        // 2. Simulate network delay (3 seconds)
        setTimeout(() => {
            
            // 3. Play a subtle sound effect (Optional, you'd need an audio file)
            // const signalSound = new Audio('path/to/signal.mp3');
            // signalSound.play();

            // 4. Update the status message
            const now = new Date();
            const timeString = now.toLocaleTimeString();

            statusMessage.innerHTML = `Signal Sent! 💖 Your cosmic message was sent at **${timeString}**.<br> They have been notified (on this screen!).`;
            statusMessage.classList.remove('hidden');

            // 5. Reset the button
            missYouBtn.disabled = false;
            missYouBtn.textContent = '💫 Send a Star Signal (I Miss You)';

            // OPTIONAL: Add a quick, temporary animation class to the whole body or container
            document.body.classList.add('signal-pulse');
            setTimeout(() => {
                document.body.classList.remove('signal-pulse');
            }, 1000);

        }, 3000); // 3-second simulation
    });
});
