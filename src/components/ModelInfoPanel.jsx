import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useAppStore from '../store/useAppStore.js';

export default function ModelInfoPanel({ compact = false }) {
  const { modelInfo, isModelInfoLoading, modelInfoError, fetchModelInfo } = useAppStore();
  const [showConfusionMatrix, setShowConfusionMatrix] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  if (!modelInfo && !isModelInfoLoading && !modelInfoError) {
    return (
      <button
        onClick={fetchModelInfo}
        className={`${compact ? '' : 'mt-8'} text-gray-500 hover:text-gray-300 text-sm transition-colors focus:outline-none focus:underline`}
      >
        Load model info
      </button>
    );
  }

  if (isModelInfoLoading) {
    return (
      <div className={`${compact ? '' : 'mt-8'} text-gray-500 text-sm`}>
        Loading model info...
      </div>
    );
  }

  if (modelInfoError) {
    return (
      <div className={`${compact ? '' : 'mt-8'} text-red-400 text-sm`}>
        {modelInfoError}
      </div>
    );
  }

  if (!modelInfo || !modelInfo.info) return null;

  const { info } = modelInfo;

  return (
    <div className={`${compact ? '' : 'mt-8 w-full max-w-2xl mx-auto'}`}>
      <div className={`bg-[#111] rounded-xl ${compact ? 'p-4' : 'p-6'} border border-gray-800`}>
        <h3 className={`text-gray-300 font-semibold ${compact ? 'text-sm mb-3' : 'mb-4'}`}>Model Information</h3>
        
        <div className={`grid grid-cols-2 ${compact ? 'gap-2 mb-3' : 'gap-4 mb-6'}`}>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Architecture</p>
            <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{info.architecture}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Version</p>
            <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{info.version}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Framework</p>
            <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{info.framework}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Task</p>
            <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{info.task}</p>
          </div>
        </div>

        {info.metrics && (
          <div>
            <h4 className={`text-gray-400 ${compact ? 'text-xs mb-2' : 'text-sm mb-3'}`}>Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Accuracy</p>
                <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{(info.metrics.accuracy * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Precision</p>
                <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{(info.metrics.precision * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Recall</p>
                <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{(info.metrics.recall * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">F1 Score</p>
                <p className={`text-gray-300 ${compact ? 'text-xs' : ''}`}>{(info.metrics.f1_score * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}

        {info.metrics && info.metrics.confusion_matrix && (
          <div className="mt-3">
            <motion.button
              onClick={() => setShowConfusionMatrix(!showConfusionMatrix)}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className="text-gray-500 hover:text-[#38bdf8] text-xs transition-all duration-200 focus:outline-none focus:underline"
            >
              {showConfusionMatrix ? 'Hide' : 'Show'} confusion matrix
            </motion.button>
            <AnimatePresence>
              {showConfusionMatrix && (
                <motion.div
                  initial={{ opacity: 0, height: prefersReducedMotion ? 'auto' : 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: prefersReducedMotion ? 'auto' : 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.2, ease: 'easeOut' }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="p-2 bg-[#0A0A0A] rounded text-xs text-gray-400">
                    <div className="grid grid-cols-2 gap-1">
                      <div>TN: {info.metrics.confusion_matrix[0][0]}</div>
                      <div>FP: {info.metrics.confusion_matrix[0][1]}</div>
                      <div>FN: {info.metrics.confusion_matrix[1][0]}</div>
                      <div>TP: {info.metrics.confusion_matrix[1][1]}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
