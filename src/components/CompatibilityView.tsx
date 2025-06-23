'use client';

import { motion } from 'framer-motion';
import { FC } from 'react';
import { getWesternImagePath, getChineseImagePath, getNumerologyImagePath } from '../utils/zodiac';
import { ResultsType } from '../types/zodiac';

interface CompatibilityViewProps {
  results: ResultsType;
  gender: string;
  onBack: () => void;
}

const getVideoPath = (sign: string, type: string) => {
  const baseUrl = (window as any).zodiacPluginData?.pluginUrl || '';
  const signLower = sign.toLowerCase();
  if (type === 'western') {
    return `${baseUrl}build/videos/western/${signLower}-western.mp4`;
  } else if (type === 'eastern') {
    return `${baseUrl}build/videos/eastern/${signLower}-eastern.mp4`;
  } else if (type === 'numerology') {
    return `${baseUrl}build/videos/numerology/number-${signLower}.mp4`;
  }
  return '';
};

export const CompatibilityView: FC<CompatibilityViewProps> = ({ results, gender, onBack }) => {
  const { western, chinese, numerology } = results;

  if (!western || !chinese || !numerology) {
    return <div className="text-white">Loading results...</div>;
  }

  return (
    <div className="space-y-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Your Cosmic Reading</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Western Zodiac */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-gray-700/50 p-6 rounded-xl"
        >
          <p className="text-lg font-semibold mb-2">Western Zodiac</p>
          <p className="text-2xl capitalize mb-4">{western.name}</p>
          <video
            width="320"
            height="180"
            controls
            controlsList="nodownload"
            className="w-full rounded-lg"
            src={getVideoPath(western.name, 'western')}
            poster={getWesternImagePath(western.name, gender)}
          />
        </motion.div>

        {/* Chinese Zodiac */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center bg-gray-700/50 p-6 rounded-xl"
        >
          <p className="text-lg font-semibold mb-2">Chinese Zodiac</p>
          <p className="text-2xl capitalize mb-4">{chinese.name}</p>
          <video
            width="320"
            height="180"
            controls
            controlsList="nodownload"
            className="w-full rounded-lg"
            src={getVideoPath(chinese.name, 'eastern')}
            poster={getChineseImagePath(chinese.name)}
          />
        </motion.div>

        {/* Numerology */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center bg-gray-700/50 p-6 rounded-xl"
        >
          <p className="text-lg font-semibold mb-2">Life Path Number</p>
          <p className="text-2xl mb-4">{numerology.name}</p>
          <video
            width="320"
            height="180"
            controls
            controlsList="nodownload"
            className="w-full rounded-lg"
            src={getVideoPath(numerology.name, 'numerology')}
            poster={getNumerologyImagePath(numerology.name)}
          />
        </motion.div>
      </div>

      <div className="flex justify-center mt-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          onClick={onBack}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold transition-colors"
        >
          Spin Again
        </motion.button>
      </div>
    </div>
  );
};
