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
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?': '기존 시스템은 사람이 매뉴얼을 검색하고 데이터를 관리하지만, AI는 이를 자동화하여 작업 시간을 줄입니다.',
                'AI 정비 챗봇은 어떤 기술로 작동하나요?': '자연어 처리(NLP)와 기계 학습(ML)을 통해 사용자의 질문을 이해하고 답변을 제공합니다.',
                'AI 정비 챗봇을 도입하면 어떤 효과가 있나요?': '작업 시간 단축, 데이터 기반 문제 해결, 고객 만족도 상승 등의 효과를 기대할 수 있습니다.',
                '초보 정비사도 AI 정비 챗봇을 사용할 수 있나요?': '네, 간단한 인터페이스 덕분에 초보자도 쉽게 사용할 수 있습니다.',
                'AI 정비 챗봇은 다국어 지원이 가능한가요?': '아니오, 현재는 한국어로만 설정되어 있습니다.',
                'AI 정비 챗봇은 데이터를 어떻게 업데이트하나요?': '클라우드 기반으로 실시간 업데이트가 이루어져 최신 데이터를 유지합니다.',
                '기존 시스템과 통합이 가능한가요?': '기존 정비 관리 시스템과 쉽게 통합할 수 있습니다.',
                '예측 유지보수란 무엇인가요?': '데이터를 분석해 고장을 사전에 감지하고 필요한 조치를 추천하는 기술입니다.',
                'AI 정비 챗봇은 고객 서비스에도 도움을 줄 수 있나요?': '네, 고객의 일반적인 질문에 대한 답변을 제공하여 응대 시간을 줄일 수 있습니다.',
                'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?': '아니요, AI는 정비사를 보조하는 도구로 설계되었습니다.',
                'AI 정비 챗봇의 도입 비용은 어떻게 되나요?': '초기 도입 비용은 있지만 장기적으로 운영 비용을 줄이는 효과가 있습니다.',
                '중소기업도 AI 정비 챗봇을 사용할 수 있나요?': '네, 규모에 맞게 조정할 수 있어 중소기업에서도 활용 가능합니다.',
                'AI 정비 챗봇은 어떤 문제를 해결할 수 있나요?': '일반적인 정비 절차, 부품 확인, 고장 진단 등 다양한 문제를 해결할 수 있습니다.',
                'AI 정비 챗봇의 미래 발전 가능성은 무엇인가요?': '지속적인 학습을 통해 정비의 정확성과 효율성을 더욱 높일 가능성이 있습니다.',
                'AI 정비 챗봇은 어떻게 사용하나요?': '인터넷이 연결된 기기에서 간단히 사용할 수 있으며, 모델명과 증상만 입력하면 됩니다.',
                'AI 정비 챗봇의 주요 기능은 무엇인가요?': '매뉴얼 자동 검색, 작업 단계 안내, 예측 유지보수, 고객 응대 지원 등이 포함됩니다.',
                'AI 정비 챗봇은 정비사의 일상에 어떤 변화를 가져오나요?': '단순 작업은 AI가 처리하고, 정비사는 더 중요한 업무에 집중할 수 있게 됩니다.',
                'AI 정비 챗봇의 작업 정확도는 얼마나 높은가요?': '최신 데이터를 기반으로 평균 95% 이상의 정확도를 보장하고자 합니다.',
                'AI 정비 챗봇의 유지보수는 어떻게 이루어지나요?': '클라우드 기반으로 유지보수와 업데이트가 자동으로 이루어집니다.',
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
 //       accumulateSnow(); // 눈송이가 제거될 때 눈 쌓이기
    }, 5000);
}

// 눈송이 생성 주기
setInterval(createSnowflake, 300); // 0.3초마다 눈송이 생성
'AI 정비 챗봇은 어떻게 사용하나요? 예시를 들어주실 수 있나요?인터넷이 연결된 기기에서 간단히 접속할 수 있으며, 모델명과 증상만 입력하면 됩니다. 예를 들어, 사용자가 AI 챗봇에게 도요타, 7fbr10_18, 에러코드 A4를 입력하면, 증상과 원인(악셀레이터 스위치 이상), 조치 방법, 관련 부품 정보, 실제 정비 매뉴얼 페이지를 검색 결과로 보여줍니다.'