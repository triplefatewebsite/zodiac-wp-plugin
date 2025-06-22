import React, { useState } from 'react';
import { SlotMachine } from './components/SlotMachine';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [birthdate, setBirthdate] = useState(new Date('1990-01-01')); // Example birthdate
  const [gender, setGender] = useState('female'); // Example gender

  const handleSpin = () => {
    // In a real app, you'd get the birthdate and gender from user input.
    // For now, we'll use the example state.
    setIsSpinning(true);
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    console.log('Spin complete!');
    // You could show results here
  };

  return (
    <div className="w-full mx-auto p-4 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold my-8">Zodiac Slot Machine</h1>
      
      {/* This would be replaced by your actual UI for date/gender selection */}
      <div className="mb-8">
        <button 
          onClick={handleSpin}
          disabled={isSpinning}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold disabled:bg-gray-500"
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
        </button>
      </div>

      <SlotMachine 
        birthdate={birthdate}
        gender={gender}
        isSpinning={isSpinning}
        onSpinComplete={handleSpinComplete}
      />
    </div>
  );
}

export default App;
