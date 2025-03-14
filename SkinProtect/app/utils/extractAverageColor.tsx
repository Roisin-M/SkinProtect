import { getPalette, PaletteResult } from '@somesoap/react-native-image-palette';

export const extractAverageColor = async (imageURI: string): Promise<string | undefined> => {
    try {
        //fetch color palette from the image
        const palette: PaletteResult = await getPalette(imageURI);

        //Collect all non-null color values
        const colors: string[] = Object.values(palette).filter(color => color !== undefined) as string[];

        //check if palette contains any colors
        if (colors.length === 0) {
            console.warn("No colors found in the image.");
            return;
        }

        //calculate the avg color from the palette
        const averageColor: string = calculateAverageColor(colors);

        console.log("Average Color: ", averageColor);

        return averageColor;
    } catch(error) {
        console.error("Error extracting average color: ", error);
        return;
    }
};

//helper function to calculate the avg color from the palette
const calculateAverageColor = (colors: string[]): string => {
    let r = 0, g = 0, b = 0;

    //loop through all the colors and accumulate their rgb values
    colors.forEach(color => {
        const { red, green, blue } = hexToRgb(color);

        r += red;
        g += green;
        b += blue;
    });

    const len = colors.length;
    r = Math.round(r / len);
    g = Math.round(g / len);
    b = Math.round(b / len);

    return rgbToHex(r, g, b);
};

//function to convert hex to rgb
const hexToRgb = (hex: string): {red: number, green: number, blue: number } => {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!match) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    return {
        red: parseInt(match[1], 16),
        green: parseInt(match[2], 16),
        blue: parseInt(match[3], 16)
    };
};

//function to convert rgb to hex
const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export default extractAverageColor;