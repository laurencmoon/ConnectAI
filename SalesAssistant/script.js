document.addEventListener('DOMContentLoaded', () => {
    const salesAssistantPanel = document.querySelector('.sales-assistant-panel');
    const sendBtn = document.querySelector('.send-btn');
    const inputField = document.querySelector('.input-box input');

    // Trigger the slide-in animation on load
    setTimeout(() => {
        salesAssistantPanel.classList.add('open');
    }, 100);

    // Close button functionality (slides panel out)
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        salesAssistantPanel.classList.remove('open');
    });

    // Open panel from left nav sparkle button
    const sparkleBtn = document.querySelector('.sparkle-container');
    sparkleBtn.addEventListener('click', () => {
        salesAssistantPanel.classList.add('open');
    });

    // Moma icon toggle effect
    const momaIcon = document.querySelector('.moma-icon');
    momaIcon.addEventListener('click', () => {
        momaIcon.classList.toggle('desaturated');
    });

    // Expand panel width functionality
    const expandBtn = document.querySelector('.expand-btn');
    expandBtn.addEventListener('click', () => {
        salesAssistantPanel.classList.toggle('expanded');
        document.body.classList.toggle('panel-expanded');
    });

    // Toggle chat history panel
    const menuBtn = document.querySelector('.menu-btn');
    const chatHistoryPanel = document.querySelector('.chat-history-panel');
    menuBtn.addEventListener('click', () => {
        chatHistoryPanel.classList.toggle('open');
    });

    // Accordion functionality for the panel
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isExpanded = item.classList.contains('expanded');
            
            // Toggle the clicked item
            if (!isExpanded) {
                item.classList.add('expanded');
                const arrow = header.querySelector('.arrow i');
                if (arrow) arrow.textContent = 'keyboard_arrow_up';
            } else {
                item.classList.remove('expanded');
                const arrow = header.querySelector('.arrow i');
                if (arrow) arrow.textContent = 'keyboard_arrow_down';
            }
        });
    });



    // Function to handle sending a message (mock behavior)
    function handleSend() {
        const text = inputField.value.trim();
        if (text === '') return;
        
        // Clear the input field
        inputField.value = '';
        console.log("User asked: ", text);
    }

    // Send message on button click
    sendBtn.addEventListener('click', handleSend);

    // Send message on Enter key press
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
