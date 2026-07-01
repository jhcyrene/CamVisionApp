import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 1. Define the Navigation Stack Parameters
// In a real app, this is often exported from a separate navigation types file.
export type RootStackParamList = {
  Preview: { photoUri?: string };
  Result: { photoUri?: string };
};

// 2. Define the Props for this specific screen
type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

const PreviewScreen = ({ route, navigation }: Props) => {
  // Safely extract the photoUri from the route parameters
  const { photoUri } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.errorText}>No photo available to preview.</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.retakeButton]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.analyzeButton]}
          onPress={() => navigation.navigate('Result', { photoUri })}
=> navigation.navigate('Result', {photoUri})}
        activeOpacity={0.8}
        >
        <Text style={styles.buttonText}>Analyze</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background as requested
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    // Ensure it sits well above the bottom edge on de vices without physical home buttons
    paddingBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retakeButton: {
    backgroundColor: '#6b7280', // Neutral Slate Grey
  },
  analyzeButton: {
    backgroundColor: '#3b82f6', // Distinct Accent Blue
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#9ca3af',
    fontSize: 16,
  }
});

export default PreviewScreen;