import { create } from 'zustand';
import { fetchFracturePrediction, fetchModelInfo } from '../lib/api.js';

const useAppStore = create((set) => ({
  // upload / file
  file: null,
  previewUrl: null,
  fileError: null,

  // prediction request lifecycle
  isPredicting: false,
  prediction: null,
  predictionError: null,

  // model info
  modelInfo: null,
  isModelInfoLoading: false,
  modelInfoError: null,

  // actions
  setFile: (file) => {
    if (!file) {
      set({ file: null, previewUrl: null, fileError: null, prediction: null, predictionError: null });
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      set({ fileError: 'That file isn\'t a PNG or JPEG — try another image.' });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    set({ 
      file, 
      previewUrl, 
      fileError: null, 
      prediction: null, 
      predictionError: null 
    });
  },

  clearFile: () => {
    set({ 
      file: null, 
      previewUrl: null, 
      fileError: null, 
      prediction: null, 
      predictionError: null 
    });
  },

  submitForPrediction: async () => {
    const state = useAppStore.getState();
    if (!state.file) return;

    set({ isPredicting: true, predictionError: null });

    try {
      const prediction = await fetchFracturePrediction(state.file);
      set({ prediction, isPredicting: false });
    } catch {
      set({ 
        predictionError: 'Failed to get prediction. Please try again.', 
        isPredicting: false 
      });
    }
  },

  fetchModelInfo: async () => {
    set({ isModelInfoLoading: true, modelInfoError: null });

    try {
      const modelInfo = await fetchModelInfo();
      set({ modelInfo, isModelInfoLoading: false });
    } catch {
      set({ 
        modelInfoError: 'Failed to load model info.', 
        isModelInfoLoading: false 
      });
    }
  },
}));

export default useAppStore;
