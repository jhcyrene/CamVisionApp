import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Pressable } from "react-native";
import {
  Appbar,
  Button,
  IconButton,
  MD3DarkTheme,
  Provider as PaperProvider,
  Text
} from "react-native-paper";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [focusPoint, setFocusPoint] = useState<{ x: number, y: number } | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
        console.log("Photo captured:", photo?.uri);
        if (photo?.uri) {
          router.push({ pathname: "/PreviewScreen", params: { photoUri: photo.uri } });
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  const handleFocus = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setFocusPoint({ x: locationX, y: locationY });

    // Hide the focus square after 1.5 seconds
    setTimeout(() => {
      setFocusPoint(null);
    }, 1500);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    // PaperProvider is usually wrapped at the root (App.tsx), but included here for completeness
    <PaperProvider theme={MD3DarkTheme}>
      <SafeAreaView style={styles.container}>
        {/* Top App Bar */}
        <Appbar.Header style={styles.appBar}>
          {/* <Appbar.Action icon="menu" onPress={() => { }} color="#fff" /> */}
          <Appbar.Content title="  CamVision AI" titleStyle={styles.title} />
        </Appbar.Header>

        {/* Camera Viewport Area */}
        <View style={styles.cameraViewport}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            ref={cameraRef}
            enableTorch={flashMode === 'on'}
            flash={flashMode}
            autofocus="on"
          >
          </CameraView>

          {/* Invisible layer to capture taps for focusing */}
          <Pressable style={StyleSheet.absoluteFillObject} onPress={handleFocus} />

          {/* Render the focus square where tapped */}
          {focusPoint && (
            <View
              style={[
                styles.tapFocusFrame,
                { top: focusPoint.y - 30, left: focusPoint.x - 30 }
              ]}
            />
          )}

          <Text variant="bodySmall" style={styles.subText}>
            Align object within the frame
          </Text>

          {/* Faux Framing Guide */}
          <View style={styles.focusFrame} pointerEvents="none" />

          {/* Bottom Control Bar */}
          <View style={styles.bottomBar}>
            {/* Empty space to balance the flash button on the right */}
            <View style={{ width: 48, marginLeft: 20 }} />

            <TouchableOpacity style={styles.captureButtonOuter} onPress={handleCapture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <IconButton
              style={{ marginRight: 20 }}
              icon={flashMode === 'on' ? "flash" : "flash-off"}
              iconColor={flashMode === 'on' ? "#FFD700" : "#ffffff"}
              size={32}
              onPress={() => setFlashMode(prev => prev === 'off' ? 'on' : 'off')}
            />
          </View>
        </View>

      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  permissionText: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  appBar: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  cameraViewport: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    position: "relative",
    overflow: "hidden",
  },
  focusFrame: {
    position: "absolute",
    width: width * 0.8,
    height: width * 1.0,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    borderRadius: 12,
  },
  tapFocusFrame: {
    position: "absolute",
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: "#FFCC00", // Yellow focus box
    backgroundColor: "transparent",
  },
  subText: {
    color: "#ffffff",
    position: "absolute",
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "600",
    overflow: "hidden",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  captureButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
  },
});

export default HomeScreen;
