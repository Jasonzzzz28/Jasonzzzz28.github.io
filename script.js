// Profile picture changer
const profilePic = document.getElementById('profile-pic');
const changePicBtn = document.getElementById('change-pic-btn');
const pics = [
    'images/miko.jpeg',
    'images/city.JPG',
    'images/mountain.jpeg',
    'images/family.JPG'
];
let currentPicIndex = 0;

changePicBtn.addEventListener('click', () => {
    currentPicIndex = (currentPicIndex + 1) % pics.length;
    profilePic.src = pics[currentPicIndex];
    
    // Add animation class
    profilePic.classList.add('animate-pulse');
    setTimeout(() => {
        profilePic.classList.remove('animate-pulse');
    }, 500);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg');
        nav.classList.remove('shadow-md');
    } else {
        nav.classList.remove('shadow-lg');
        nav.classList.add('shadow-md');
    }
});

// Chatbox functionality
const chatBtn = document.getElementById('chat-btn');
const chatbox = document.getElementById('chatbox');
const closeChatbox = document.getElementById('close-chatbox');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');

// Toggle chatbox
chatBtn.addEventListener('click', () => {
    chatbox.classList.toggle('open');
    if (chatbox.classList.contains('open')) {
        chatInput.focus();
        // Scroll to bottom of chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

closeChatbox.addEventListener('click', () => {
    chatbox.classList.remove('open');
});

// Send message
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Generate response
        const response = await generateResponse(message);
        // Remove typing indicator
        removeTypingIndicator();
        addMessage(response, 'ai');
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
    
    // Scroll to bottom of chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom of chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <span>AI is typing</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom of chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Generate response based on user input
async function generateResponse(question) {
    // Create resume summary for the prompt
    const resumeSummary = `
    Siyuan (Jason) Zhang is a Software Engineer and Machine Learning Enthusiast with experience at PayPal.

    Professional Experience:
    - Software Engineer at PayPal (Credit Acquisition BNPL Team) from Jul 2021 - Mar 2024
      * Developed async processing systems with ActiveMQ, JMS, and Spring Batch
      * Implemented idempotency for API endpoints, reducing unprocessed applications by 70%
      * Designed authorization for domain-private APIs using JWT
      * Built microservices with Spring Boot and CloudEvents SDK
    
    - Software Engineer Intern at PayPal (Credit Acquisition Revolving Credit Team) from Jun 2020 - Aug 2020
      * Developed microservice features for fraud case handling
      * Automated system failure remediation saving 4+ hours per case
      * Used Jenkins CI/CD for Maven projects

    Education:
    - M.S. in Computer Engineering at New York University (2024 - Present, GPA: 4.0)
    - B.S. in Computer Science, Minor in Statistics at University of Maryland (2017 - 2021, GPA: 3.7)

    Skills:
    - Programming: Java, Python, SQL, Kotlin, C/C++, JavaScript
    - Frameworks: Spring, Flask, Node.js, React, Docker, Kubernetes
    - ML/AI: PyTorch, TensorFlow, Hugging Face, LLMs, RAG, LoRA/QLoRA
    - Cloud: AWS, GCP, BigQuery, Airflow

    Projects:
    - Transformer QA: Domain-specific QA system using LLMs with LoRA/QLoRA
    - Graph-Based Cache-Augmented Generation: Alternative to RAG
    - Racetrack AI: AI for Racetrack game with optimized heuristics
    - Geolocation Database: Java implementation with custom data structures
    `;

    const prompt = `
    Resume Summary:
    ${resumeSummary}

    Question: ${question.toLowerCase()}

    Instructions:
    1. Answer the question based only on the resume summary provided. But do not mention the resume summary is provided for context.
    2. Keep your response concise, confident, and professional
    3. If the question is not related to the resume, reply with "I can only answer questions about Siyuan's professional experience, skills, and projects."
    4. Your response should be promoting siyuan as a professional and skilled software engineer, not just a resume summary
    5. Answer within 50 tokens
    `;

    // const endpoint = 'http://localhost:3000/api/gemini';
    const endpoint = '/api/gemini';

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "question": prompt })
    });

    const data = await res.json();
    console.log(data);
    return data.answer;
}

// Event listeners for chat
sendChat.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        await sendMessage();
    }
}); 