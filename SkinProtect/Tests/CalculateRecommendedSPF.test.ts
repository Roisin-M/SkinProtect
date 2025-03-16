import { calculateSPF } from "@/services/CalculateRecommendedSPF";


describe('calculateSPF', () => {
    // UV <= 2, low category. For skin types 1-3, SPF should be 10.
    it('returns 10 for UV index 2 and "Type I (Very Fair)"', async () => {
      const spf = await calculateSPF(2, 'Type I (Very Fair)');
      expect(spf).toBe(10);
    });
  
    // UV <= 2, low category. For skin types 4-6, SPF should be 6.
    it('returns 6 for UV index 1 and "Type IV (Olive)"', async () => {
      const spf = await calculateSPF(1, 'Type IV (Olive)');
      expect(spf).toBe(6);
    });
  
    // UV 3-5, moderate category. For skin types 1-2, SPF should be 25.
    it('returns 25 for UV index 4 and "Type I (Very Fair)"', async () => {
      const spf = await calculateSPF(4, 'Type I (Very Fair)');
      expect(spf).toBe(25);
    });
  
    // UV 3-5, moderate category. For skin types 3-4, SPF should be 20.
    it('returns 20 for UV index 5 and "Type III (Medium)"', async () => {
      const spf = await calculateSPF(5, 'Type III (Medium)');
      expect(spf).toBe(20);
    });
  
    // UV 3-5, moderate category. For skin types 5-6, SPF should be 15.
    it('returns 15 for UV index 4 and "Type V (Brown)"', async () => {
      const spf = await calculateSPF(4, 'Type V (Brown)');
      expect(spf).toBe(15);
    });
  
    // UV 6-7, high category. For skin types 1-3, SPF should be 50.
    it('returns 50 for UV index 7 and "Type I (Very Fair)"', async () => {
      const spf = await calculateSPF(7, 'Type I (Very Fair)');
      expect(spf).toBe(50);
    });
  
    // UV 6-7, high category. For skin types 4-6, SPF should be 30.
    it('returns 30 for UV index 6 and "Type IV (Olive)"', async () => {
      const spf = await calculateSPF(6, 'Type IV (Olive)');
      expect(spf).toBe(30);
    });
  
    // UV 8 and above, extreme category. For any skin type, SPF should be 50+.
    it('returns 50+ for UV index 10 and "Type VI (Black)"', async () => {
      const spf = await calculateSPF(10, 'Type VI (Black)');
      expect(spf).toBe('50+');
    });
  });