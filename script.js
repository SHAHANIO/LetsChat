document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const chatContainer = document.getElementById('chat-container');
    const usernameInput = document.getElementById('username-input');
    const profileImageInput = document.getElementById('profile-image-input');
    const loginButton = document.getElementById('login-button');
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const imageInput = document.getElementById('image-input');
    const sendButton = document.getElementById('send-button');

    let username = '';
    let profileImage = '';

    // Load chat history from localStorage
    loadChatHistory();

    loginButton.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (profileImageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage = e.target.result;
                completeLogin();
            };
            reader.readAsDataURL(profileImageInput.files[0]);
        } else {
            completeLogin();
        }
    });

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function completeLogin() {
        if (username !== '') {
            loginContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
        }
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        const image = imageInput.files[0];

        if (message === '' && !image) return;

        const messageData = {
            username,
            profileImage,
            message,
            image: '',
        };

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'sent');

        if (profileImage !== '') {
            const imgElement = document.createElement('img');
            imgElement.src = profileImage;
            imgElement.classList.add('profile-pic');
            messageElement.appendChild(imgElement);
        }

        const textElement = document.createElement('div');
        textElement.innerHTML = `<strong>${username}:</strong> ${message}`;
        messageElement.appendChild(textElement);

        if (image) {
            const reader = new FileReader();
            reader.onload = function (e) {
                messageData.image = e.target.result;
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                messageElement.appendChild(imgElement);
                appendMessage(messageElement, messageData);
            };
            reader.readAsDataURL(image);
        } else {
            appendMessage(messageElement, messageData);
        }
    }

    function appendMessage(messageElement, messageData) {
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        saveMessage(messageData);
        messageInput.value = '';
        imageInput.value = '';
    }

    function saveMessage(messageData) {
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.push(messageData);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    function loadChatHistory() {
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.forEach((msg) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', 'sent');

            if (msg.profileImage !== '') {
                const imgElement = document.createElement('img');
                imgElement.src = msg.profileImage;
                imgElement.classList.add('profile-pic');
                messageElement.appendChild(imgElement);
            }

            const textElement = document.createElement('div');
            textElement.innerHTML = `<strong>${msg.username}:</strong> ${msg.message}`;
            messageElement.appendChild(textElement);

            if (msg.image !== '') {
                const imgElement = document.createElement('img');
                imgElement.src = msg.image;
                messageElement.appendChild(imgElement);
            }

            chatBox.appendChild(messageElement);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
