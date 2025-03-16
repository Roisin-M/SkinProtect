import { getCurrentUvi, getDailyUvi } from '../services/OpenWeatherService';

describe('UV Service API Calls', () => {
  // mock for global.fetch
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  // Reset mocks after each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCurrentUvi', () => {
    it('should return the current uvIndex when the API call is successful', async () => {
      const mockUvIndex = 5.2;
      // a successful API response for current UV index
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ uvIndex: mockUvIndex }),
      });

      const result = await getCurrentUvi(40.7128, -74.0060);
      expect(result).toBe(mockUvIndex);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/currentuv?lat=40.7128&lon=-74.006')
      );
    });

    it('should return null when the response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await getCurrentUvi(40.7128, -74.0060);
      expect(result).toBeNull();
    });

    it('should catch fetch errors and return null', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));
      const result = await getCurrentUvi(40.7128, -74.0060);
      expect(result).toBeNull();
    });
  });

  describe('getDailyUvi', () => {
    it('should return the daily uvIndex when the API call is successful', async () => {
      const mockDailyUvIndex = 7.1;
      // a successful API response for daily UV index
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ uvIndex: mockDailyUvIndex }),
      });

      const result = await getDailyUvi(40.7128, -74.0060);
      expect(result).toBe(mockDailyUvIndex);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/dailyuv?lat=40.7128&lon=-74.006')
      );
    });

    it('should return null when the daily API response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await getDailyUvi(40.7128, -74.0060);
      expect(result).toBeNull();
    });

    it('should catch fetch errors for daily uv and return null', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));
      const result = await getDailyUvi(40.7128, -74.0060);
      expect(result).toBeNull();
    });
  });
});
