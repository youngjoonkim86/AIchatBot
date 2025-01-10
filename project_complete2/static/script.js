document.addEventListener("DOMContentLoaded", function () {
    // PDF 처리 진행률 업데이트
    const uploadForm = document.getElementById("upload-form");
    const progressFill = document.getElementById("progress-fill");
    const statusMessage = document.getElementById("status-message");

    if (uploadForm) {
        uploadForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const fileInput = document.querySelector('input[name="pdf_file"]');
            const formData = new FormData();
            formData.append("pdf_file", fileInput.files[0]);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/process", true);

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    progressFill.style.width = `${percentComplete}%`;
                    progressFill.textContent = `${percentComplete}%`;
                }
            };

            xhr.onload = function () {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    statusMessage.textContent = `Processing Complete! Metadata saved at: ${response.metadata_path}`;
                } else {
                    statusMessage.textContent = "Error during processing.";
                }
            };

            xhr.send(formData);
        });
    }

    // 파일 리스트 업데이트
    const fileList = document.getElementById("file-list");
    if (fileList) {
        fetch("/uploaded-files")
            .then(response => response.json())
            .then(files => {
                fileList.innerHTML = files.map(file => `<li>${file}</li>`).join("");
            });
    }
});
