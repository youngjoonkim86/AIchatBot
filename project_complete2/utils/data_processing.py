import re
from collections import Counter

def process_data(data):
    """
    입력 데이터를 전처리:
    - 앞뒤 공백 제거
    - 소문자 변환
    - 공백 축소
    """
    data = data.strip().lower()
    return re.sub(r'\s+', ' ', data)

def translate_data(data, target_language="ko"):
    """
    데이터를 지정된 언어로 번역합니다.
    - 현재는 단순히 '번역' 태그를 추가하는 로직입니다.
    """
    return f"{data} (translated to {target_language})"

def extract_words(text):
    """
    텍스트에서 단어를 추출합니다.
    """
    return re.findall(r'\w+', text)

def generate_metadata(text, page_number, document_id, file_name):
    """
    단어 기반 메타데이터 생성:
    - 입력 텍스트에서 단어를 추출하여 빈도 계산.
    """
    cleaned_text = process_data(text)
    translated_text = translate_data(cleaned_text, "ko")
    words = extract_words(cleaned_text)
    word_counts = Counter(words)

    metadata = []
    for word, count in word_counts.items():
        metadata.append({
            "document_id": document_id,
            "page_number": page_number,
            "word": word,
            "count": count,
            "file_name": file_name,
            "translated_text": translated_text
        })
    return metadata
