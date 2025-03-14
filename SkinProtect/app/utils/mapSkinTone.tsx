export const mapSkinTone = (hexColor: string): string => {
    //list of predefined skin tones with their hex codes based on Fitzpatrick scale
    const skinTones = [
      { type: "Type I (Very Fair)", color: "#f0d1b5" }, // Very fair #FFE0D6
      { type: "Type II (Fair)", color: "#dfb593" }, // Fair #FFD1BB
      { type: "Type III (Medium)", color: "#ca9f81" }, // Light olive #FFC0A6
      { type: "Type IV (Olive)", color: "#af7954" }, // Medium #E3A787
      { type: "Type V (Brown)", color: "#9c6136" }, // Dark brown #C68642
      { type: "Type VI (Black)", color: "#3a2320" }, // Deep brown #8D5524
    ];
  
    // Convert HEX to RGB -> easier to compare in RGB format
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };
  
    //calculate the color difference between the input color from picture and predefined skin types
    const colorDiff = (color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }) => {
      return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
      );
    };
  
    //find the closest skintone
    const targetColor = hexToRgb(hexColor);
    let closestMatch = skinTones[0];
    //compare with each predefined skintone
    for (const skinTone of skinTones) {
      if (!skinTone.color) continue;
      const skinRgb = hexToRgb(skinTone.color);
      if (colorDiff(targetColor, skinRgb) < colorDiff(targetColor, hexToRgb(closestMatch.color))) {
        closestMatch = skinTone;
      }
    }
  
    //return the closest match
    return closestMatch.type;
  };

  export default mapSkinTone;