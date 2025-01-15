from flask import Flask, render_template, request, jsonify
import pdfplumber
import fitz
import pytesseract
from pdf2image import convert_from_path
import json
import os
import re
import logging
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
from googletrans import Translator

app = Flask(__name__)

# 경로 설정
DATA_DIR = "./data/"
INPUT_PDF = os.path.join(DATA_DIR, "toaz.info-7fb10-30-vol-2.pdf")
TRANSLATED_JSON = os.path.join(DATA_DIR, "translated.json")
OUTPUT_PDF = os.path.join(DATA_DIR, "output.pdf")
OUTPUT_IMAGES_DIR = os.path.join(DATA_DIR, "images")
OUTPUT_TABLES_DIR = os.path.join(DATA_DIR, "tables")

# 디렉토리 생성
os.makedirs(OUTPUT_IMAGES_DIR, exist_ok=True)
os.makedirs(OUTPUT_TABLES_DIR, exist_ok=True)

# 로깅 설정
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Tesseract 경로 설정 (Windows 사용자 필요 시)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# 하이픈 처리 함수
def clean_text_with_hyphen_handling(text):
    cleaned_text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
    return cleaned_text.replace("\n", " ")

# OCR 텍스트 추출
def ocr_extract_text(pdf_path):
    poppler_path = r"C:\Users\joony\AIchatBot\admin\poppler\Library\bin"
    images = convert_from_path(pdf_path, poppler_path=poppler_path)
    extracted_text = []
    for idx, image in enumerate(images):
        text = pytesseract.image_to_string(image, lang="eng")
        cleaned_text = clean_text_with_hyphen_handling(text)
        logging.info(f"OCR extracted text for page {idx + 1}: {cleaned_text[:100]}")
        extracted_text.append(cleaned_text)
        image_path = f"{OUTPUT_IMAGES_DIR}/ocr_page_{idx + 1}.png"
        image.save(image_path)
    return extracted_text

# PDF 데이터 추출
def extract_content_from_pdf(pdf_path):
    content = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            raw_text = page.extract_text() or "No text found. Use OCR if needed."
            cleaned_text = clean_text_with_hyphen_handling(raw_text)
            page_content = {
                "original_text": cleaned_text,
                "translated_text": "",
                "tables": [],
                "images": []
            }

            # 테이블 추출
            for table in page.extract_tables():
                page_content["tables"].append(table)

            content.append(page_content)

    # 이미지 추출
    pdf_document = fitz.open(pdf_path)
    for page_num, page in enumerate(pdf_document):
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_path = f"{OUTPUT_IMAGES_DIR}/page{page_num+1}_img{img_index+1}.{image_ext}"
            with open(image_path, "wb") as f:
                f.write(image_bytes)
            content[page_num]["images"].append(image_path)

    # OCR 병합
    ocr_texts = ocr_extract_text(pdf_path)
    for idx, ocr_text in enumerate(ocr_texts):
        if not content[idx]["original_text"].strip() or content[idx]["original_text"] == "No text found. Use OCR if needed.":
            content[idx]["original_text"] = ocr_text

    return content

# JSON 저장 및 로드
def save_to_json(data, path):
    logging.info(f"Saving JSON to {path}")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def load_from_json(path):
    logging.info(f"Loading JSON from {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# 텍스트 번역
def translate_content(content, target_lang="ko"):
    translator = Translator()
    for page in content:
        if page["original_text"] and not page["translated_text"]:
            try:
                logging.info(f"Translating: {page['original_text'][:50]}...")
                page["translated_text"] = translator.translate(page["original_text"], dest=target_lang).text
            except Exception as e:
                logging.error(f"Translation error: {e}")
                page["translated_text"] = page["original_text"]
    return content

# PDF 생성
def create_pdf(content, output_path):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    margin = 50

    for page_num, page in enumerate(content):
        y_position = height - margin

        # 페이지 제목
        c.setFont("Helvetica-Bold", 14)
        c.drawString(margin, y_position, f"Page {page_num + 1}")
        y_position -= 20

        # 텍스트 추가
        c.setFont("Helvetica", 10)
        text_lines = page["original_text"].splitlines()
        for line in text_lines:
            c.drawString(margin, y_position, line)
            y_position -= 12
            if y_position < margin:
                c.showPage()
                y_position = height - margin

        # 이미지 추가
        for image_path in page["images"]:
            if y_position < 200:
                c.showPage()
                y_position = height - margin
            c.drawImage(image_path, margin, y_position - 200, width=200, height=200)
            y_position -= 220

        # 테이블 추가
        for table_data in page["tables"]:
            if y_position < 100:
                c.showPage()
                y_position = height - margin
            table = Table(table_data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ]))
            table.wrapOn(c, width - 2 * margin, y_position)
            table.drawOn(c, margin, y_position - 100)
            y_position -= (len(table_data) * 12 + 20)

        c.showPage()

    c.save()

@app.route("/")
def index():
    try:
        content = load_from_json(TRANSLATED_JSON)
    except FileNotFoundError:
        logging.info(f"{TRANSLATED_JSON} not found. Generating new data.")
        content = extract_content_from_pdf(INPUT_PDF)
        content = translate_content(content)
        save_to_json(content, TRANSLATED_JSON)

    return render_template("index.html", pages=content, total_pages=len(content))

@app.route("/save", methods=["POST"])
def save():
    data = request.json.get("pages", [])
    save_to_json(data, TRANSLATED_JSON)
    create_pdf(data, OUTPUT_PDF)
    return jsonify({"message": "Changes saved successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
