import { Platform } from "react-native";
import ImageColors from "react-native-image-colors";
import { mapSkinTone } from "./mapSkinTone";

export const extractDominantColor = async (imageUri: string): Promise<string | undefined> => {
    try {
          const colors = await ImageColors.getColors(imageUri, {});
          console.log("Extracted colors: ", colors);
    
          //check for colors
          if (!colors) {
            console.warn("No colors detected from the image.");
            return;
          }

          let dominantColor: string | undefined;
           
          if (colors.platform === "android") {
            dominantColor = colors.dominant;
          } else if (colors.platform === "ios"){
            dominantColor = colors.primary;
          } else {
            console.warn("Color extraction not supported on this platform.");
            return;
          }

          if(!dominantColor) {
            console.warn("No dominant color detected.");
            return;
          }

          const skinType = mapSkinTone(dominantColor);
          console.log("Detected Skin Type: ", skinType);

          return skinType;
        }catch(error){
            console.error("Error extracting color: ", error);
            return;
        }
};

export default extractDominantColor;