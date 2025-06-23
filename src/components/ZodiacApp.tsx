import { useState, FC } from 'react';
import { SlotMachine } from './SlotMachine';
import { CompatibilityView } from './CompatibilityView';
import { ResultsType } from '../types/zodiac';

export const ZodiacApp: FC = () => {
  const [view, setView] = useState('slot');
  const [results, setResults] = useState<ResultsType | null>(null);
  const [gender, setGender] = useState('male'); // Default gender
  const [isSpinComplete, setSpinComplete] = useState(false);

  const handleSpinComplete = (finalResults: ResultsType, finalGender: string) => {
    setResults(finalResults);
    setGender(finalGender);
    setSpinComplete(true);
  };

  const handleShowResults = () => {
    setView('results');
  };

  const handleBack = () => {
    setView('slot');
    setResults(null);
    setSpinComplete(false);
  };

  if (view === 'results' && results) {
    return <CompatibilityView results={results} gender={gender} onBack={handleBack} />;
  }

  return (
    <SlotMachine
      onSpinComplete={handleSpinComplete}
      showResultsButton={isSpinComplete}
      onShowResults={handleShowResults}
    />
  );
};
