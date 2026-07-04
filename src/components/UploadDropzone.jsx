import { useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useAppStore from '../store/useAppStore.js';

export default function UploadDropzone() {
  const { file, previewUrl, fileError, setFile } = useAppStore();
  const prefersReducedMotion = useReducedMotion();

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, [setFile]);

  const onFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, [setFile]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed 
          flex flex-col items-center justify-center p-8 transition-all duration-200
          ${fileError ? 'border-red-500' : 'border-[#333] hover:border-[#38bdf8] hover:bg-[#111] hover:shadow-lg hover:shadow-[#38bdf8]/10'}
          bg-[#0A0A0A] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]
        `}
      >
        <input
          type="file"
          accept=".png,.jpeg,.jpg,image/png,image/jpeg"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload X-ray image"
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 max-w-full object-contain rounded-lg mb-4"
              />
              <p className="text-gray-400 text-sm">{file.name}</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center text-center"
            >
              <svg
                className="w-16 h-16 text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-300 text-lg mb-2">Drop your X-ray image here</p>
              <p className="text-gray-500 text-sm">or click to browse</p>
              <p className="text-gray-600 text-xs mt-4">PNG or JPEG only</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {fileError && (
        <p className="mt-4 text-red-400 text-sm" role="alert">
          {fileError}
        </p>
      )}
    </div>
  );
}
