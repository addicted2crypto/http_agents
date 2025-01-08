const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let conversationHistory = [];

sendButton.addEventListener('click', () => {
   
    const userMessage = userInput.value.trim();
    conversationHistory.push({ user: userMessage });
            updateChatLog();
    if (userMessage !== '') {
        // Send API request to localhost:2222/api/chat
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'http://localhost:2222/api/chat', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const data = JSON.stringify({
            model: "llama3.3:70b-instruct-q4_0",
            messages: [
                { role: "user", content: userMessage }
            ],
            max_tokens: 2048, 
            temperature: 0.7, 
            top_p: 1
        });

        xhr.onload = function() {
            
            console.log('Request complete:', xhr.status, xhr.statusText);
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('Response data:', response);
                    const agentResponse = response.choices[0].message.content;
                    conversationHistory.push({ user: userMessage, agent: agentResponse });
                    updateChatLog();
                } catch (error) {
                    console.error('Error parsing response:', error);
                }
            } else {
                console.error('Request failed:', xhr.statusText);
            }
        };

        xhr.onerror = function() {
            console.error('Error sending request:', xhr.statusText);
        };

        xhr.send(data);

        userInput.value = '';
    }
});

function updateChatLog() {
    chatLog.innerHTML = '';
    conversationHistory.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (message.user !== '') {
            messageElement.innerHTML = `<b>User:</b> ${message.user}`;
        } else {
            messageElement.innerHTML = `<b>Agent:</b> ${message.agent}`;
        }
        chatLog.appendChild(messageElement);
    });
}
