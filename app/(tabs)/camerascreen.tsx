// import { CameraView, useCameraPermissions } from "expo-camera";
// import React, { useRef } from "react";
// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// const cameraRef = useRef<CameraView>(null);

// export default function CameraScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);

//   // State 1: Permission is still loading (null)
//   if (!permission) {
//     return <View />;
//   }

//   // State 2: Permission has not been granted yet
//   if (!permission.granted) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>
//           We need your permission to use the camera
//         </Text>
//         <Button onPress={requestPermission} title="Grant Permission" />
//       </View>
//     );
//   }

//   // Function to handle image capture
//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.7,
//         });
//         console.log("Photo captured:", photo.uri);
//       } catch (error) {
//         console.error("Failed to take picture:", error);
//       }
//     }
//   };

//   async function takePicture2() {
//     if (!cameraRef.current) return;
//     const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
//     navigator.({ pathname: "/previewscreen", params: { photoUri: photo.uri } });
//   }

//   // State 3: Permission granted, render camera
//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing="back" ref={cameraRef}>
//         {/* Overlay Container */}
//         <View style={styles.overlay}>
//           <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
//             <Text style={styles.captureText}>Capture</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   permissionText: {
//     textAlign: "center",
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     position: "absolute",
//     bottom: 50,
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   captureButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40, // Half of width/height makes it a perfect circle
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 4,
//     borderColor: "white",
//   },
//   captureText: {
//     color: "#000",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
// });
