import { searchCity, PlaceResult } from '../services/GooglePlacesService';

describe('searchCity', () => {
  beforeEach(() => {
    // Reset the fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a mapped PlaceResult array when API call is successful', async () => {
    const mockPlaces = [
      {
        displayName: "Paris",
        latitude: 48.857547499999995,
        longitude: 2.3513764999999998,
        formattedAddress: "Paris, France",
        types: ["locality", "political"]
      }
    ];

    // successful fetch response that returns our mockPlaces array
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPlaces,
    });

    const result = await searchCity("Paris");
    expect(result).toEqual([
      {
        displayName: "Paris",
        latitude: 48.857547499999995,
        longitude: 2.3513764999999998,
        formattedAddress: "Paris, France",
        types: ["locality", "political"]
      }
    ]);

    // was URL constructed with the properly encoded query?
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`?q=${encodeURIComponent("Paris")}`),
      { method: 'GET' }
    );
  });

  it('should throw an error when the response is not ok', async () => {
    // a failed fetch response with status 404
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(searchCity("Paris")).rejects.toThrow("Text Search request failed: 404");
  });

  it('should throw an error when fetch rejects (network error)', async () => {
    // fetch throwing a network error
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    await expect(searchCity("Paris")).rejects.toThrow("Network Error");
  });
});
