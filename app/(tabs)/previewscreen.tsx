import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";

const PreviewScreen = () => {
  // Safely extract photoUri from route parameters
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();
  const router = useRouter();

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.appBar}>
          {/* <Appbar.Action icon="menu" onPress={() => { }} color="#fff" /> */}
          <Appbar.Content title="  Vision AI" titleStyle={styles.title} />
          <Appbar.Action icon="cog" onPress={() => { }} color="#fff" />
        </Appbar.Header>

        {/* Photo Preview */}
        <View style={styles.imageContainer}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.errorText}>No photo to preview.</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.analyzeButton]}
            onPress={() => router.push({ pathname: "/Result", params: { photoUri } })}
          >
            <Text style={styles.buttonText}>Analyze</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000", // Black background as requested
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    // Add bottom margin if SafeAreaView isn't enough for modern devices
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 140,
    alignItems: "center",
    elevation: 2, // Minor shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  retakeButton: {
    backgroundColor: "#555555", // Neutral grey
  },
  analyzeButton: {
    backgroundColor: "#007AFF", // Distinct accent color (iOS blue)
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default PreviewScreen;