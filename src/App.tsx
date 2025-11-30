import { useState } from 'react';
import { Upload, Brain, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PredictionResult {
  predicted_class: string;
  confidence: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const classifyImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to classify image');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
  };

  const getTumorTypeColor = (tumorType: string) => {
    const colors: Record<string, string> = {
      glioma: 'from-red-500 to-orange-500',
      meningioma: 'from-blue-500 to-cyan-500',
      notumor: 'from-green-500 to-emerald-500',
      pituitary: 'from-amber-500 to-yellow-500',
    };
    return colors[tumorType.toLowerCase()] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-16 h-16 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Brain Tumor MRI Classifier
            </h1>
            <p className="text-slate-400 text-lg">
              Upload an MRI scan to detect brain tumor type using AI
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8">
            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02]'
                    : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-700/50'
                }`}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-xl text-slate-200 font-semibold mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-slate-400">JPG, JPEG, or PNG (max 10MB)</p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <div className="relative mb-6">
                  <img
                    src={previewUrl}
                    alt="MRI Preview"
                    className="w-full max-h-96 object-contain rounded-lg bg-slate-900"
                  />
                  <button
                    onClick={resetUpload}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg"
                  >
                    Remove
                  </button>
                </div>

                <button
                  onClick={classifyImage}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg shadow-cyan-500/30"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-6 h-6" />
                      Classify MRI
                    </>
                  )}
                </button>

                {result && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      <h2 className="text-2xl font-bold text-white">Results</h2>
                    </div>
                    <div className={`bg-gradient-to-r ${getTumorTypeColor(result.predicted_class)} p-6 rounded-lg`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white/90 text-lg font-medium">Tumor Type:</span>
                        <span className="text-white text-2xl font-bold capitalize">
                          {result.predicted_class}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-lg font-medium">Confidence:</span>
                        <span className="text-white text-2xl font-bold">
                          {(result.confidence * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3 animate-fadeIn">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { name: 'Glioma', color: 'from-red-500 to-orange-500' },
              { name: 'Meningioma', color: 'from-blue-500 to-cyan-500' },
              { name: 'No Tumor', color: 'from-green-500 to-emerald-500' },
              { name: 'Pituitary', color: 'from-amber-500 to-yellow-500' },
            ].map((tumor) => (
              <div
                key={tumor.name}
                className={`bg-gradient-to-br ${tumor.color} p-4 rounded-lg text-center shadow-lg`}
              >
                <p className="text-white font-semibold">{tumor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
