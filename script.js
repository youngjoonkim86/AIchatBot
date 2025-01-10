const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const img = document.createElement('img');
    img.src = sender === 'user'
        ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
        : 'https://cdn-icons-png.flaticon.com/512/194/194938.png';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('bubble');

    if (sender === 'ai') {
        typeText(content, bubbleDiv);
    } else {
        bubbleDiv.textContent = content;
    }

    messageDiv.appendChild(sender === 'user' ? bubbleDiv : img);
    messageDiv.appendChild(sender === 'user' ? img : bubbleDiv);

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function typeText(text, element) {
    let index = 0;
    const interval = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index >= text.length) clearInterval(interval);
    }, 50);
}

function typeToInputAndSend(text) {
    userInput.value = '';
    let index = 0;
    const interval = setInterval(() => {
        userInput.value += text[index];
        index++;
        if (index >= text.length) {
            clearInterval(interval);
            sendMessage(); // 자동으로 전송
        }
    }, 50);
}

function handleQuestionClick(question) {
    typeToInputAndSend(question);
}

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'ai');
    }, 500);
}

function getAIResponse(message) {
    const responses = {
        'AI 정비 챗봇이란 무엇인가요?': 'AI 정비 챗봇은 정비 매뉴얼을 디지털화하고 필요한 정보를 빠르게 제공합니다.',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?': '기존 시스템은 수작업 기반이고, AI는 이를 자동화합니다.',
        'AI 정비 챗봇은 어떤 기술로 작동하나요?': '자연어 처리와 머신러닝 기술을 활용합니다.',
        'AI 정비 챗봇을 도입하면 어떤 효과가 있나요?': '시간 단축, 효율성 향상, 고객 만족도 증가를 제공합니다.',
        '초보 정비사도 AI 정비 챗봇을 사용할 수 있나요?': '네, 간단한 UI로 초보자도 쉽게 사용할 수 있습니다.'
    };
    return responses[message] || "질문에 대한 답변을 준비 중입니다.";
}
const snowContainer = document.getElementById('snow-container');
const messages = document.getElementById('messages');
let snowHeight = 0; // 눈이 쌓이는 높이

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄'; // 눈송이 모양
    snowflake.style.left = `${Math.random() * 100}%`; // 랜덤 가로 위치
    snowflake.style.fontSize = `${Math.random() * 10 + 10}px`; // 랜덤 크기
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // 랜덤 속도
    snowflake.style.opacity = Math.random();

    // 눈송이 추가
    snowContainer.appendChild(snowflake);

    // 애니메이션 종료 후 제거
    setTimeout(() => {
        snowflake.remove();
        accumulateSnow(); // 눈송이가 제거될 때 눈 쌓이기
    }, 5000);
}

// 눈송이 생성 주기
setInterval(createSnowflake, 300); // 0.3초마다 눈송이 생성
