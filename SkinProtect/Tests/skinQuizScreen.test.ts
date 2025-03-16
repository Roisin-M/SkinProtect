import { determineSkinType, calculateNewScore } from "@/services/skinTypeDeterminationLogic";

describe('calculateNewScore', () => {
    it('should correctly add the score of an option to the current score', () => {
      expect(calculateNewScore(0, 2)).toBe(2);  // Initial score 0 + Option score 2
      expect(calculateNewScore(3, 4)).toBe(7);  // Initial score 3 + Option score 4
      expect(calculateNewScore(5, 1)).toBe(6);  // Initial score 5 + Option score 1
    });
});

describe('determineSkinType', () => {
    it('returns correct skin type based on score', () => {
      expect(determineSkinType(2)).toBe('Type I (Very Fair)');
      expect(determineSkinType(5)).toBe('Type II (Fair)');
      expect(determineSkinType(8)).toBe('Type III (Medium)');
      expect(determineSkinType(11)).toBe('Type IV (Olive)');
      expect(determineSkinType(13)).toBe('Type V (Brown)');
      expect(determineSkinType(14)).toBe('Type VI (Black)');
    });
});