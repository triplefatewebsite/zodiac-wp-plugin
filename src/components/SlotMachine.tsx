import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { SlotItem, ResultsType } from '../types/zodiac';
import * as zodiacData from '../data/zodiac';
import { calculateWesternZodiac, calculateChineseZodiac, calculateNumerology, getWesternImagePath } from '../utils/zodiac';

export interface SlotMachineProps {
  birthdate: Date;
  gender: string; // Added gender prop
  onSpinComplete?: () => void;
  onResults?: (results: ResultsType) => void;
  isSpinning?: boolean;
}

export const SlotMachine: FC<SlotMachineProps> = ({
  birthdate,
  gender, // Added gender prop
  onSpinComplete,
  onResults,
  isSpinning: externalSpinning
}: SlotMachineProps): ReactElement => {
  // State variables
  const [internalSpinning, setInternalSpinning] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<(SlotItem | null)[]>([null, null, null]);
  const [currentSpinItems, setCurrentSpinItems] = useState<SlotItem[]>([
    { ...zodiacData.westernZodiac[0], imagePath: getWesternImagePath(zodiacData.westernZodiac[0].id, gender) },
    zodiacData.chineseZodiac[0],
    zodiacData.numerology[0]
  ]);
  
  // Refs
  const spinInterval = useRef<number | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFinishingAnimationRef = useRef(false); // Initialize directly

  // Derived state - handle spinning state safely
  const spinning: boolean = externalSpinning ?? internalSpinning;

  useEffect(() => {
    console.log('[SlotMachine State] Spinning:', spinning, 'SelectedItems:', JSON.stringify(selectedItems));
  }, [spinning, selectedItems]);

  // Update random items during spin
  const updateRandomItems = useCallback((): void => {
    let randomWestern = zodiacData.westernZodiac[Math.floor(Math.random() * zodiacData.westernZodiac.length)];
    // Ensure gender-specific image path for random item
    if (randomWestern) {
      randomWestern = { ...randomWestern, imagePath: getWesternImagePath(randomWestern.id, gender) };
    }
    const randomChinese = zodiacData.chineseZodiac[Math.floor(Math.random() * zodiacData.chineseZodiac.length)];
    const randomNumerology = zodiacData.numerology[Math.floor(Math.random() * zodiacData.numerology.length)];
    
    if (randomWestern && randomChinese && randomNumerology) {
      const items = [randomWestern, randomChinese, randomNumerology];
      setCurrentSpinItems(items);
    }
  }, [gender]); // Added gender to dependency array

  // Initialize or reset state when spinning starts
  useEffect(() => {
    if (!spinning || !birthdate) return;

    // Reset state
    setSelectedItems([null, null, null]);

    // Calculate final results
    const westernSign = calculateWesternZodiac(birthdate.getMonth() + 1, birthdate.getDate());
    const chineseSign = calculateChineseZodiac(birthdate.getFullYear());
    const numerologyNumber = calculateNumerology(birthdate);

    let westernItem = zodiacData.westernZodiac.find(item => item.id === westernSign);
    // Ensure gender-specific image path for final result item
    if (westernItem) {
      westernItem = { ...westernItem, imagePath: getWesternImagePath(westernItem.id, gender) };
    }
    const chineseItem = zodiacData.chineseZodiac.find(item => item.id === chineseSign);
    const numerologyItem = zodiacData.numerology.find(item => item.id === numerologyNumber);

    if (!westernItem || !chineseItem || !numerologyItem) return;

    const finalResults = {
      western: westernItem,
      chinese: chineseItem,
      numerology: numerologyItem
    };

    // Start spin animation
    let frame = 0;
    const maxFrames = 24; // 6 seconds * 4 frames per second
    const frameInterval = 250; // 250ms between frames

    let spinTimerId: number | undefined = undefined;

    const runSpinAnimation = () => {
      spinTimerId = window.setInterval(() => {
        if (frame >= maxFrames) {
          if (spinTimerId) clearInterval(spinTimerId);
          
          isFinishingAnimationRef.current = true; 
          setSelectedItems([finalResults.western, finalResults.chinese, finalResults.numerology]);
          if (onResults) onResults(finalResults);
          if (onSpinComplete) onSpinComplete(); 

          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          // isFinishingAnimationRef.current will be reset when a new spin starts or on unmount
        } else {
          updateRandomItems();
          frame++;
        }
      }, frameInterval);
    };

    // Start audio and spin
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play error:", e));
    }
    runSpinAnimation();

    // Cleanup function
    return () => {
      if (spinTimerId) clearInterval(spinTimerId);
      // Only reset items if the spin was interrupted (i.e., didn't complete normally)
      if (!isFinishingAnimationRef.current) {
        setSelectedItems([null, null, null]);
      }
      // Ensure audio stops if unmounted during spin
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [spinning, birthdate, onSpinComplete, updateRandomItems, onResults]);

  // Handle audio playback
  useEffect(() => {
    if (spinning && audioRef.current) {
      console.log('Starting audio');
      // Ensure audio is initialized before playing
      if (!audioRef.current.src) {
        audioRef.current.src = 'sounds/spin.mp3';
        audioRef.current.loop = true;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
    } else if (!spinning && audioRef.current && audioRef.current.src) { // Check src to ensure it was initialized
      console.log('Stopping audio');
      audioRef.current.pause();
    }
  }, [spinning]);

  // Effect to handle external spinning prop changes
  useEffect(() => {
    if (externalSpinning === true) {
      // Reset states when a new spin is initiated externally
      setSelectedItems([null, null, null]);
      isFinishingAnimationRef.current = false;
    } else if (externalSpinning === false) {
      setInternalSpinning(false); // Ensure internal state aligns if explicitly stopped
    }
  }, [externalSpinning]);

  // Effect for component mount (audio init, image preloading) and unmount (cleanup)
  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('sounds/spin.mp3');
    audioRef.current.loop = true;

    // Preload all images
    const allSlotImages = [
      ...zodiacData.westernZodiac,
      ...zodiacData.chineseZodiac,
      ...zodiacData.numerology
    ];
    allSlotImages.forEach(item => {
      const img = new window.Image(); // Use window.Image for preloading
      img.src = item.imagePath;
    });

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // audioRef.current = null; // Consider if re-init is needed or if this is safer
      }
      if (spinInterval.current) {
         clearInterval(spinInterval.current);
         spinInterval.current = undefined;
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-800 rounded-lg shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {/* Slot 1: Western Zodiac */}
        <div className="slot-item w-fit mx-auto flex flex-col items-center justify-center p-1 bg-gray-700 rounded-md shadow">
          {spinning && !selectedItems[0] && currentSpinItems[0] ? (
            // Spinning state for Western Zodiac
            <>
              <div className="image-container w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] relative">
                <img
                  src={currentSpinItems[0].imagePath}
                  alt={currentSpinItems[0].name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.border = '2px solid red';
                  }}
                />
              </div>
            </>
          ) : selectedItems[0] ? (
            // Result state for Western Zodiac
            <>
              <div className="image-container w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] relative">
                <img
                  src={selectedItems[0].imagePath}
                  alt={selectedItems[0].name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.border = '2px solid red';
                  }}
                />
              </div>
            </>
          ) : (
            // Placeholder/Initial state for Western Zodiac
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] bg-gray-600 rounded animate-pulse"></div>
          )}
        </div>

        {/* Slot 2: Chinese Zodiac */}
        <div className="slot-item w-fit mx-auto flex flex-col items-center justify-center p-1 bg-gray-700 rounded-md shadow">
          {spinning && !selectedItems[1] && currentSpinItems[1] ? (
            // Spinning state for Chinese Zodiac
            <>
              <div className="image-container w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] relative">
                <img
                  src={currentSpinItems[1].imagePath}
                  alt={currentSpinItems[1].name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.border = '2px solid red';
                  }}
                />
              </div>
            </>
          ) : selectedItems[1] ? (
            // Result state for Chinese Zodiac
            <>
              <div className="image-container w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] relative">
                <img
                  src={selectedItems[1].imagePath}
                  alt={selectedItems[1].name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.border = '2px solid red';
                  }}
                />
              </div>
            </>
          ) : (
            // Placeholder/Initial state for Chinese Zodiac
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] bg-gray-600 rounded animate-pulse"></div>
          )}
        </div>

        {/* Slot 3: Numerology */}
        <div className="slot-item w-fit mx-auto flex flex-col items-center justify-center p-1 bg-gray-700 rounded-md shadow">
          {spinning && !selectedItems[2] && currentSpinItems[2] ? (
            // Spinning state for Numerology
            <>
              <div className="image-container w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] relative">
                <img
                  src={currentSpinItems[2].imagePath}
                  alt={currentSpinItems[2].name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.border = '2px solid red';
                  }}
                />
              </div>
            </>
          ) : selectedItems[2] ? (
            // Result state for Numerology
            <>
              <div className="image-container w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] relative">
                <img
                  src={selectedItems[2].imagePath}
                  alt={selectedItems[2].name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.border = '2px solid red';
                  }}
                />
              </div>
            </>
          ) : (
            // Placeholder/Initial state for Numerology
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-[250px] lg:h-[250px] bg-gray-600 rounded animate-pulse"></div>
          )}
        </div>
      </div>
      {/* Audio element is managed in useEffect */}
    </div>
  )
};

export default SlotMachine;
