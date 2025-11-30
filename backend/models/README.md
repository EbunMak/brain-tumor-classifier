# Model Files

This directory should contain:

1. **brain_tumor_classifier.keras** - The trained TensorFlow/Keras model file
2. **labels.json** - Class labels (already included)

## Important Note

The `brain_tumor_classifier.keras` file is NOT included in this repository because:
- It's a large file (typically 80-100MB+)
- It needs to be trained or downloaded separately

## How to Get the Model File

You need to upload your trained `brain_tumor_classifier.keras` file to this directory.

The model should:
- Be trained on 299x299 RGB images
- Output 4 classes: glioma, meningioma, notumor, pituitary
- Use softmax activation for the output layer
- Accept normalized pixel values [0, 1]

## Model Architecture Expected

Based on the training notebook, the model uses:
- Base: Xception (pre-trained on ImageNet)
- Input shape: (299, 299, 3)
- Pooling: max
- Additional layers:
  - Flatten
  - Dropout(0.3)
  - Dense(128, activation='relu')
  - Dropout(0.25)
  - Dense(4, activation='softmax')

Once you place the `.keras` file here, the backend will automatically load it on startup.
