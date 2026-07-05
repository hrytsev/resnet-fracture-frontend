const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

export async function fetchFracturePrediction(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/api/ml/fracture`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchModelInfo() {
  const response = await fetch(`${BASE_URL}/api/ml/model-info`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
