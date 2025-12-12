// 1. PASTE YOUR FIREBASE CONFIGURATION HERE
// (Go to your Firebase project settings to get these values)
const firebaseConfig = {
    apiKey: "AIzaSyCzvU8LaUW70czawkpHZYTa7pTmCnELjh8", // Example: "AIzaSyC0V8B9_wL4p..."
    authDomain: "miss-c657c.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com", 
    projectId: "miss-c657c",
    storageBucket: "miss-c657c.firebasestorage.app",
    messagingSenderId: "881521432432",
    appId: "1:881521432432:web:0e15a97d3a1d59370461b5"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    // Get a reference to the database service
    const database = firebase.database();
    // Define the database path where we will store the 'miss you' data
    const missYouRef = database.ref('miss_you_signal');

    document.addEventListener('DOMContentLoaded', function() {
        const missYouBtn = document.getElementById('missYouBtn');
        const statusMessage = document.getElementById('statusMessage');

        // --- BUTTON CLICK HANDLER (Sends Signal) ---
        missYouBtn.addEventListener('click', function() {
            // Determine the sender based on context (You can customize this)
            // For example, if you are hg, set sender = 'hg', and the other person's code uses 'hb'
            const sender = 'hg'; 
            
            const now = new Date();
            const timestamp = now.getTime();
            const timeString = now.toLocaleTimeString();

            // Set pending state
            missYouBtn.disabled = true;
            missYouBtn.textContent = 'Sending Signal... 🛰️';
            statusMessage.classList.add('hidden');

            // 1. Write the new signal data to the Firebase Realtime Database
            missYouRef.set({
                sender: sender,
                timestamp: timestamp,
                readableTime: timeString,
                message: `${sender} misses you!`
            })
            .then(() => {
                // Success! Update the local status message
                statusMessage.innerHTML = `✅ Signal Sent! Your cosmic message was sent at **${timeString}** and saved to the stars!`;
                statusMessage.classList.remove('hidden');
            })
            .catch((error) => {
                // Error! Update the local status message
                statusMessage.innerHTML = `❌ Error sending signal: ${error.message}`;
                statusMessage.classList.remove('hidden');
            })
            .finally(() => {
                 // Reset the button
                missYouBtn.disabled = false;
                missYouBtn.textContent = '💫 Send a Star Signal (I Miss You)';
            });
        });
        
        // --- REAL-TIME LISTENER (Receives Signal) ---
        // This function is triggered instantly whenever the 'miss_you_signal' data changes in the database.
        missYouRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Check if the signal is very recent (e.g., within the last 5 seconds)
                const currentTime = new Date().getTime();
                if (currentTime - data.timestamp < 5000) { 
                    // Prevent showing a notification if the sender is the current user (optional)
                    // if (data.sender !== 'hg') { // Uncomment and set your role correctly if you want this filter
                        
                    // Remove any existing flash alert before creating a new one
                    const existingAlert = document.getElementById('flash-alert');
                    if (existingAlert) existingAlert.remove();
                    
                    // Create a temporary, highly visible flash notification element
                    const flashNotification = document.createElement('div');
                    flashNotification.id = 'flash-alert';
                    flashNotification.innerHTML = `<h1>📣 COSMIC ALERT! ${data.sender.toUpperCase()} MISSES YOU!</h1>`;
                    document.body.appendChild(flashNotification);

                    // Remove the flash after 3 seconds
                    setTimeout(() => {
                        flashNotification.remove();
                    }, 3000);
                    // }
                }
            }
        });
    });

} else {
    // Fallback if Firebase SDK didn't load
    console.error("Firebase SDK not loaded. Check your index.html script tags.");
}
