
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');


//this is ok to post as its temp token handshake already changed!
let cf_access_token = "eyJraWQiOiIyNzRkNzhhM2Q1OTI3ZDY2NGNkNGY2YWU3ZWZiNDJiOTM0MTFmNGNhZDE0NDY5MDVlN2M4MGI4NzZkYWZkYTIyIiwiYWxnIjoiUlMyNTYiLCJ0eXAiOiJKV1QifQ.eyJ0eXBlIjoiYXBwIiwiYXVkIjoiZTMwZjk0NDdlNWI0NTVhZjk3NjBhMjU4YTJmYjY2NTdkNzk0M2M2MjQwNDU3YTkwYjdmMjFhYTc3NjE4Nzk0YyIsImV4cCI6MTczNzk0NzY3OCwiaXNzIjoiaHR0cHM6XC9cL3JvZ3VldmFsbGV5LmNsb3VkZmxhcmVhY2Nlc3MuY29tIiwiY29tbW9uX25hbWUiOiI1MGRkYWY4ZDNlYzdhZWNkNTRlMGQ0ZTRkMDg0NWNiZS5hY2Nlc3MiLCJpYXQiOjE3Mzc4NjEyNzgsInN1YiI6IiJ9.HnbAwNCkNmdeqmtwTpw2POoGFObzsIpIqEV1HYblTmJg72tWrUyG8WYJGuI2hqnTw5ED9SrOjhl8_deV2hgbIt0mN1LeYTZu5wC0_phYnTJaMulKcU1NnM8a9Ur1tNaFaJu47RagCSYTPmqmGoScUxx4_kvDJHFfjazO078iZvwGd97C96ccc9xueU_XkJJIvhK9nqOogaXHpN5AUyHgCUnLTuGwX0Itf2-KE7CYXcAGZu1MySbxJtVcZzk8EuaHVzUWOlqvVFrD0eUVT3HiSxCEf79x3AKSh_Aq2gILhd_-Dvj9FozxmwWw7q0SiLBmVrFcZmI3wQUTXmGyTtmd-Q; Expires=Mon, 27 Jan 2025 03:14:38 GMT; Path=/; Secure; "




let conversationHistory = [];
let CF_Access_Client_Id = "50ddaf8d3ec7aecd54e0d4e4d0845cbe.access";
let CF_Access_Client_Secret = "85071d3cba558cf6b79942da4e9c725a7d4b0a096cfccdbbf9b46b23cb6a5f0c"
sendButton.addEventListener('click', () => {
   
    const userMessage = userInput.value.trim();
    conversationHistory.push({ user: userMessage });
            updateChatLog();
    if (userMessage !== '') {
        
        // const xhr = new XMLHttpRequest();
        // xhr.open('POST', 'https://ai.ainetguard.com/api/chat', true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // // xhr.setRequestHeader('Authorization', `Bearer ${_cfAccessClientSecret}`);
        // xhr.setRequestHeader('Authorization', `Bearer ${_accessToken}`);
        

        const data = JSON.stringify({
            // model:"llama3.3:70b-instruct-q4_0",
            model: "llama2",
            
            messages: [
                { role: "user", content: userMessage }
            ],
            "stream": true,
            prompt: userMessage,
            max_tokens: 2048, 
            temperature: 0.7, 
            top_p: 1
        });

        console.log('Sending request now via stringify:', data)
        
        fetch('http://localhost:11434/api/chat',{
        // fetch('https://ai.ainetguard.com/api/chat', {
            method: 'POST',
            
            headers: {
                
                "Content-Type":"application/json", 
                // "cf-access-token": `${cf_access_token}`,
            },
            body: data,
        }).then(response => { 
            if(!response.ok){
                throw new Error(`HTTP error! status ${response.status}`);
            }
            return response.json();
        }).then(data => {
            console.log('Response data: ', data);
            const agentResponse = data.choices[0].message.content;

            conversationHistory.push({user: '', agent: agentResponse});
            updateChatLog();
        }).catch(error => {
            console.error('Error sending request or parsing response:', error);
        });

        userInput.vaule = '';

       
    }
});

function updateChatLog() {
    chatLog.innerHTML = '';

    conversationHistory.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        messageElement.classList.add('message');

        if (message.user !== '') {
            messageElement.innerHTML = `<b>User:</b> ${message.user}`;
        } else {
            messageElement.innerHTML = `<b>Agent:</b> ${message.agent}`;
        }
        chatLog.appendChild(messageElement);
    });
}
