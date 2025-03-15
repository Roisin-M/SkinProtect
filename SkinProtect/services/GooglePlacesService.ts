const ENDPOINT_BASE_URL = 'https://pvkjqihey0.execute-api.eu-west-1.amazonaws.com/dev/googleplace';

export interface PlaceResult {
    displayName: string;
    latitude: number;
    longitude: number;
    formattedAddress?: string; // Full address including country
    types?: string[];
  }
  

  export async function searchCity(query: string): Promise<PlaceResult[]> {
    try {
      // q added as parameter 
      //convert special characters
      const url = `${ENDPOINT_BASE_URL}?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`Text Search request failed: ${response.status}`);
      }
      
      const results: PlaceResult[] = await response.json();
        
      // map results
      return results.map((place: any) => ({
        displayName: place.displayName || '',
        latitude: place.latitude,
        longitude: place.longitude,
        formattedAddress: place.formattedAddress || '',
        types: place.types || []
      }));
      
    } catch (error) {
      console.error('Error in searchCity:', error);
      throw error;
    }
  }