import os
import shutil

def manage_image_directory(base_path, file_name):
    """
    이미지 저장 디렉토리를 관리합니다.
    기존 디렉토리를 삭제하고 새로 생성합니다.
    """
    folder_name = os.path.splitext(file_name)[0]
    folder_path = os.path.join(base_path, folder_name)

    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)

    os.makedirs(folder_path)
    return folder_path
