

export const getWesternImagePath = (sign: string, gender: string | null | undefined): string => {
  const basePath = `${(window as any).zodiacPluginData.pluginUrl}build/images/western-zodiac/`;
  const signLower = sign.toLowerCase();
  
  if (gender === 'male') {
    return `${basePath}male/${signLower}-male.png`; 
  }
  return `${basePath}${signLower}.png`;
};

export const getChineseImagePath = (sign: string): string => {
  return `${(window as any).zodiacPluginData.pluginUrl}build/images/chinese-zodiac/${sign.toLowerCase()}.png`;
};

export const getNumerologyImagePath = (number: string): string => {
  return `${(window as any).zodiacPluginData.pluginUrl}build/images/numerology/${number}.png`;
};

export const calculateWesternZodiac = (month: number, day: number): string => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'aquarius';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 'pisces';
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'sagittarius';
  } else {
    return 'capricorn';
  }
};

export const calculateChineseZodiac = (year: number): string => {
  const signs = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
  return signs[(year + 8) % 12];
};

const reduceToSingleDigit = (num: number): number => {
  if (num <= 9) return num;
  return reduceToSingleDigit(num.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0));
};

export const calculateNumerology = (birthdate: Date): string => {
  const day = birthdate.getDate();
  const month = birthdate.getMonth() + 1;
  const year = birthdate.getFullYear();
  
  const sum = day.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0) +
              month.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0) +
              year.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
  
  if (sum === 11 || sum === 22 || sum === 33) {
    return sum.toString();
  }
  
  const finalNumber = reduceToSingleDigit(sum);
  return finalNumber.toString();
};
