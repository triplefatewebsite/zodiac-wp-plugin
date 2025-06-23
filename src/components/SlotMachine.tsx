import { FC, useState, useEffect, useRef, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SlotItem, ResultsType } from '../types/zodiac';
import * as zodiacData from '../data/zodiac';
import { calculateWesternZodiac, calculateChineseZodiac, calculateNumerology, getWesternImagePath } from '../utils/zodiac';

export interface SlotMachineProps {
  onSpinComplete: (results: ResultsType, gender: string) => void;
  showResultsButton: boolean;
  onShowResults: () => void;
}

export const SlotMachine: FC<SlotMachineProps> = ({ onSpinComplete, showResultsButton, onShowResults }) => {
  const [birthdate, setBirthdate] = useState(new Date());
  const [gender, setGender] = useState('male');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<(SlotItem | null)[]>([null, null, null]);
  const [currentSpinItems, setCurrentSpinItems] = useState<SlotItem[]>([{
    ...zodiacData.westernZodiac[0],
    imagePath: getWesternImagePath(zodiacData.westernZodiac[0].id, 'male')
  }, zodiacData.chineseZodiac[0], zodiacData.numerology[0]]);

  const spinInterval = useRef<number | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const updateRandomItems = useCallback(() => {
    let randomWestern = zodiacData.westernZodiac[Math.floor(Math.random() * zodiacData.westernZodiac.length)];
    randomWestern = { ...randomWestern, imagePath: getWesternImagePath(randomWestern.id, gender) };
    const randomChinese = zodiacData.chineseZodiac[Math.floor(Math.random() * zodiacData.chineseZodiac.length)];
    const randomNumerology = zodiacData.numerology[Math.floor(Math.random() * zodiacData.numerology.length)];
    setCurrentSpinItems([randomWestern, randomChinese, randomNumerology]);
  }, [gender]);

  useEffect(() => {
    if (!isSpinning) return;

    setSelectedItems([null, null, null]);

    const westernSign = calculateWesternZodiac(birthdate.getMonth() + 1, birthdate.getDate());
    const chineseSign = calculateChineseZodiac(birthdate.getFullYear());
    const numerologyNumber = calculateNumerology(birthdate);

    let westernItem = zodiacData.westernZodiac.find(item => item.id === westernSign);
    if (westernItem) {
      westernItem = { ...westernItem, imagePath: getWesternImagePath(westernItem.id, gender) };
    }
    const chineseItem = zodiacData.chineseZodiac.find(item => item.id === chineseSign);
    const numerologyItem = zodiacData.numerology.find(item => item.id === numerologyNumber);

    if (!westernItem || !chineseItem || !numerologyItem) {
        setIsSpinning(false);
        return;
    };

    const finalResults: ResultsType = { western: westernItem, chinese: chineseItem, numerology: numerologyItem };

    let frame = 0;
    const maxFrames = 24;
    const frameInterval = 250;

    const runSpinAnimation = () => {
      if (frame >= maxFrames) {
        if (spinInterval.current) {
          clearInterval(spinInterval.current);
          spinInterval.current = undefined;
          setSelectedItems([finalResults.western, finalResults.chinese, finalResults.numerology]);
          onSpinComplete(finalResults, gender);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setIsSpinning(false);
        }
        return;
      }
      updateRandomItems();
      frame++;
    };

    spinInterval.current = window.setInterval(runSpinAnimation, frameInterval);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }

    return () => {
      if (spinInterval.current) {
        clearInterval(spinInterval.current);
      }
    };
  }, [isSpinning, birthdate, gender, onSpinComplete, updateRandomItems]);

  const handleSpinClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setBirthdate(date);
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
  };

  useEffect(() => {
    const audio = new Audio(`${(window as any).zodiacPluginData.pluginUrl}build/audio/slot-machine.mp3`);
    audio.preload = 'auto';
    audioRef.current = audio;
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-lg shadow-xl">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <DatePicker
          selected={birthdate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="p-2 rounded bg-gray-700 text-white w-full"
        />
        <select onChange={handleGenderChange} value={gender} className="p-2 rounded bg-gray-700 text-white">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {/* Slot Display Logic */}
        {[0, 1, 2].map(index => (
          <div key={index} className="slot-item mx-auto flex flex-col items-center justify-center p-2 bg-gray-700 rounded-md shadow w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px]">
            {selectedItems[index] ? (
              <div className="image-container w-full h-full relative">
                <img
                  src={selectedItems[index]!.imagePath}
                  alt={selectedItems[index]!.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            ) : isSpinning && currentSpinItems[index] ? (
              <div className="image-container w-full h-full relative">
                <img
                  src={currentSpinItems[index].imagePath}
                  alt={currentSpinItems[index].name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            ) : currentSpinItems[index] ? (
                <div className="image-container w-full h-full relative">
                    <img
                        src={currentSpinItems[index].imagePath}
                        alt={currentSpinItems[index].name}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </div>
            ) : (
              <div className="w-full h-full bg-gray-600 rounded animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {!isSpinning && !showResultsButton && (
        <button
          onClick={handleSpinClick}
          className="mt-6 px-8 py-4 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Spin
        </button>
      )}
      {showResultsButton && (
        <button
          onClick={onShowResults}
          className="mt-6 px-8 py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300"
        >
          View Results
        </button>
      )}
    </div>
  );
};


