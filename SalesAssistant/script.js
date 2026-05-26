document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.close-btn');
    const chatPanel = document.querySelector('.chat-panel');
    const sendBtn = document.querySelector('.chat-input button');
    const inputField = document.querySelector('.chat-input input');
    const messagesContainer = document.querySelector('.chat-messages');

    // Function to close the chat panel
    closeBtn.addEventListener('click', () => {
        chatPanel.style.display = 'none';
        // In a full design, we might add a button to open it again!
    });

    // Function to send a message
    function sendMessage() {
        const text = inputField.value.trim();
        if (text === '') return;

        // Create a new div for the user's message
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user');
        messageDiv.textContent = text; // Safe way to add text

        // Add the message to the chat container
        messagesContainer.appendChild(messageDiv);
        
        // Clear the input field
        inputField.value = '';

        // Auto-scroll to the bottom of the chat
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate a response from the assistant after a short delay
        setTimeout(() => {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('message', 'assistant');
            responseDiv.textContent = "I'm a prototype assistant. I heard you say: '" + text + "'.";
            messagesContainer.appendChild(responseDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key press
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
