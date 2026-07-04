import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import useAppStore from './store/useAppStore.js';
import UploadDropzone from './components/UploadDropzone.jsx';
import Preloader from './components/Preloader.jsx';
import PredictionResult from './components/PredictionResult.jsx';
import ModelInfoPanel from './components/ModelInfoPanel.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import SocialLinks from './components/SocialLinks.jsx';

function App() {
  const { file, isPredicting, prediction, predictionError, submitForPrediction, fetchModelInfo } = useAppStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetchModelInfo();
  }, [fetchModelInfo]);

  useEffect(() => {
    if (file && !prediction && !predictionError) {
      submitForPrediction();
    }
  }, [file, prediction, predictionError, submitForPrediction]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[80px_1fr_320px] gap-8 items-start">
        {/* Left column - Social links */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0, duration: prefersReducedMotion ? 0.01 : 0.3 }}
          className="order-1 lg:order-1"
        >
          <SocialLinks />
        </motion.div>
        
        {/* Center column - Main content */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.1, duration: prefersReducedMotion ? 0.01 : 0.3 }}
          className="flex flex-col items-center justify-center order-2 lg:order-2"
        >
          {!file && <UploadDropzone />}
          
          {isPredicting && <Preloader />}
          
          {prediction && !isPredicting && <PredictionResult />}
          
          {predictionError && <ErrorMessage message={predictionError} />}
        </motion.div>
        
        {/* Right column - Model info */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0.01 : 0.3 }}
          className="order-3 lg:order-3 flex flex-col"
        >
          <ModelInfoPanel compact />
          <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
            This tool is for educational/demonstration purposes only. It is not a medical device and must not be used for diagnosis or treatment decisions. No liability is assumed for its use.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
