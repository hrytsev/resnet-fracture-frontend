import { motion, useReducedMotion } from 'framer-motion';

export default function Preloader() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto"
    >
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 rounded-full border-2 border-[#38bdf8] border-t-transparent"
      />
      <motion.p
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 0.1, duration: prefersReducedMotion ? 0.01 : 0.2 }}
        className="mt-4 text-gray-400 text-sm"
      >
        Analyzing image...
      </motion.p>
    </motion.div>
  );
}
