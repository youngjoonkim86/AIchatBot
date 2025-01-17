const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const questionListDiv = document.getElementById('questionList');
const questionCategorySelect = document.getElementById('questionCategory');
const defaultMessageDiv = document.getElementById('defaultMessage'); // 기본 메시지 요소

// 질문 데이터
const questionData = {
    operational1: [
        '챗봇은 많이 들어봤지만, 정확히 어떤 서비스 인가요?',
        '그렇다면 AI 정비 챗봇이란 무엇인가요?',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?',
        'AI 정비 챗봇은 어떤 기술로 작동하나요?',
        '초보 정비사도 AI 정비 챗봇을 사용할 수 있나요?',
        'AI 정비 챗봇은 데이터를 어떻게 업데이트하나요?',
        'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?'
    ],
    operational2: [
        '산업장비 정비파트에서 AI 정비 챗봇이 필요한 이유는 뭔가요?',
        '정비파트에 AI 서비스가 도입되면 영업사원 입장에서 어떤 점이 좋아지나요?'
    ],
    operational3: [
        '언제부터 AI 정비 챗봇을 사용할 수 있나요?',
        'AI 정비 챗봇은 어떻게 사용하나요? 예시를 들어주실 수 있나요?',
        'AI 정비 챗봇은 어떻게 접속하나요? 모바일로도 가능한가요?'
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
function addMessage(content, sender, isHTML = false) {
    if (defaultMessageDiv) {
        defaultMessageDiv.style.display = 'none'; // 기본 메시지 숨기기
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('bubble');

    if (isHTML) {
        bubbleDiv.innerHTML = content; // HTML 렌더링
    } else {
        bubbleDiv.textContent = content; // 일반 텍스트
    }

    messageDiv.appendChild(bubbleDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
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
        addMessage(response, 'ai', true); // HTML 메시지 처리
    }, 500);
}

// AI 응답
function getAIResponse(message) {
    const responses = {
        '챗봇은 많이 들어봤지만, 정확히 어떤 서비스인가요?' : '챗봇은 문자나 음성을 통해 사용자와 소통하는 AI 도구입니다. 자연어 처리(NLP) 기술을 활용해 사용자의 질문을 이해하고 적절한 답변을 제공합니다. 언제 어디서나 문제를 해결하고, 정보를 제공하며, 다양한 작업을 도와줄 수 있습니다. 이러한 점을 바탕으로 AI 정비 챗봇을 개발하게 되었으며, 현재 도요타 모델인 7FB와 7FBR의 매뉴얼을 학습하고 있습니다. 표준화된 용어사전을 기반으로 일관된 답변을 제공할 수 있도록 준비 중입니다.',
        '그렇다면 AI 정비 챗봇이란 무엇인가요?' : 'AJ의 AI 정비 챗봇은 정비 매뉴얼을 디지털화하고 문제를 해결을 지원하는 전문 가상 도우미입니다.',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?' : '기존 시스템은 사람이 직접 매뉴얼을 검색하고 데이터를 관리해야 해서 시간이 많이 소요되었지만, AI 정비 챗봇은 이 과정을 자동화하여 정비 시간을 크게 줄여줍니다.',
        'AI 정비 챗봇은 어떤 기술로 작동하나요?' : '자연어 처리(NLP)와 기계 학습(ML)을 통해 사용자의 질문을 이해하고 답변을 제공합니다. 기본적으로 글(text)로 질문하고 글(text)로 답변하지만, 현장 상황과 정비사의 니즈를 반영하여 질문 양식을 미리 만들어 놓거나 몇 번의 클릭만으로 질문을 완성할 수 있도록 편의성을 높일 예정입니다.',
        '초보 정비사도 AI 정비 챗봇을 사용할 수 있나요?' : '네, 간단한 인터페이스 덕분에 초보자도 쉽게 사용할 수 있습니다.',
        'AI 정비 챗봇은 데이터를 어떻게 업데이트하나요?' : '클라우드 기반으로 실시간 업데이트가 이루어져 최신 데이터를 유지합니다.',
        'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?' : '아니요, AI는 정비사를 보조하는 도구로 설계되었습니다.',
        '산업장비 정비파트에서 AI 정비 챗봇이 필요한 이유는 무엇인가요?' : '정확하고 빠른 정보 검색과 외부 AI 플랫폼의 보안 이슈로 인해 자체 AI 정비 챗봇이 필요하다고 판단했습니다. 지난해 효과성을 사전 검증하기 위해 산업장비 운영본부와 정비 방식에 대한 비즈니스 현안을 확인했습니다. 정비 매뉴얼과 부품 카탈로그를 공유 폴더를 활용하여 검색하고 있었지만, 영문 문서는 가독성이 떨어지고 부품 카탈로그는 원하는 페이지를 찾는 데 어려움이 있었습니다. 400여 개 모델의 문서를 찾아가는 불편함도 있었습니다. AI 정비 챗봇을 통해 질의응답 방식으로 빠르고 정확하게 정보를 찾을 수 있을 것으로 기대하고 있습니다. 또한 외부 AI 플랫폼으로 업무와 연관된 데이터를 학습시키면 보안상 위험이 있을 수 있어 AJ만의 자체 AI 정비 챗봇을 설계하였습니다.',
        '정비파트에 AI 서비스가 도입되면 영업사원 입장에서 어떤 점이 좋아지나요?' : '빠른 AS 처리는 AJ의 핵심 역량 중 하나입니다. AS 출동 전 정확한 부품을 미리 준비하고 현장에서 고장 점검 시간을 줄이면서 정확도를 높인다면 고객 만족도가 높아질 것으로 기대합니다.',
        '언제부터 AI 정비 챗봇을 사용할 수 있나요?' : '프로젝트는 총 5단계로 구성되어 있으며, 도요타 7FB와 7FBR 모델은 3월 내 1차 오픈 후 바로 사용이 가능할 예정입니다. 2차는 도요타 8FB와 8FBR 모델로 4월 중 오픈될 예정이며, 3차인 클라크는 6월, 4차인 현대는 7월, 두산은 9월에 오픈될 예정입니다.',
        'AI 정비 챗봇은 어떻게 사용하나요? 예시를 들어주실 수 있나요?' : '인터넷이 연결된 기기에서 간단히 접속할 수 있으며, 모델명과 증상만 입력하면 됩니다. 예를 들어, 사용자가 AI 챗봇에게 도요타, 7fbr10_18, 에러코드 A4를 입력하면, 증상과 원인(악셀레이터 스위치 이상), 조치 방법, 관련 부품 정보, 실제 정비 매뉴얼 페이지를 검색 결과로 보여줍니다.',
        'AI 정비 챗봇은 어떻게 접속하나요? 모바일로도 가능한가요?' : '현재는 PC 웹에서 사용 가능합니다. 향후 기능 개선을 통해 현장에서 모바일로도 사용할 수 있도록 제공될 예정입니다.',
        '이주연 과장님!' : '저 괴롭히지 마요',
        'AI 정비 챗봇은 어떻게 사용하나요? 예시를 들어주실 수 있나요?': `
            <div>
                <p>AI 정비 챗봇은 간단히 접속하여 모델명과 증상을 입력하면 됩니다.</p>
                <h3>예시</h3>
                <p>입력: 도요타, 7FBR, 에러코드 A4</p>
                <h4>결과</h4>
                <table border="1" style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th>항목</th>
                        <th>내용</th>
                    </tr>
                    <tr>
                        <td>증상</td>
                        <td>악셀레이터 스위치 이상</td>
                    </tr>
                    <tr>
                        <td>조치</td>
                        <td>스위치 교체</td>
                    </tr>
                </table>
                <img src="img/ai-image.png" alt="AI 응답 예시" style="width: 100%; height: 500px">
            </div>
        `
    };

    return responses[message] || "질문에 대한 답변을 준비 중입니다.";
}

// 초기화
updateQuestions();
