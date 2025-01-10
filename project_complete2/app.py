from flask import Flask, render_template, request, jsonify, send_file
import os
import pandas as pd
from utils.pdf_processing import process_pdf_with_bedrock, process_pdf_and_generate_metadata
from utils.directory_management import manage_image_directory

app = Flask(__name__)

UPLOAD_FOLDER_IMAGES = 'uploads/images'
UPLOAD_FOLDER_DATA = 'uploads/data'

# 폴더 생성
os.makedirs(UPLOAD_FOLDER_IMAGES, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_DATA, exist_ok=True)


@app.route('/')
def index():
    """
    메인 페이지 렌더링
    """
    return render_template('index.html')


@app.route('/process-pdf')
def process_pdf_page():
    """
    PDF 처리 페이지 렌더링
    """
    return render_template('process_pdf.html')


@app.route('/dictionary')
def dictionary_page():
    """
    사전 페이지 렌더링
    """
    return render_template('dictionary.html')


@app.route('/pdf-management')
def pdf_management_page():
    """
    PDF 관리 페이지 렌더링
    """
    return render_template('pdf_management.html')


@app.route('/data-management')
def data_management_page():
    """
    데이터 관리 페이지 렌더링
    """
    return render_template('data_management.html')


@app.route('/process', methods=['POST'])
def process_pdf_route():
    """
    PDF 처리 요청 핸들러:
    - 파일 업로드
    - PDF 전처리 수행
    """
    file = request.files.get('pdf_file')
    if not file:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    # 업로드된 파일 저장
    file_path = os.path.join(UPLOAD_FOLDER_DATA, file.filename)
    file.save(file_path)

    # 이미지 저장 폴더 생성
    image_folder = manage_image_directory(UPLOAD_FOLDER_IMAGES, file.filename)
    output_folder = UPLOAD_FOLDER_DATA

    try:
        # PDF 처리 및 결과 저장
        metadata_path, processed_data_path = process_pdf_and_generate_metadata(
            file_path, image_folder, output_folder
        )
        return jsonify({
            "status": "success",
            "metadata_path": metadata_path,
            "processed_data_path": processed_data_path
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/uploaded-files')
def uploaded_files():
    """
    업로드된 PDF 파일 목록 반환
    """
    files = os.listdir(UPLOAD_FOLDER_DATA)
    return jsonify([f for f in files if f.endswith('.pdf')])


@app.route('/processed-data/<filename>')
def processed_data(filename):
    """
    처리된 데이터 파일 반환
    """
    processed_file_path = os.path.join(UPLOAD_FOLDER_DATA, f"processed_{filename}")
    if os.path.exists(processed_file_path):
        return send_file(processed_file_path)
    return jsonify({"error": "Processed file not found"}), 404


@app.route('/dictionary-data', methods=['GET'])
def dictionary_data():
    """
    메타데이터 및 테이블 데이터 반환
    """
    metadata_path = os.path.join(UPLOAD_FOLDER_DATA, 'metadata.csv')
    if os.path.exists(metadata_path):
        data = pd.read_csv(metadata_path).to_dict(orient='records')
        return jsonify(data)
    return jsonify([])


if __name__ == "__main__":
    app.run(debug=True)
