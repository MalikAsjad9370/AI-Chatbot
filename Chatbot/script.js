const API_KEY = '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'; // Paste your API key, see at miute (10:08)

const content = document.getElementById('content');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

let isAnswerLoading = false;
let answerSectionId = 0;

sendButton.addEventListener('click', () => handleSendMessage());
chatInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
})

function handleSendMessage() {
    // Get the user input and remove leading/tariling space
    const question = chatInput.value.trim();

    // Prevent sending empty message
    if (question === '' || isAnswerLoading) return;

    // Disable UI send button
    sendButton.classList.add('send-button-nonactive');

    addQuestionSection(question);
    chatInput.value = '';
}

function getAnswer(question) {
    const fetchData =
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1-distill-llama-70b:free",
                "messages": [
                    {
                        "role": "user",
                        "content": question
                    }
                ]
            })
        });

    fetchData.then(response => response.json())
        .then(data => {
            // Get response message
            const resultData = data.choices[0].message.content;
            // Mark as no longer loading
            isAnswerLoading = false;
            addAnswerSection(resultData);
        }).finally(() => {
            scrollToBottom();
            sendButton.classList.remove('send-button-nonactive');
        })
}

function addQuestionSection(message) {
    isAnswerLoading = true;
    // Create section element
    const sectionElement = document.createElement('section');
    sectionElement.className = 'question-section';
    sectionElement.textContent = message;

    content.appendChild(sectionElement);
    // Add answer section after added quesion section
    addAnswerSection(message)
    scrollToBottom();
}

function addAnswerSection(message) {
    if (isAnswerLoading) {
        // Increment answer section ID for tracking
        answerSectionId++;
        // Create and empty answer section with a loading animation
        const sectionElement = document.createElement('section');
        sectionElement.className = 'answer-section';
        sectionElement.innerHTML = getLoadingSvg();
        sectionElement.id = answerSectionId;

        content.appendChild(sectionElement);
        getAnswer(message);
    } else {
        // Fill in the answer once it's received
        const answerSectionElement = document.getElementById(answerSectionId);
        answerSectionElement.textContent = message;
    }
}

function getLoadingSvg() {
    return '<svg style="height: 25px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>';
}

function scrollToBottom() {
    content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth'
    });
}