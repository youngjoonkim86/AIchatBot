const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const questionListDiv = document.getElementById('questionList');
const questionCategorySelect = document.getElementById('questionCategory');

// 질문 데이터
const questionData = {
    operational1: [
        '챗봇이란 단어는 많이들어봤지만, 정확히 어떤 서비스인지 잘 모르겠어요',
        '그렇다면 AI 정비 챗봇이란 무엇인가요?',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?',
        'AI 정비 챗봇은 어떤 기술로 작용하나요?'
    ],
    operational2: [
        'AI 정비 챗봇은 어떤 기술로 작동하나요?',
        'AI 정비 챗봇은 다국어 지원이 가능한가요?',
        'AI 정비 챗봇은 데이터를 어떻게 업데이트하나요?',
        'AI 정비 챗봇의 주요 기능은 무엇인가요?'
    ],
    operational3: [
        'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?',
        'AI 정비 챗봇의 도입 비용은 어떻게 되나요?',
        '중소기업도 AI 정비 챗봇을 사용할 수 있나요?',
        'AI 정비 챗봇은 고객 서비스에도 도움을 줄 수 있나요?'
    ],
    operational4: [
        'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?',
        'AI 정비 챗봇의 도입 비용은 어떻게 되나요?',
        '중소기업도 AI 정비 챗봇을 사용할 수 있나요?',
        'AI 정비 챗봇은 고객 서비스에도 도움을 줄 수 있나요?'
    ]
};

// 질문 목록 업데이트
function updateQuestions() {
    const selectedCategory = questionCategorySelect.value;
    const questions = questionData[selectedCategory] || [];
    questionListDiv.innerHTML = '';

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `Q${index + 1}. ${question}`;
        questionDiv.onclick = () => handleQuestionClick(question);
        questionListDiv.appendChild(questionDiv);
    });
}

// 메시지 추가
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

// AI 응답 타이핑 효과
function typeText(text, element) {
    let index = 0;
    const interval = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index >= text.length) clearInterval(interval);
    }, 50);
}

// 입력된 질문 자동 전송
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

// 질문 클릭 이벤트
function handleQuestionClick(question) {
    typeToInputAndSend(question);
}

// 메시지 전송
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

// AI 응답
function getAIResponse(message) {
    const responses = {
        '챗봇이란 단어는 많이들어봤지만, 정확히 어떤 서비스인지 잘 모르겠어요': '챗봇은 문자나 음성을 통해 사용자와 상호작용하는 AI기반 도구입니다. 자연어처리(NLP)를 사용하여 쿼리를 이해하고 응답하므로 의사소통이 더욱 효율적으로 이루어집니다. 당사의 챗봇은 언제 어디서나 문제 해결, 정보제공, 유지 관리 작업을 도와드립니다.',
        '그렇다면 AI 정비 챗봇이란 무엇인가요?' : 'AI정비 챗봇은 정비매뉴얼을 디지털화하고 필요한 정보를 빠르게 제공하는 도구입니다.\nAJ의 AI 유지보수 챗봇은 유지보수 문제를 관리하고 해결하는데 도움을 주기위해 설계된 전문가상 도우미입니다. 일반적인 문제를 안내하고 솔루션을 제안하고, 수리 또는 유지관리 서비스 예약까지 모두 사람의 개입없이 수행할 수 있습니다.',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?':'기존시스템은 사람이 매뉴얼을 검색하고 데이터를 관리하지만, AI는 이를 자동화하여 작업 시간을 줄입니다.',
        'AI 정비 챗봇은 어떤 기술로 작용하나요?':'자연어처리와 머신러닝을 통해 사용자의 질문을 이해하고 답변을 제공합니다.',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?': '기존 시스템은 사람이 매뉴얼을 검색하고 데이터를 관리하지만, AI는 이를 자동화하여 작업 시간을 줄입니다.',
        'AI 정비 챗봇은 어떤 기술로 작동하나요?': '자연어 처리(NLP)와 기계 학습(ML)을 통해 사용자의 질문을 이해하고 답변을 제공합니다.',
        'AI 정비 챗봇을 도입하면 어떤 효과가 있나요?': '작업 시간 단축, 데이터 기반 문제 해결, 고객 만족도 상승 등의 효과를 기대할 수 있습니다.',
        'AI 정비 챗봇의 미래 발전 가능성은 무엇인가요?': '지속적인 학습을 통해 정비의 정확성과 효율성을 더욱 높일 가능성이 있습니다.',
        'AI 정비 챗봇은 다국어 지원이 가능한가요?': '현재는 한국어로만 설정되어 있지만, 향후 다국어 지원을 계획하고 있습니다.',
        'AI 정비 챗봇의 주요 기능은 무엇인가요?': '매뉴얼 검색, 작업 단계 안내, 예측 유지보수, 고객 응대 등이 주요 기능입니다.',
        'AI 정비 챗봇의 도입 비용은 어떻게 되나요?': '초기 도입 비용이 있지만, 장기적으로 비용 절감 효과가 큽니다.',
        'AI 정비 챗봇은 고객 서비스에도 도움을 줄 수 있나요?': '네, 고객 질문 응대 시간을 줄이고 효율적인 서비스를 제공합니다.',
    };
    return responses[message] || "질문에 대한 답변을 준비 중입니다.";
}

// 초기화
updateQuestions();
// 저장된 데이터를 담는 배열
const eventData = [];

// 이벤트 이름 제출 함수
function submitEventName() {
    const eventName = document.getElementById('eventName').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const eventMessageDiv = document.getElementById('eventMessage');

    // 입력값 검증
    if (!eventName) {
        eventMessageDiv.textContent = "이벤트 이름을 입력해 주세요.";
        eventMessageDiv.style.color = "#FF0000"; // 에러 메시지 색상
        return;
    }

    if (!agreeTerms) {
        eventMessageDiv.textContent = "개인정보 수집에 동의해야 제출할 수 있습니다.";
        eventMessageDiv.style.color = "#FF0000"; // 에러 메시지 색상
        return;
    }

    // 데이터 저장
    const timestamp = new Date().toLocaleString(); // 제출 시간 추가
    eventData.push({ eventName, timestamp });

    eventMessageDiv.textContent = `감사합니다! "${eventName}"가 저장되었습니다.`;
    eventMessageDiv.style.color = "#4CAF50"; // 성공 메시지 색상

    // 입력값 초기화
    document.getElementById('eventName').value = '';
    document.getElementById('agreeTerms').checked = false;
}

// CSV 파일 다운로드 함수
function downloadCSV() {
    if (eventData.length === 0) {
        alert("저장된 데이터가 없습니다.");
        return;
    }

    // CSV 데이터 생성
    const csvHeaders = ['이벤트 이름', '제출 시간'];
    const csvRows = eventData.map(row => `${row.eventName},${row.timestamp}`);
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Blob 객체 생성
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // 다운로드 링크 생성
    const link = document.createElement('a');
    link.href = url;
    link.download = 'newsletter_event_data.csv';
    document.body.appendChild(link);
    link.click();

    // 링크 제거
    document.body.removeChild(link);
}
