document.addEventListener('DOMContentLoaded', () => {
    const salesAssistantPanel = document.querySelector('.sales-assistant-panel');
    const sendBtn = document.querySelector('.send-btn');
    const inputField = document.querySelector('.input-box [contenteditable="true"]');

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

    // Send message when clicking a prompt option
    const promptOptions = document.querySelectorAll('.prompt-option');
    promptOptions.forEach(option => {
        option.addEventListener('click', () => {
            const text = option.textContent.trim();
            handleSend(text);
        });
    });



    let apiKey = localStorage.getItem('gemini_api_key') || ''; // Read from browser storage

    // Function to handle sending a message
    function handleSend(textParam) {
        let text = '';
        if (textParam) {
            text = textParam.trim();
        } else if (inputField) {
            text = inputField.value !== undefined ? inputField.value.trim() : (inputField.innerText || inputField.textContent || "").trim();
        }
        
        if (text === '') return;
        
        // TODO(security): Do not use prompt() in production. Use a proper UI input.
        if (!apiKey) {
            apiKey = prompt("Please enter your Gemini API Key (it will be saved in your browser):");
            if (!apiKey) return;
            localStorage.setItem('gemini_api_key', apiKey); // Save to browser storage
        }
        
        const panelContent = document.querySelector('.sales-assistant-panel .panel-content');
        
        // HTML for the user message
        const userMsgHtml = `
            <div class="message user-message">
                <div class="message-body"></div>
            </div>
        `;
        
        // Check if there are already messages
        const existingMessages = panelContent.querySelectorAll('.message');
        
        if (existingMessages.length === 0) {
            // First message: replace all content
            panelContent.innerHTML = userMsgHtml;
        } else {
            // Subsequent messages: append
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = userMsgHtml;
            panelContent.appendChild(tempDiv.firstElementChild);
        }
        
        // Safely insert user text to prevent hacking (XSS)
        const latestUserMsgBody = panelContent.querySelector('.user-message:last-child .message-body');
        if (latestUserMsgBody) latestUserMsgBody.textContent = text;
        
        // Clear input field if we used it
        if (!textParam && inputField) {
            if (inputField.value !== undefined) {
                inputField.value = '';
            } else {
                inputField.innerText = '';
            }
        }
        
        panelContent.scrollTop = panelContent.scrollHeight;
        
        // Show thinking state
        const modelMsg = document.createElement('div');
        modelMsg.className = 'message model-message';
        modelMsg.innerHTML = `
            <div class="message-header" style="display: flex; align-items: center; gap: 10px;">
                <div class="model-icons">
                    <img src="../assets/icn-connectai.svg" alt="Gem">
                </div>
                <span class="thinking-label" style="font-size: 14px; font-weight: 500; color: #202124;">Thinking...</span>
            </div>
            <div class="message-body"></div>
        `;
        panelContent.appendChild(modelMsg);
        
        // Call real Gemini API
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        })
        .then(response => response.json())
        .then(data => {
            const responseText = data.candidates[0].content.parts[0].text;
            
            // Hide thinking label
            const thinkingLabel = modelMsg.querySelector('.thinking-label');
            if (thinkingLabel) thinkingLabel.style.display = 'none';
            
            // Safely insert model response
            const messageBody = modelMsg.querySelector('.message-body');
            if (messageBody) {
                // Escape HTML first to prevent security issues
                const tempDiv = document.createElement('div');
                tempDiv.textContent = responseText;
                let formattedText = tempDiv.innerHTML;
                
                // Convert ### Header to <h3>Header</h3>
                formattedText = formattedText.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
                // Convert ## Header to <h2>Header</h2>
                formattedText = formattedText.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
                // Convert # Header to <h1>Header</h1>
                formattedText = formattedText.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

                // Convert **bold** markdown to <b>bold</b> HTML
                formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                
                // Convert newlines to line breaks
                formattedText = formattedText.replace(/\n/g, '<br>');
                
                messageBody.innerHTML = formattedText;
            }
            
            panelContent.scrollTop = panelContent.scrollHeight;
        })
        .catch(error => {
            console.error('Error calling Gemini API:', error);
            const thinkingLabel = modelMsg.querySelector('.thinking-label');
            if (thinkingLabel) thinkingLabel.textContent = "Error: Could not reach Gemini.";
        });
    }

    // Send message on button click
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
            handleSend();
        } catch (error) {
            alert('Error calling handleSend: ' + error.message);
        }
    });

    // Send message on Enter key press
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // Toggle plus menu
    const plusBtn = document.querySelector('.plus-icon');
    const plusMenu = document.getElementById('plusMenu');

    if (plusBtn && plusMenu) {
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            plusMenu.classList.toggle('show');
        });

        // Close menu when an item is selected
        const menuItems = plusMenu.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling up to the plus button
                plusMenu.classList.remove('show');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!plusMenu.contains(e.target) && e.target !== plusBtn) {
                plusMenu.classList.remove('show');
            }
        });

        // File upload functionality
        const fileUploadItem = document.getElementById('fileUploadItem');
        const filePicker = document.getElementById('filePicker');
        const chipsContainer = document.getElementById('chipsContainer');

        if (fileUploadItem && filePicker && chipsContainer) {
            fileUploadItem.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling up to the plus button
                filePicker.click();
                plusMenu.classList.remove('show');
            });

            filePicker.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    addFileChip(file, chipsContainer);
                }
            });

            function addFileChip(file, container) {
                const chip = document.createElement('div');
                chip.className = 'file-chip';
                
                let typeClass = 'other';
                let iconContent = '<i class="google-symbols">insert_drive_file</i>';
                
                if (file.type.startsWith('image/')) {
                    typeClass = 'image';
                    iconContent = '<i class="google-symbols">image</i>';
                } else if (file.type === 'application/pdf') {
                    typeClass = 'pdf';
                    iconContent = '<span style="font-size: 8px; font-weight: bold;">PDF</span>';
                }
                
                chip.classList.add(typeClass);
                
                chip.innerHTML = `
                    <div class="chip-icon">${iconContent}</div>
                    <span class="chip-text">${file.name}</span>
                    <i class="google-symbols chip-close">close</i>
                `;
                
                chip.querySelector('.chip-close').addEventListener('click', () => {
                    chip.style.visibility = 'hidden'; // Make it disappear instantly
                    chip.classList.add('removing'); // Trigger the height collapse
                    chip.addEventListener('transitionend', () => {
                        chip.remove();
                    });
                    filePicker.value = ''; // Reset picker so same file can be chosen again
                });
                
                container.appendChild(chip);
            }
        }

        // Screenshot functionality (Simulation)
        const screenshotItem = document.getElementById('screenshotItem');
        if (screenshotItem && chipsContainer) {
            screenshotItem.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Trigger flash effect
                const dashboard = document.querySelector('.dashboard-area');
                if (dashboard) {
                    const flash = document.createElement('div');
                    flash.className = 'screenshot-flash active';
                    dashboard.appendChild(flash);
                    
                    // Remove after animation
                    flash.addEventListener('animationend', () => {
                        flash.remove();
                    });
                }
                
                const now = new Date();
                const dateStr = now.toISOString().slice(0, 10);
                const timeStr = now.toTimeString().slice(0, 5);
                
                const mockFile = {
                    name: `Screenshot ${dateStr} at ${timeStr}.png`,
                    type: 'image/png'
                };
                
                addFileChip(mockFile, chipsContainer);
                plusMenu.classList.remove('show');
            });
        }
    }
});
