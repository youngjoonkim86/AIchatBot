import os
import fitz  # PyMuPDF
import json
import pandas as pd
from collections import Counter
from utils.bedrock import analyze_image
from utils.data_processing import process_data, translate_data
from utils.prompts import get_text_and_table_prompt


def process_pdf_with_bedrock(file_path, image_folder):
    """
    PDF 파일을 처리하고 Bedrock API를 사용하여 데이터를 전처리합니다.
    """
    doc = fitz.open(file_path)
    total_pages = doc.page_count
    word_metadata = []
    processed_data = []

    print(f"Processing {total_pages} pages from PDF...")

    for page_num in range(total_pages):
        # 각 페이지 이미지 저장
        page = doc[page_num]
        image_path = os.path.join(image_folder, f"page_{page_num + 1}.png")
        pix = page.get_pixmap()
        pix.save(image_path)

        # Bedrock API 호출
        prompt = get_text_and_table_prompt()
        raw_response = analyze_image(image_path, prompt)

        try:
            # JSON 데이터 파싱
            response_data = json.loads(raw_response)
            text_data = response_data.get("text", "")
            table_data = response_data.get("table", [])

            # 텍스트 전처리 및 번역
            processed_text = process_data(text_data)
            translated_text = translate_data(processed_text, target_language="ko")

            # 단어 빈도 계산 및 메타데이터 생성
            words = processed_text.split()
            word_count = Counter(words)
            for word, count in word_count.items():
                translated_word = translate_data(word, target_language="ko")
                word_metadata.append({
                    "Page": page_num + 1,
                    "Word": word,
                    "Count": count,
                    "Translated Word": translated_word
                })

            # 처리된 데이터 저장
            processed_data.append({
                "Page": page_num + 1,
                "Image Path": image_path,
                "Content": translated_text,
                "Table": table_data
            })

            # 진행 상황 출력
            print(f"Processed page {page_num + 1}/{total_pages}")

        except Exception as e:
            print(f"Error processing page {page_num + 1}: {e}")

    doc.close()
    print("PDF processing completed.")
    return pd.DataFrame(word_metadata), pd.DataFrame(processed_data)


def process_pdf_and_generate_metadata(file_path, image_folder, output_folder):
    """
    PDF 파일을 처리하고 메타데이터를 생성합니다.
    """
    metadata_df, processed_data_df = process_pdf_with_bedrock(file_path, image_folder)

    # 파일 저장 경로 설정
    metadata_path = os.path.join(output_folder, "metadata.csv")
    processed_data_path = os.path.join(output_folder, "processed_data.csv")

    # CSV 저장
    metadata_df.to_csv(metadata_path, index=False)
    processed_data_df.to_csv(processed_data_path, index=False)

    print(f"Metadata saved to {metadata_path}")
    print(f"Processed data saved to {processed_data_path}")

    return metadata_path, processed_data_path
