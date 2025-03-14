import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import ImageColors from "react-native-image-colors"; 
import { extractDominantColor } from '@/app/utils/extractDominantColor';
import { extractAverageColor } from '@/app/utils/extractAverageColor';
import mapSkinTone from '@/app/utils/mapSkinTone';

export default function SkinTypeCamera({ onSkinToneDetected }: { onSkinToneDetected: (color: string) => void }) { //allow optional style
    const [facing, setFacing] = useState<CameraType>("front"); // Default to front camera - analyzing face
    const [photoUri, setPhotoUri] = useState<string>('');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null); // Use a ref to capture images

    if (!permission) return <View />; // Waiting for permission request
  
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to use the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      );
    }
    
    const capturePhoto = async () => {
        if (!cameraRef.current) {
            console.error("Camera not ready");
            return;
        }
        try {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo?.uri) {
                setPhotoUri(photo.uri);
                console.log("Captured photo URI:", photo.uri);
                getSkinType(photo.uri);
            }
        } catch (error) {
            console.error("Error capturing photo:", error);
        }
    };

    //function to get the skin type
    const getSkinType = async (uri: string) => {
        if (!uri) return;

        try {
            const averageColor = await extractAverageColor(uri);
            if (averageColor) {
                const matchedSkinType = mapSkinTone(averageColor);
                if (matchedSkinType) {
                    console.log("Detected Skin Tone:", matchedSkinType);
                    onSkinToneDetected(matchedSkinType); // Pass detected skin tone
                }
            }
        } catch (error) {
            console.error("Error detecting skin tone:", error);
        }
    }

    //function to change in between cameras
    function toggleCameraFacing() {
        setFacing(current => (current === 'front' ? 'back' : 'front'));
    }

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      ) : (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      )}
      <View style={styles.buttonContainer}>
        {!photoUri ? (
          <View style={styles.cameraButtons}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={capturePhoto}>
                <Text style={styles.text}>Capture</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setPhotoUri('')}>
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.prussianBlue,
      },
      message: {
        textAlign: "center",
        paddingBottom: 10,
      },
      camera: {
        width: "100%",
        height: "80%",
      },
      buttonContainer: {
        marginTop: 20,
      },
      button: {
        backgroundColor: Colors.paletteDarkerYellow,
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 15,
      },
      text: {
        fontSize: 18,
        color: Colors.paletteDark,
        fontWeight: 'bold',
      },
      preview: {
        width: "100%",
        height: "80%",
        resizeMode: "cover",
      },
      cameraButtons: {
        flexDirection: 'row',
      },
});
