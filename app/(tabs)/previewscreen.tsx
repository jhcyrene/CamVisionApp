import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Appbar, Button, MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";

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
        </Appbar.Header>

        {/* Photo Preview */}
        <View style={styles.imageContainer}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.errorText}>No photo to preview.</Text>
          )}
        </View>

        {/* Action Buttons (Modern Bottom Panel) */}
        <View style={styles.bottomPanel}>
          <Text style={styles.panelTitle}>Select Analysis Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            <Button
              mode="contained"
              icon="school"
              onPress={() => router.push({ pathname: "/Result", params: { photoUri, promptKey: "academic" } })}
              style={styles.paperButton}
              buttonColor="#007AFF"
            >
              Academic
            </Button>

            <Button
              mode="contained"
              icon="shield-check"
              onPress={() => router.push({ pathname: "/Result", params: { photoUri, promptKey: "safety" } })}
              style={styles.paperButton}
              buttonColor="#007AFF"
            >
              Safety
            </Button>

            <Button
              mode="contained"
              icon="clipboard-list"
              onPress={() => router.push({ pathname: "/Result", params: { photoUri, promptKey: "inventory" } })}
              style={styles.paperButton}
              buttonColor="#007AFF"
            >
              Inventory
            </Button>
          </ScrollView>

          <Button
            mode="outlined"
            icon="camera-retake"
            onPress={() => router.back()}
            style={styles.retakeButtonOutlined}
            textColor="#FFFFFF"
          >
            Retake Photo
          </Button>
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
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(20, 20, 22, 0.85)", // Sleek translucent dark panel
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  panelTitle: {
    color: "#a0a0a5",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12, // Space between buttons
    alignItems: "center",
  },
  paperButton: {
    borderRadius: 12,
  },
  retakeButtonOutlined: {
    borderRadius: 12,
    borderColor: "#ffffff",
    borderWidth: 1,
    marginTop: 20,
    marginHorizontal: 20,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default PreviewScreen;