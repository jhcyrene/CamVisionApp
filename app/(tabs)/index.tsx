import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
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
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
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
          <Appbar.Content title="  Vision AI" titleStyle={styles.title} />
          <Appbar.Action icon="cog" onPress={() => { }} color="#fff" />
        </Appbar.Header>

        {/* Camera Viewport Area */}
        <View style={styles.cameraViewport}>
          <CameraView style={StyleSheet.absoluteFillObject} facing="back" ref={cameraRef}>
            {/* Overlay Container with Capture Button */}
            <View style={styles.overlay}>
              <IconButton style={{ marginLeft: 30 }} />
              <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                <Text style={styles.captureText}>Capture</Text>
              </TouchableOpacity>
              <IconButton style={{ marginLeft: 10 }}
                icon="flash"
                iconColor="#fff"
                size={32}
                onPress={() => console.log("Toggle flash")}
              />
            </View>
          </CameraView>

          <Text variant="bodySmall" style={styles.subText}>
            Align object within the frame
          </Text>

          {/* Faux Framing Guide */}
          <View style={styles.focusFrame} />

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
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderStyle: "dashed",
    borderRadius: 12,
  },
  subText: {
    color: "#ffffff",
    position: "absolute",
    top: 20, // Moved to the top so it doesn't overlap with the capture button
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 10,
    flexDirection: "row",

  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  captureText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Spread evenly
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 40, // Increased padding
  },
});

export default HomeScreen;
