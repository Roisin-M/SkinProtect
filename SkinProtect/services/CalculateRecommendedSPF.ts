import { Float } from "react-native/Libraries/Types/CodegenTypes";


export async function calculateSPF(uvIndex: number, skinTypeString: string): Promise<string | number> {
    
    let skinType = mapSkinTypeStringToNumber(skinTypeString);
    // categorize the UV index
    let uvCategory: 'low' | 'moderate' | 'high' | 'extreme';
    if (uvIndex <= 2) {
      uvCategory = 'low';
      console.log('uvIndex <= 2, uv category is low',uvIndex);
    } else if (uvIndex <= 5) {
      uvCategory = 'moderate';
      console.log('uvIndex <= 5, uv category is moderate',uvIndex);
    } else if (uvIndex <= 7) {
      uvCategory = 'high';
      console.log('uvIndex <= 7, uv category is high',uvIndex);
    } else {
      uvCategory = 'extreme'; // for 8–10, 11+
      console.log('uvIndex in else, uv category is extreme',uvIndex);
    }
  
    //Decide the SPF based on (UV category + skin type).
    switch (uvCategory) {
      case 'low':
        // UV 1-2
        // Skin types 1–3 => SPF 10, types 4–6 => SPF 6
        if (skinType >= 1 && skinType <= 3) {
          return 10;
        }
        else{
          return 6; // for types 4–6
        }
  
      case 'moderate':
        // UV 3–5
        // Skin type 1–2 => 25, type 3–4 => 20, type 5–6 => 15
        if (skinType === 1 || skinType === 2) 
        {
          return 25;
        }
        if (skinType === 3 || skinType === 4) 
        {
            return 20;
        }
        else{
          return 15; // 5 or 6
        }
  
      case 'high':
        // UV 6–7
        // Skin type 1–3 => 50, type 4–6 => 30
        if (skinType >= 1 && skinType <= 3){
        return 50;
        }
        else{
          return 30; // 4–6
        }
  
      case 'extreme':
        // UV 8–10, 11+
        // Everyone => 50+
        return '50+';
    }
  }

  function mapSkinTypeStringToNumber(skinTypeStr: string): number {
    switch (skinTypeStr) {
      case 'Type I (Very Fair)':
        return 1;
      case 'Type II (Fair)':
        return 2;
      case 'Type III (Medium)':
        return 3;
      case 'Type IV (Olive)':
        return 4;
      case 'Type V (Brown)':
        return 5;
      case 'Type VI (Black)':
        return 6;
      default:
        // Fallback if your app ever has an unexpected string
        console.warn(`Unknown skin type: ${skinTypeStr}. Defaulting to 6.`);
        return 6;
    }
  }
  
  
// Example usage
(async function testSPF() {
    console.log(await calculateSPF(2, 'Type I (Very Fair)')); // => 10
    console.log(await calculateSPF(5, 'Type III (Medium)')); // => 20
    console.log(await calculateSPF(7, 'Type I (Very Fair)')); // => 50
    console.log(await calculateSPF(10, 'Type VI (Black)')); // => 50+
  })();
  