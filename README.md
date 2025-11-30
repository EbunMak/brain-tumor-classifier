# Brain Tumor MRI Classifier

A full-stack web application for classifying brain tumor types from MRI scans using deep learning.

## Features

- Upload MRI brain scan images (JPG, JPEG, PNG)
- Real-time tumor classification
- Confidence score display
- Clean, modern UI with drag-and-drop support
- FastAPI backend with TensorFlow model
- Docker-ready deployment

## Tumor Types Detected

- Glioma
- Meningioma
- No Tumor
- Pituitary

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── models/             # Model files directory
│       ├── brain_tumor_classifier.keras
│       └── labels.json
├── frontend/
│   ├── index.html          # Main HTML page
│   ├── style.css           # Styling
│   └── script.js           # Frontend logic
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js (for serving frontend)
- Docker (optional, for containerized deployment)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Place model files:
   - Ensure `brain_tumor_classifier.keras` is in `backend/models/`
   - Ensure `labels.json` is in `backend/models/`

4. Start the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Serve the frontend using any static file server:

Using Python:
```bash
python -m http.server 3000
```

Using Node.js (with http-server):
```bash
npx http-server -p 3000
```

3. Open `http://localhost:3000` in your browser

### Docker Deployment

1. Build the Docker image:
```bash
cd backend
docker build -t brain-tumor-api .
```

2. Run the container:
```bash
docker run -p 8000:8000 brain-tumor-api
```

## API Endpoints

### POST /predict
Upload an MRI image for classification.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (image file)

**Response:**
```json
{
  "predicted_class": "glioma",
  "confidence": 0.9821
}
```

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## Model Information

The model is based on Xception architecture with:
- Input size: 299x299 RGB images
- Preprocessing: Pixel normalization to [0, 1]
- Output: 4 classes with softmax activation

## Frontend Deployment

The frontend is a static web application and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Simply upload the `frontend/` directory contents to your hosting provider.

**Important:** Update the `API_URL` in `script.js` to point to your deployed backend URL.

## Usage

1. Open the web application
2. Click the upload area or drag and drop an MRI image
3. Preview the uploaded image
4. Click "Classify MRI" button
5. View the predicted tumor type and confidence score

## Security Notes

- File size limited to 10MB
- Only image files accepted (JPG, JPEG, PNG)
- CORS enabled for cross-origin requests
- Input validation on both frontend and backend

## License

This project is for educational and research purposes.
