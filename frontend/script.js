const API_URL = 'http://localhost:8000';

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const classifyBtn = document.getElementById('classifyBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');
const results = document.getElementById('results');
const errorMessage = document.getElementById('errorMessage');
const predictedClass = document.getElementById('predictedClass');
const confidence = document.getElementById('confidence');

let selectedFile = null;

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
});

classifyBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    await classifyImage();
});

function handleFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
        showError('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
    }

    if (file.size > maxSize) {
        showError('File size must be less than 10MB');
        return;
    }

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        classifyBtn.disabled = false;
        results.style.display = 'none';
        errorMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    previewImage.src = '';
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    classifyBtn.disabled = true;
    results.style.display = 'none';
    errorMessage.style.display = 'none';
}

async function classifyImage() {
    if (!selectedFile) return;

    btnText.textContent = 'Classifying...';
    spinner.style.display = 'block';
    classifyBtn.disabled = true;
    errorMessage.style.display = 'none';
    results.style.display = 'none';

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to classify image');
        }

        const data = await response.json();

        predictedClass.textContent = data.predicted_class;
        confidence.textContent = `${(data.confidence * 100).toFixed(2)}%`;

        results.style.display = 'block';

    } catch (error) {
        showError(error.message || 'Failed to connect to the server. Please ensure the backend is running.');
    } finally {
        btnText.textContent = 'Classify MRI';
        spinner.style.display = 'none';
        classifyBtn.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}
