export interface PlaceResult {
    displayName: string;
    latitude: number;
    longitude: number;
    formattedAddress?: string; // Full address including country
    types?: string[];
  }
  
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || ''

  export async function searchCity(
    query: string
  ): Promise<PlaceResult[]> {
    try {
      const url = 'https://places.googleapis.com/v1/places:searchText';
  
      const requestBody = {
        textQuery: query,
        pageSize: 20,
        //includedTypes: 'locality', 
        //strictTypeFiltering: false,
      };
  
      // header for required fields
      const fieldMask = 'places.displayName,places.location,places.formattedAddress,places.types';
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': fieldMask,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Text Search request failed: ${response.status}`);
      }
  
      const data = await response.json();
      if (!data.places) {
        console.log('no places found with this search')
        return [];
      }
  
      // Map the JSON 
      const results: PlaceResult[] = data.places.map((place: any) => {
        const displayName = place.displayName?.text || '';
        const latitude = place.location?.latitude ?? null;
        const longitude = place.location?.longitude ?? null;
        const formattedAddress = place.formattedAddress || '';
        const types = place.types ?? [];
        return { displayName, latitude, longitude, formattedAddress, types };
      });
  
      return results;
    } catch (error) {
      console.error('Error in searchCity:', error);
      throw error;
    }
  }
  