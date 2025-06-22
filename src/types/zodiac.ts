export interface SlotItem {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  type?: 'western' | 'chinese' | 'numerology';
  traits?: string[];
  element?: string;
  quality?: string;
  characteristics?: string[];
}

export interface ResultsType {
  western: SlotItem | null;
  chinese: SlotItem | null;
  numerology: SlotItem | null;
}

export interface SlotMachineProps {
  birthdate: Date;
  onSpin?: (date: Date) => void;
  onSpinComplete?: () => void;
  onResults?: (results: ResultsType) => void;
  gender: string;
  showNextButton?: boolean;
  onNext?: () => void;
  onViewReading?: () => void;
  personNumber?: number;
  isSpinning?: boolean;
}
