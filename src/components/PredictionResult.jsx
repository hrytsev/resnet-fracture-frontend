import { motion, useReducedMotion } from 'framer-motion';
import useAppStore from '../store/useAppStore.js';

export default function PredictionResult() {
  const { prediction, clearFile } = useAppStore();
  const prefersReducedMotion = useReducedMotion();

  if (!prediction) return null;

  const confidencePercent = (prediction.prediction_confidence * 100).toFixed(1);
  const isFractured = prediction.prediction === 'fractured';

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto"
    >
      <div className="w-full bg-[#111] rounded-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.1, duration: prefersReducedMotion ? 0.01 : 0.2 }}
            className="text-gray-400 text-sm uppercase tracking-wider mb-2"
          >
            Prediction
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0.01 : 0.3, type: prefersReducedMotion ? 'tween' : 'spring', stiffness: 200 }}
            className={`text-5xl font-bold mb-2 ${isFractured ? 'text-red-400' : 'text-[#38bdf8]'}`}
          >
            {prediction.prediction}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0.01 : 0.2 }}
            className="text-gray-500 text-lg"
          >
            {confidencePercent}% confidence
          </motion.p>
        </div>

        {prediction.confidence && prediction.confidence[0] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0.01 : 0.2 }}
            className="space-y-3 mb-8"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Fracture</span>
              <span className="text-gray-300">
                {(prediction.confidence[0][0] * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 group cursor-pointer">
              <motion.div
                initial={{ width: prefersReducedMotion ? `${prediction.confidence[0][0] * 100}%` : 0 }}
                animate={{ width: `${prediction.confidence[0][0] * 100}%` }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.5, duration: prefersReducedMotion ? 0.01 : 0.8, ease: 'easeOut' }}
                className="bg-red-400 h-2 rounded-full group-hover:bg-red-300"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Normal</span>
              <span className="text-gray-300">
                {(prediction.confidence[0][1] * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 group cursor-pointer">
              <motion.div
                initial={{ width: prefersReducedMotion ? `${prediction.confidence[0][1] * 100}%` : 0 }}
                animate={{ width: `${prediction.confidence[0][1] * 100}%` }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.6, duration: prefersReducedMotion ? 0.01 : 0.8, ease: 'easeOut' }}
                className="bg-[#38bdf8] h-2 rounded-full group-hover:bg-sky-300"
              />
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.7, duration: prefersReducedMotion ? 0.01 : 0.2 }}
          onClick={clearFile}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02, backgroundColor: '#222' }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          className="w-full py-3 px-6 bg-[#1a1a1a] text-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-[#111]"
        >
          Check another image
        </motion.button>
      </div>
    </motion.div>
  );
}
