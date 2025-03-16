//method to add on scores based on answers
export const calculateNewScore = (currentScore: number, optionsScore: number): number => {
    return currentScore + optionsScore;
  }
  
  //method to find the skin type
  export const determineSkinType = (score: number) => {
    if (score <= 2) return 'Type I (Very Fair)';
    if (score <= 5) return 'Type II (Fair)';
    if (score <= 8) return 'Type III (Medium)';
    if (score <= 11) return 'Type IV (Olive)';
    if (score <= 13) return 'Type V (Brown)';
    return 'Type VI (Black)';
  };